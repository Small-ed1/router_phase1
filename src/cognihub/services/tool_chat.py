from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

import httpx
from pydantic import ValidationError

from ..tools.contract import ToolRequest, FinalAnswer
from ..tools.executor import ToolExecutor

SYSTEM_TOOL_PROMPT = """You must reply with JSON only.

Return either:
{"type":"final","id":"<id>","answer":"..."}

OR:
{"type":"tool_request","id":"<id>","tool_calls":[{"id":"call_01","name":"...","arguments":{...}}]}

Rules:
- JSON only. No markdown.
- Max 6 tool calls per request.
- Prefer doc_search before web_search.
- If you don't need tools, return type="final".
"""

def _safe_json_parse(raw: str) -> Optional[dict]:
    try:
        return json.loads(raw)
    except Exception:
        return None


async def raw_ollama_call(
    *,
    http: httpx.AsyncClient,
    ollama_url: str,
    model: str,
    messages: List[Dict[str, str]],
    options: Optional[Dict[str, Any]] = None,
    keep_alive: Optional[str] = None,
) -> str:
    """Make a raw Ollama API call without tool processing."""
    payload = {
        "model": model,
        "messages": messages,
        "stream": False,
    }
    if options:
        payload["options"] = options
    if keep_alive:
        payload["keep_alive"] = keep_alive

    timeout = httpx.Timeout(60.0)  # 60 second timeout for raw calls
    resp = await http.post(f"{ollama_url}/api/chat", json=payload, timeout=timeout)
    resp.raise_for_status()
    data = resp.json()
    return data.get("message", {}).get("content", "")


async def chat_with_tool_contract(
    *,
    http: httpx.AsyncClient,
    ollama_url: str,
    model: str,
    executor: ToolExecutor,
    tools_for_prompt: List[Dict[str, str]],
    chat_id: str,
    message_id: str,
    user_text: str,
    options: Optional[Dict[str, Any]] = None,
    keep_alive: Optional[str] = None,
    max_loops: int = 3,
) -> str:
    messages: List[Dict[str, str]] = [
        {"role": "system", "content": SYSTEM_TOOL_PROMPT},
        {"role": "system", "content": "Available tools: " + json.dumps(tools_for_prompt, ensure_ascii=False)},
        {"role": "user", "content": user_text},
    ]

    for _ in range(max_loops):
        raw = await raw_ollama_call(
            http=http,
            ollama_url=ollama_url,
            model=model,
            messages=messages,
            options=options,
            keep_alive=keep_alive,
        )

        data = _safe_json_parse(raw)
        if not data:
            # 1 retry: force compliance
            messages.append({"role": "system", "content": "Invalid output. Return STRICT JSON only."})
            raw2 = await raw_ollama_call(
                http=http,
                ollama_url=ollama_url,
                model=model,
                messages=messages,
                options=options,
                keep_alive=keep_alive,
            )
            data = _safe_json_parse(raw2)
            if not data:
                # hard fallback: return plain text so user isn't bricked
                return raw

        try:
            if data.get("type") == "final":
                final = FinalAnswer.model_validate(data)
                return final.answer

            req = ToolRequest.model_validate(data)
        except ValidationError as e:
            first_error = e.errors()[0] if e.errors() else {}
            error_msg = f"Contract invalid: {first_error.get('msg', str(e))}. Return JSON matching the contract."
            messages.append({"role": "system", "content": error_msg})
            continue

        tool_result = await executor.run_calls(
            req.tool_calls,
            chat_id=chat_id,
            message_id=message_id,
            confirmation_token=None,
            request_id=req.id,
        )

        # Truncate tool results to prevent context explosion (keep under 4k chars)
        tool_result_json = json.dumps(tool_result, ensure_ascii=False)
        if len(tool_result_json) > 4000:
            # Keep the structure but truncate individual result data
            truncated = dict(tool_result)
            if "results" in truncated:
                for result in truncated["results"]:
                    if "data" in result and isinstance(result["data"], dict):
                        data_str = json.dumps(result["data"], ensure_ascii=False)
                        if len(data_str) > 1000:
                            result["data"] = {"truncated": data_str[:1000] + "..."}
            tool_result_json = json.dumps(truncated, ensure_ascii=False)

        # feed tool results back into model context
        messages.append({"role": "assistant", "content": json.dumps(data, ensure_ascii=False)})
        messages.append({"role": "system", "content": "TOOL_RESULT: " + tool_result_json})

    return "I hit the tool loop limit. Try asking with fewer steps."