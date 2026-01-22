from __future__ import annotations

import json
import time
from typing import Any, AsyncGenerator

import httpx

from .context import build_context, rag_system_prompt
from .models import ModelRegistry
from .retrieval import DocRetrievalProvider


def _validate_messages(msgs: list[dict]) -> list[dict]:
    clean = []
    for m in msgs or []:
        role = (m.get("role") or "").strip()
        content = m.get("content")
        if role not in ("system", "user", "assistant"):
            continue
        if content is None:
            content = ""
        clean.append({"role": role, "content": str(content)})
    if not clean:
        raise ValueError("No valid messages")
    return clean


async def stream_chat(
    *,
    http: httpx.AsyncClient,
    model_registry: ModelRegistry,
    ollama_url: str,
    model: str,
    messages: list[dict],
    options: dict | None,
    keep_alive: str | None,
    rag: dict | None,
    embed_model: str,
) -> AsyncGenerator[str, None]:
    if not messages or not model:
        raise ValueError("Messages and model are required")

    await model_registry.validate_model(http, model)

    if len(messages) > 100:
        raise ValueError("Too many messages")

    total_chars = sum(len(m.get("content", "")) for m in messages)
    if total_chars > 100000:
        raise ValueError("Messages too long")

    clean_messages = _validate_messages(messages)
    rag = rag or {"enabled": False}

    if rag.get("enabled"):
        last_user = next((m for m in reversed(clean_messages) if m["role"] == "user"), None)
        query = (last_user or {}).get("content", "")
        provider = DocRetrievalProvider()
        sources = await provider.retrieve(
            query,
            top_k=int(rag.get("top_k") or 6),
            doc_ids=rag.get("doc_ids"),
            embed_model=rag.get("embed_model") or embed_model,
            use_mmr=rag.get("use_mmr"),
            mmr_lambda=rag.get("mmr_lambda", 0.75),
        )

        sources_meta, context_lines = build_context(sources)
        system = rag_system_prompt(context_lines)
        clean_messages = [{"role": "system", "content": system}] + clean_messages
        yield json.dumps({"type": "sources", "sources": sources_meta}) + "\n"

    payload: dict[str, Any] = {"model": model, "messages": clean_messages, "stream": True}
    if options is not None:
        payload["options"] = options
    if keep_alive is not None:
        payload["keep_alive"] = keep_alive

    async with http.stream("POST", f"{ollama_url}/api/chat", json=payload) as r:
        r.raise_for_status()
        async for line in r.aiter_lines():
            if line.strip():
                yield line + "\n"
