from __future__ import annotations
import json
import os
from pathlib import Path
from datetime import datetime
from typing import Any
import uuid
import httpx
import threading
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

APP_TITLE = "Router Phase 1"
OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434").rstrip("/")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.2:1b")

app = FastAPI(title=APP_TITLE)
app.mount("/static", StaticFiles(directory="webui/static"), name="static")

class ChatRequest(BaseModel):
    message: str
    model: str | None = None
    temperature: float | None = None
    contextTokens: int | None = None
    mode: str = "chat"
    project: str = "default"
    text: str | None = None  # Alias for message
    task: str = "chat"  # Alternative to mode
    researchDepth: str = "standard"  # For research mode

MEMORIES_PATH = Path("memories.json")
chats_dir = Path("chats")
archived_dir = Path("chats/archived")
MEMORIES_PATH = Path("projects/default/memories.json")

_CONFIG_CACHE: dict[str, Any] = {}
_CONFIG_MTIME: float = 0
_CONFIG_LOCK = threading.RLock()
_CHAT_METADATA_CACHE: dict[str, dict[str, Any]] = {}
_CHAT_CACHE_LOCK = threading.RLock()

def _get_default_config() -> dict[str, Any]:
    return {
        "theme": "dark",
        "accent": "#007bff",
        "temperature": 0.7,
        "contextTokens": 8000,
        "defaultModel": "",
        "defaultTask": "chat",
        "showArchived": False,
        "autoModelSwitch": False,
        "autoModelSwitchMode": "suggest",
        "citationFormat": "inline",
        "maxToolCalls": 10,
        "researchDepth": "standard",
        "enableStreaming": True,
        "debugMode": False,
        "fontSize": "medium",
        "animations": True,
        "memoryLimit": 10
    }

def _load_config() -> dict[str, Any]:
    global _CONFIG_CACHE, _CONFIG_MTIME
    with _CONFIG_LOCK:
        config_path = Path("router.json")
        try:
            mtime = config_path.stat().st_mtime
            if mtime > _CONFIG_MTIME:
                with open(config_path) as f:
                    _CONFIG_CACHE = json.load(f)
                _CONFIG_MTIME = mtime
            return _CONFIG_CACHE.copy()  # Return a copy to prevent external modifications
        except Exception:
            return _get_default_config()

def _save_config(data: dict[str, Any]):
    global _CONFIG_CACHE, _CONFIG_MTIME
    with _CONFIG_LOCK:
        config_path = Path("router.json")
        current = _load_config()
        current.update(data)
        with open(config_path, 'w') as f:
            json.dump(current, f, indent=2)
        _CONFIG_MTIME = config_path.stat().st_mtime
        _CONFIG_CACHE = current  # Update cache with saved data

def _load_memories() -> list[dict[str, Any]]:
    if MEMORIES_PATH.exists():
        try:
            with open(MEMORIES_PATH) as f:
                return json.load(f)
        except Exception:
            pass
    return []

def _save_memories(memories: list[dict[str, Any]]):
    with open(MEMORIES_PATH, 'w') as f:
        json.dump(memories, f, indent=2)

# Reusable HTTP client for Ollama API calls
_OLLAMA_CLIENT = None

def _get_ollama_client() -> httpx.Client:
    global _OLLAMA_CLIENT
    if _OLLAMA_CLIENT is None:
        _OLLAMA_CLIENT = httpx.Client(timeout=5.0)
    return _OLLAMA_CLIENT

def _get_ollama_models() -> list[str]:
    try:
        client = _get_ollama_client()
        response = client.get(f"{OLLAMA_HOST}/api/tags")
        if response.status_code == 200:
            data = response.json()
            return [model["name"] for model in data.get("models", [])]
    except Exception:
        pass
    return ["llama3.2:latest"]

def _get_all_models() -> list[dict[str, str]]:
    """Get all available models including opencode.ai"""
    models = []
    
    # Add Ollama models
    ollama_models = _get_ollama_models()
    for model in ollama_models:
        models.append({"name": model, "provider": "ollama", "type": "local"})
    
    # Add opencode.ai models
    opencode_key = os.environ.get("OPENCODE_API_KEY")
    if opencode_key:
        try:
            # Try to fetch available models from opencode.ai
            with httpx.Client(timeout=5.0) as client:
                headers = {"Authorization": f"Bearer {opencode_key}"}
                response = client.get("https://api.opencode.ai/v1/models", headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    for model in data.get("data", []):
                        models.append({
                            "name": model["id"], 
                            "provider": "opencode", 
                            "type": "api"
                        })
        except Exception:
            # Fallback to default opencode models
            models.extend([
                {"name": "opencode-gpt4", "provider": "opencode", "type": "api"},
                {"name": "opencode-claude", "provider": "opencode", "type": "api"}
            ])
    else:
        # Add placeholder models to show opencode option
        models.append({"name": "opencode-gpt4", "provider": "opencode", "type": "api"})
    
    return models

@app.get("/", response_class=HTMLResponse)
def home():
    config = _load_config()
    theme = config.get("theme", "dark")
    accent = config.get("accent", "#007bff")
    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{APP_TITLE}</title>
    <link rel="stylesheet" href="/static/css/{theme}.css">
    <style>
        :root {{
            --accent-color: {accent};
        }}
        body {{
            background: { '#ffffff' if theme == 'light' else '#0b0f17' };
            color: { '#212529' if theme == 'light' else '#e6eefc' };
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }}
        body.font-small {{ font-size: 12px; }}
        body.font-medium {{ font-size: 14px; }}
        body.font-large {{ font-size: 16px; }}
        body.no-animations * {{ transition: none !important; animation: none !important; }}

        .top-bar {{
            position: fixed; top: 0; left: 0; right: 0; height: 50px;
            background: var(--card-bg); border-bottom: 1px solid var(--border-color);
            display: flex; align-items: center; padding: 0 15px; gap: 10px;
            z-index: 1000;
        }}
        .top-bar-btn {{
            background: none; border: none; font-size: 18px; cursor: pointer;
            padding: 8px 12px; border-radius: 6px; color: var(--text-color);
        }}
        .top-bar-btn:hover {{ background: var(--hover-bg); }}
        .app-title {{ font-weight: 600; font-size: 16px; margin-left: auto; margin-right: auto; }}

        .sidebar {{
            position: fixed; left: 0; top: 50px; bottom: 0; width: 280px;
            background: var(--card-bg); border-right: 1px solid var(--border-color);
            transform: translateX(-100%); transition: transform 0.3s ease;
            display: flex; flex-direction: column; z-index: 999;
        }}
        .sidebar.open {{ transform: translateX(0); }}
        .sidebar-tabs {{
            display: flex; border-bottom: 1px solid var(--border-color);
        }}
        .sidebar-tab {{
            flex: 1; padding: 12px 8px; background: none; border: none;
            cursor: pointer; font-size: 12px; color: var(--text-muted);
            border-bottom: 2px solid transparent;
        }}
        .sidebar-tab.active {{
            color: var(--accent-color); border-bottom-color: var(--accent-color);
        }}
        .sidebar-content {{
            flex: 1; overflow-y: auto; padding: 15px;
        }}
        .sidebar-section {{ display: none; }}
        .sidebar-section.active {{ display: block; }}

        .chat-list-item {{
            padding: 10px; margin-bottom: 8px; border-radius: 8px;
            background: var(--bg-secondary); cursor: pointer;
        }}
        .chat-list-item:hover {{ background: var(--hover-bg); }}
        .chat-list-item.active {{ background: var(--accent-color); color: white; }}
        .chat-list-item h4 {{ margin: 0 0 4px 0; font-size: 14px; }}
        .chat-list-item p {{ margin: 0; font-size: 11px; color: var(--text-muted); }}
        .chat-list-item .chat-actions {{
            margin-top: 8px; display: flex; gap: 5px; flex-wrap: wrap;
        }}
        .chat-list-item .chat-actions button {{
            font-size: 10px; padding: 3px 8px; border-radius: 4px;
        }}

        .main-content {{
            margin-top: 50px; padding: 20px; min-height: calc(100vh - 50px);
        }}
        .chat-container {{
            max-width: 800px; margin: 0 auto;
        }}
        .messages-area {{
            min-height: 60vh; margin-bottom: 20px;
        }}
        .bubble {{
            padding: 12px 16px; margin-bottom: 12px; border-radius: 12px;
            max-width: 85%; line-height: 1.5;
        }}
        .bubble.u {{
            background: var(--accent-color); color: white;
            margin-left: auto; border-bottom-right-radius: 4px;
        }}
        .bubble.a {{
            background: var(--bg-secondary); margin-right: auto;
            border-bottom-left-radius: 4px;
        }}
        .bubble.tool {{
            background: var(--border-color); font-family: monospace; font-size: 12px;
        }}
        .input-area {{
            position: sticky; bottom: 20px;
        }}
        .input-wrapper {{
            display: flex; gap: 10px; background: var(--card-bg);
            border: 1px solid var(--border-color); border-radius: 12px;
            padding: 10px;
        }}
        #prompt {{
            flex: 1; background: none; border: none;
            color: var(--text-color); font-size: 14px; resize: none;
            max-height: 120px; outline: none;
        }}
        .send-btn {{
            background: var(--accent-color); color: white; border: none;
            padding: 10px 20px; border-radius: 8px; cursor: pointer;
            font-weight: 600;
        }}
        .send-btn:disabled {{ opacity: 0.5; cursor: not-allowed; }}

        .settings-overlay {{
            position: fixed; inset: 0; background: rgba(0,0,0,0.7);
            z-index: 2000; display: none; justify-content: center; align-items: flex-start;
            padding-top: 60px; overflow-y: auto;
        }}
        .settings-overlay.open {{ display: flex; }}
        .settings-modal {{
            width: 90%; max-width: 600px; max-height: calc(100vh - 100px);
            background: var(--card-bg); border-radius: 16px; overflow: hidden;
            margin-bottom: 50px;
        }}
        .settings-header {{
            padding: 20px; border-bottom: 1px solid var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
        }}
        .settings-header h2 {{ margin: 0; }}
        .settings-close {{
            background: none; border: none; font-size: 24px; cursor: pointer;
            color: var(--text-muted);
        }}
        .settings-body {{
            padding: 20px; overflow-y: auto; max-height: calc(100vh - 200px);
        }}
        .settings-section {{
            margin-bottom: 25px; padding-bottom: 20px;
            border-bottom: 1px solid var(--border-color);
        }}
        .settings-section:last-child {{ border-bottom: none; }}
        .settings-section h3 {{
            margin: 0 0 15px 0; font-size: 16px; color: var(--accent-color);
        }}
        .setting-row {{
            margin-bottom: 15px;
        }}
        .setting-row label {{ display: block; margin-bottom: 6px; font-size: 13px; }}
        .setting-row input[type="text"],
        .setting-row input[type="number"],
        .setting-row select {{
            width: 100%; padding: 8px 12px; border-radius: 6px;
            border: 1px solid var(--border-color); background: var(--bg-secondary);
            color: var(--text-color);
        }}
        .setting-row select {{
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='currentColor' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            padding-right: 35px;
            cursor: pointer;
        }}
        .setting-row select:focus {{
            outline: none;
            border-color: var(--accent-color);
        }}
        .setting-row select option {{
            background: var(--card-bg);
            color: var(--text-color);
            padding: 10px;
        }}

        /* Sidebar select styling */
        #modelSelect, #presetSelect, #taskSelect, #autoSwitchMode {{
            width: 100%; padding: 10px 12px; border-radius: 6px;
            border: 1px solid var(--border-color); background: var(--bg-secondary);
            color: var(--text-color); font-size: 14px;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='currentColor' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            padding-right: 35px;
            cursor: pointer;
        }}
        #modelSelect:focus, #presetSelect:focus, #taskSelect:focus, #autoSwitchMode:focus {{
            outline: none;
            border-color: var(--accent-color);
        }}
        #modelSelect option, #presetSelect option, #taskSelect option, #autoSwitchMode option {{
            background: var(--card-bg);
            color: var(--text-color);
            padding: 12px;
        }}

        .setting-row input[type="range"] {{ width: 100%; }}
        .setting-row input[type="color"] {{
            width: 40px; height: 30px; border: none; cursor: pointer;
        }}
        .setting-row .radio-group {{ display: flex; gap: 15px; }}
        .setting-row .radio-group label {{
            display: flex; align-items: center; gap: 6px; cursor: pointer;
        }}
        .setting-row .checkbox-group label {{
            display: flex; align-items: center; gap: 8px; cursor: pointer;
        }}

        .memory-list {{
            max-height: 200px; overflow-y: auto; margin-bottom: 10px;
        }}
        .memory-item {{
            padding: 8px 12px; background: var(--bg-secondary);
            margin-bottom: 6px; border-radius: 6px; display: flex;
            justify-content: space-between; align-items: center;
        }}
        .memory-item-content {{ flex: 1; }}
        .memory-item-key {{ font-weight: 600; font-size: 12px; }}
        .memory-item-value {{ font-size: 13px; color: var(--text-muted); }}

        .research-options {{
            display: none; padding: 15px; background: var(--bg-secondary);
            border-radius: 8px; margin-top: 10px;
        }}
        .research-options.visible {{ display: block; }}
        .research-presets {{
            display: flex; gap: 8px; margin-bottom: 10px;
        }}
        .research-presets button {{
            flex: 1; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);
            background: var(--card-bg); color: var(--text-color); cursor: pointer;
        }}
        .research-presets button.active {{
            background: var(--accent-color); color: white; border-color: var(--accent-color);
        }}

        .progress-bar {{
            position: fixed; top: 50px; left: 0; right: 0; height: 3px;
            background: var(--accent-color); transform: scaleX(0);
            transform-origin: left; z-index: 1001;
        }}
        .progress-bar.active {{ animation: progress 2s ease-in-out; }}
        @keyframes progress {{ 0% {{ transform: scaleX(0); }} 50% {{ transform: scaleX(0.7); }} 100% {{ transform: scaleX(1); }} }}

        @media (max-width: 768px) {{
            .sidebar {{ width: 100%; }}
            .chat-container {{ padding: 0 10px; }}
        }}
    </style>
</head>
<body>
    <div class="top-bar">
        <button class="top-bar-btn" id="toggleSidebar" title="Toggle Sidebar">☰</button>
        <span class="app-title">{APP_TITLE}</span>
        <button class="top-bar-btn" id="settingsBtn" title="Settings">⚙️</button>
    </div>

    <div class="sidebar" id="sidebar">
        <div class="sidebar-tabs">
            <button class="sidebar-tab active" data-tab="chats">Chats</button>
            <button class="sidebar-tab" data-tab="model">Model</button>
            <button class="sidebar-tab" data-tab="opencode">OpenCode</button>
            <button class="sidebar-tab" data-tab="task">Task</button>
        </div>
        <div class="sidebar-content">
            <div class="sidebar-section active" id="section-chats">
                <div style="margin-bottom: 15px;">
                    <input type="text" id="chatSearch" placeholder="Search chats..."
                        style="width:100%; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-color);">
                </div>
                <button class="send-btn" id="newChatBtn" style="width:100%; margin-bottom:15px;">+ New Chat</button>
                <div id="chatList"></div>
            </div>
            <div class="sidebar-section" id="section-model">
                <div class="setting-row">
                    <label>Select Model</label>
                    <select id="modelSelect"></select>
                </div>
                <div class="setting-row">
                    <label>Provider</label>
                    <span id="modelProvider" style="color: var(--text-muted); font-size: 0.9em;"></span>
                </div>
            </div>
            <div class="sidebar-section" id="section-opencode">
                <h3 style="margin-bottom: 15px; color: var(--accent-color);">OpenCode.ai Integration</h3>
                <div class="setting-row">
                    <label>API Key</label>
                    <input type="password" id="opencodeApiKey" placeholder="Enter your OpenCode API key"
                        style="flex:1; padding:8px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-color);">
                </div>
                <div class="setting-row">
                    <label>Feature: Intelligent Tool Selection</label>
                    <span style="color: var(--text-muted); font-size: 0.9em;">Automatically selects best tools based on semantic analysis and learning data</span>
                </div>
                <div class="setting-row">
                    <label>Feature: Tool Usage Learning</label>
                    <span style="color: var(--text-muted); font-size: 0.9em;">Learns from tool usage patterns to improve recommendations</span>
                </div>
                <button class="send-btn" onclick="saveOpenCodeSettings()" style="margin-top: 15px;">Save Settings</button>
                <button class="send-btn" onclick="testOpenCodeConnection()" style="margin-top: 10px; background: var(--bg-secondary);">Test Connection</button>
                <div id="opencodeStatus" style="margin-top: 10px; padding: 8px; border-radius: 6px; display: none;"></div>
            </div>
                <div class="setting-row">
                    <label>Model Preset</label>
                    <select id="presetSelect">
                        <option value="router">Auto (Intent Router)</option>
                        <option value="fast">Fast (1-3B)</option>
                        <option value="balanced">Balanced (7-8B)</option>
                        <option value="deep">Deep (70B+)</option>
                    </select>
                </div>
                <div class="setting-row">
                    <label><input type="checkbox" id="autoSwitchEnabled"> Auto-switch model based on intent</label>
                </div>
                <div class="setting-row" id="autoSwitchModeRow" style="display:none;">
                    <label>Switching Behavior</label>
                    <select id="autoSwitchMode">
                        <option value="suggest">Suggest (ask confirmation)</option>
                        <option value="auto">Auto-switch silently</option>
                    </select>
                </div>
            </div>
            <div class="sidebar-section" id="section-task">
                <div class="setting-row">
                    <label>Task Mode</label>
                    <select id="taskSelect">
                        <option value="chat">Chat - Standard conversation</option>
                        <option value="research">Research - Deep analysis with sources</option>
                    </select>
                </div>
                <div class="research-options" id="researchOptions">
                    <label>Research Depth</label>
                    <div class="research-presets">
                        <button data-depth="quick" class="research-btn">Quick (2 min)</button>
                        <button data-depth="standard" class="research-btn active">Standard (10 min)</button>
                        <button data-depth="deep" class="research-btn">Deep (30 min)</button>
                    </div>
                    <div class="setting-row">
                        <input type="range" id="researchTime" min="1" max="60" value="10">
                        <span id="researchTimeDisplay">10 minutes</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="main-content">
        <div class="chat-container">
            <div id="currentTaskDisplay" style="margin-bottom:10px;font-weight:bold;color:var(--text-muted);"></div>
            <div id="messagesArea" class="messages-area"></div>
            <div class="input-area">
                <div class="input-wrapper">
                    <textarea id="prompt" placeholder="Type your message..." rows="1"></textarea>
                    <button class="send-btn" id="sendBtn">Send</button>
                </div>
            </div>
        </div>
    </div>

    <div class="settings-overlay" id="settingsOverlay">
        <div class="settings-modal">
            <div class="settings-header">
                <h2>Settings</h2>
                <button class="settings-close" id="closeSettings">×</button>
            </div>
            <div class="settings-body">
                <div class="settings-section">
                    <h3>Appearance</h3>
                    <div class="setting-row">
                        <label>Theme</label>
                        <div class="radio-group">
                            <label><input type="radio" name="theme" value="light"> Light</label>
                            <label><input type="radio" name="theme" value="dark" checked> Dark</label>
                        </div>
                    </div>
                    <div class="setting-row">
                        <label>Accent Color</label>
                        <input type="color" id="accentColor" value="#007bff">
                    </div>
                    <div class="setting-row">
                        <label>Font Size</label>
                        <select id="fontSize">
                            <option value="small">Small</option>
                            <option value="medium" selected>Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                    <div class="setting-row checkbox-group">
                        <label><input type="checkbox" id="enableAnimations" checked> Enable Animations</label>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>Model Behavior</h3>
                    <div class="setting-row">
                        <label>Temperature: <span id="tempDisplay">0.7</span></label>
                        <input type="range" id="temperature" min="0" max="2" step="0.1" value="0.7">
                    </div>
                    <div class="setting-row">
                        <label>Context Tokens: <span id="ctxDisplay">8000</span></label>
                        <input type="range" id="contextTokens" min="1000" max="128000" step="1000" value="8000">
                    </div>
                    <div class="setting-row">
                        <label>Max Tool Calls</label>
                        <input type="range" id="maxToolCalls" min="1" max="50" value="10">
                    </div>
                    <div class="setting-row checkbox-group">
                        <label><input type="checkbox" id="enableStreaming" checked> Enable Streaming Response</label>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>Defaults</h3>
                    <div class="setting-row">
                        <label>Default Model</label>
                        <select id="defaultModel"></select>
                    </div>
                    <div class="setting-row">
                        <label>Default Task</label>
                        <select id="defaultTask">
                            <option value="chat">Chat</option>
                            <option value="research">Deep Research</option>
                        </select>
                    </div>
                    <div class="setting-row">
                        <label>Citation Format</label>
                        <select id="citationFormat">
                            <option value="inline">Inline [1]</option>
                            <option value="footnotes">Footnotes</option>
                            <option value="links">Links</option>
                        </select>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>Chat Features</h3>
                    <div class="setting-row checkbox-group">
                        <label><input type="checkbox" id="showArchived"> Show Archived Chats</label>
                    </div>
                    <div class="setting-row">
                        <label>Research Depth Preset</label>
                        <select id="researchDepth">
                            <option value="quick">Quick (2 min)</option>
                            <option value="standard" selected>Standard (10 min)</option>
                            <option value="deep">Deep (30 min)</option>
                        </select>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>Memory Features</h3>
                    <div class="setting-row">
                        <label>User Memories (ChatGPT-like)</label>
                        <div class="memory-list" id="memoryList"></div>
                        <button class="send-btn" id="addMemoryBtn" style="font-size:12px;padding:6px 12px;">+ Add Memory</button>
                    </div>
                    <div class="setting-row">
                        <label>Max Memories: <span id="memoryLimitDisplay">10</span></label>
                        <input type="range" id="memoryLimit" min="1" max="50" value="10">
                    </div>
                </div>

                <div class="settings-section">
                    <h3>Advanced</h3>
                    <div class="setting-row checkbox-group">
                        <label><input type="checkbox" id="debugMode"> Debug Mode</label>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="progress-bar" id="progressBar"></div>

<script>
    // State
    var config = {{}};
    var currentChatId = localStorage.getItem('currentChatId') || null;
    var currentModel = localStorage.getItem('currentModel') || 'llama3.2:latest';
    var currentTask = localStorage.getItem('currentTask') || 'chat';
    var currentResearchDepth = localStorage.getItem('researchDepth') || 'standard';
    var autoModelSwitch = false;
    var autoModelSwitchMode = 'suggest';
    var isStreaming = false;

    // Elements
    var promptEl = document.getElementById('prompt');
    var messagesArea = document.getElementById('messagesArea');
    var sendBtn = document.getElementById('sendBtn');
    var sidebar = document.getElementById('sidebar');
    var settingsOverlay = document.getElementById('settingsOverlay');
    var chatList = document.getElementById('chatList');
    var modelSelect = document.getElementById('modelSelect');
    var taskSelect = document.getElementById('taskSelect');
    var researchOptions = document.getElementById('researchOptions');

    // Utility functions
    function showProgress() {{ document.getElementById('progressBar').classList.add('active'); }}
    function hideProgress() {{ document.getElementById('progressBar').classList.remove('active'); }}
    function saveSetting(key, value) {{
        fetch('/api/settings', {{
            method: 'POST',
            headers: {{'Content-Type': 'application/json'}},
            body: JSON.stringify({{[key]: value}})
        }});
    }}

    function addMessage(role, text) {{
        var div = document.createElement('div');
        div.className = 'bubble ' + role;
        div.textContent = text || '';
        messagesArea.appendChild(div);
        messagesArea.scrollTop = messagesArea.scrollHeight;
        return div;
    }}

    // Sidebar tabs
    document.querySelectorAll('.sidebar-tab').forEach(function(tab) {{
        tab.addEventListener('click', function() {{
            document.querySelectorAll('.sidebar-tab').forEach(function(t) {{ t.classList.remove('active'); }});
            document.querySelectorAll('.sidebar-section').forEach(function(s) {{ s.classList.remove('active'); }});
            tab.classList.add('active');
            document.getElementById('section-' + tab.dataset.tab).classList.add('active');
        }});
    }});

    // Sidebar toggle
    document.getElementById('toggleSidebar').onclick = function() {{ sidebar.classList.toggle('open'); }};
    sidebar.addEventListener('click', function(e) {{ if (e.target === sidebar) sidebar.classList.remove('open'); }});

    // Settings overlay
    document.getElementById('settingsBtn').onclick = function() {{
        settingsOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        loadSettings();
    }};
    document.getElementById('closeSettings').onclick = closeSettings;
    settingsOverlay.onclick = function(e) {{ if (e.target === settingsOverlay) closeSettings(); }};
    document.addEventListener('keydown', function(e) {{ if (e.key === 'Escape') closeSettings(); }});

    function closeSettings() {{
        settingsOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }}

    // Load settings
    async function loadSettings() {{
        var r = await fetch('/api/settings');
        config = await r.json();

        // Theme
        document.querySelectorAll('input[name="theme"]').forEach(function(el) {{
            el.checked = el.value === config.theme;
        }});

        // Accent color
        document.getElementById('accentColor').value = config.accent || '#007bff';
        document.getElementById('fontSize').value = config.fontSize || 'medium';
        document.getElementById('enableAnimations').checked = config.animations !== false;

        // Temperature
        document.getElementById('temperature').value = config.temperature || 0.7;
        document.getElementById('tempDisplay').textContent = config.temperature || 0.7;
        document.getElementById('contextTokens').value = config.contextTokens || 8000;
        document.getElementById('ctxDisplay').textContent = config.contextTokens || 8000;
        document.getElementById('maxToolCalls').value = config.maxToolCalls || 10;
        document.getElementById('enableStreaming').checked = config.enableStreaming !== false;

        // Defaults
        document.getElementById('defaultModel').value = config.defaultModel || '';
        document.getElementById('defaultTask').value = config.defaultTask || 'chat';
        document.getElementById('citationFormat').value = config.citationFormat || 'inline';

        // Chat features
        document.getElementById('showArchived').checked = config.showArchived || false;
        document.getElementById('researchDepth').value = config.researchDepth || 'standard';
        autoModelSwitch = config.autoModelSwitch || false;
        autoModelSwitchMode = config.autoModelSwitchMode || 'suggest';
        document.getElementById('autoSwitchEnabled').checked = autoModelSwitch;
        document.getElementById('autoSwitchMode').value = autoModelSwitchMode;
        document.getElementById('autoSwitchModeRow').style.display = autoModelSwitch ? 'block' : 'none';

        // Memory
        document.getElementById('memoryLimit').value = config.memoryLimit || 10;
        document.getElementById('memoryLimitDisplay').textContent = config.memoryLimit || 10;
        loadMemories();

        // Advanced
        document.getElementById('debugMode').checked = config.debugMode || false;

        addSettingsListeners();
    }}

    function addSettingsListeners() {{
        // Theme
        document.querySelectorAll('input[name="theme"]').forEach(function(radio) {{
            radio.onchange = async function(e) {{
                await saveSetting('theme', e.target.value);
                location.reload();
            }};
        }});

        // Accent color
        document.getElementById('accentColor').onchange = async function(e) {{
            await saveSetting('accent', e.target.value);
            document.documentElement.style.setProperty('--accent-color', e.target.value);
        }};

        // Font size
        document.getElementById('fontSize').onchange = async function(e) {{
            await saveSetting('fontSize', e.target.value);
            document.body.className = document.body.className.replace(/font-\\w+/g, '').trim();
            document.body.classList.add('font-' + e.target.value);
        }};

        // Animations
        document.getElementById('enableAnimations').onchange = async function(e) {{
            await saveSetting('animations', e.target.checked);
            document.body.classList.toggle('no-animations', !e.target.checked);
        }};

        // Temperature
        document.getElementById('temperature').oninput = function(e) {{
            document.getElementById('tempDisplay').textContent = e.target.value;
        }};
        document.getElementById('temperature').onchange = async function(e) {{
            await saveSetting('temperature', parseFloat(e.target.value));
        }};

        // Context tokens
        document.getElementById('contextTokens').oninput = function(e) {{
            document.getElementById('ctxDisplay').textContent = e.target.value;
        }};
        document.getElementById('contextTokens').onchange = async function(e) {{
            await saveSetting('contextTokens', parseInt(e.target.value));
        }};

        // Max tool calls
        document.getElementById('maxToolCalls').onchange = async function(e) {{
            await saveSetting('maxToolCalls', parseInt(e.target.value));
        }};

        // Streaming
        document.getElementById('enableStreaming').onchange = async function(e) {{
            await saveSetting('enableStreaming', e.target.checked);
        }};

        // Default model
        document.getElementById('defaultModel').onchange = async function(e) {{
            await saveSetting('defaultModel', e.target.value);
        }};

        // Default task
        document.getElementById('defaultTask').onchange = async function(e) {{
            await saveSetting('defaultTask', e.target.value);
        }};

        // Citation format
        document.getElementById('citationFormat').onchange = async function(e) {{
            await saveSetting('citationFormat', e.target.value);
        }};

        // OpenCode settings
        document.getElementById('opencodeApiKey').onchange = async function(e) {{
            await saveSetting('opencodeApiKey', e.target.value);
        }};
    }};

    async function saveOpenCodeSettings() {{
        const apiKey = document.getElementById('opencodeApiKey').value;
        if (!apiKey) {{
            showOpenCodeStatus('Please enter an API key', 'error');
            return;
        }}
        
        await saveSetting('opencodeApiKey', apiKey);
        
        // Test the connection
        await testOpenCodeConnection();
    }}

    async function testOpenCodeConnection() {{
        const statusDiv = document.getElementById('opencodeStatus');
        showOpenCodeStatus('Testing connection...', 'info');
        
        try {{
            const response = await fetch('/api/opencode/test', {{
                method: 'POST',
                headers: {{
                    'Content-Type': 'application/json'
                }},
                body: JSON.stringify({{
                    apiKey: document.getElementById('opencodeApiKey').value
                }})
            }});
            
            const result = await response.json();
            
            if (result.success) {{
                showOpenCodeStatus('✓ Connection successful! OpenCode.ai is ready.', 'success');
                // Refresh models to show OpenCode options
                await loadModels();
            }} else {{
                showOpenCodeStatus(`✗ Connection failed: ${{result.error}}`, 'error');
            }}
        }} catch (error) {{
            showOpenCodeStatus(`✗ Connection error: ${{error.message}}`, 'error');
        }}
    }}

    function showOpenCodeStatus(message, type) {{
        const statusDiv = document.getElementById('opencodeStatus');
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        
        if (type === 'success') {{
            statusDiv.style.background = 'rgba(34, 197, 94, 0.1)';
            statusDiv.style.color = '#22c55e';
            statusDiv.style.border = '1px solid #22c55e';
        }} else if (type === 'error') {{
            statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
            statusDiv.style.color = '#ef4444';
            statusDiv.style.border = '1px solid #ef4444';
        }} else {{
            statusDiv.style.background = 'rgba(59, 130, 246, 0.1)';
            statusDiv.style.color = '#3b82f6';
            statusDiv.style.border = '1px solid #3b82f6';
        }}
    }}

    // Load models
    async function loadModels() {{
        try {{
            var r = await fetch('/api/models');
            var data = await r.json();
            var models = data.items || [];

            modelSelect.innerHTML = '';
            document.getElementById('defaultModel').innerHTML = '';

            // Enhanced model display with provider info
            if (data.providers) {{
                data.providers.forEach(function(provider) {{
                    var displayName = provider.name + ' (' + provider.provider + ')';
                    modelSelect.innerHTML += '<option value="' + provider.name + '">' + displayName + '</option>';
                    document.getElementById('defaultModel').innerHTML += '<option value="' + provider.name + '">' + displayName + '</option>';
                }});
            }} else {{
                models.forEach(function(m) {{
                    modelSelect.innerHTML += '<option value="' + m + '">' + m + '</option>';
                    document.getElementById('defaultModel').innerHTML += '<option value="' + m + '">' + m + '</option>';
                }});
            }}

            modelSelect.value = currentModel;
        }} catch(e) {{
            console.error('Error loading models:', e);
        }}
    }}

    // Chat management
    async function loadChats() {{
        try {{
            var r = await fetch('/api/chats');
            var allChats = await r.json();
            var searchTerm = (document.getElementById('chatSearch') ? document.getElementById('chatSearch').value : '').toLowerCase();

            var chats = allChats || [];
            if (searchTerm) {{
                chats = chats.filter(function(c) {{
                    return c.title.toLowerCase().includes(searchTerm) ||
                           (c.summary && c.summary.toLowerCase().includes(searchTerm));
                }});
            }}

            chatList.innerHTML = '';
            chats.sort(function(a, b) {{ return new Date(b.created_at) - new Date(a.created_at); }});

            chats.forEach(function(chat) {{
                var div = document.createElement('div');
                div.className = 'chat-list-item' + (chat.id === currentChatId ? ' active' : '');
                div.innerHTML = '<h4>' + chat.title + '</h4>' +
                    '<p>' + (chat.summary || 'No summary') + ' • ' + new Date(chat.created_at).toLocaleDateString() + '</p>' +
                    (chat.archived ? '<span style="font-size:10px;background:var(--border-color);padding:2px 6px;border-radius:4px;">Archived</span>' : '') +
                    '<div class="chat-actions">' +
                    '<button onclick="switchChat(\\'' + chat.id + '\\')">Load</button>' +
                    '<button onclick="renameChat(\\'' + chat.id + '\\')">Rename</button>' +
                    '<button onclick="deleteChat(\\'' + chat.id + '\\')">Delete</button>' +
                    (!chat.archived ? '<button onclick="archiveChat(\\'' + chat.id + '\\')">Archive</button>' : '') +
                    '</div>';
                div.onclick = function(e) {{ if (!e.target.matches('button')) switchChat(chat.id); }};
                chatList.appendChild(div);
            }});
        }} catch(e) {{
            console.error('Error loading chats:', e);
        }}
    }}

    async function switchChat(chatId) {{
        try {{
            var r = await fetch('/api/chats/' + chatId);
            var chat = await r.json();
            if (!chat || !chat.messages) return;
            currentChatId = chatId;
            localStorage.setItem('currentChatId', chatId);
            messagesArea.innerHTML = '';
            chat.messages.forEach(function(msg) {{ addMessage(msg.role, msg.content); }});
            sidebar.classList.remove('open');
            loadChats();
        }} catch(e) {{
            console.error('Error switching chat:', e);
        }}
    }}

    document.getElementById('newChatBtn').onclick = async function() {{
        var r = await fetch('/api/chats', {{method: 'POST'}});
        var data = await r.json();
        await switchChat(data.id);
    }};

    window.renameChat = async function(chatId) {{
        var newTitle = prompt('New chat title:');
        if (!newTitle) return;
        await fetch('/api/chats/' + chatId, {{
            method: 'PUT',
            headers: {{'Content-Type': 'application/json'}},
            body: JSON.stringify({{title: newTitle}})
        }});
        loadChats();
    }};

    window.deleteChat = async function(chatId) {{
        if (!confirm('Delete this chat permanently?')) return;
        await fetch('/api/chats/' + chatId, {{method: 'DELETE'}});
        if (chatId === currentChatId) {{
            currentChatId = null;
            localStorage.removeItem('currentChatId');
            messagesArea.innerHTML = '';
        }}
        loadChats();
    }};

    window.archiveChat = async function(chatId) {{
        await fetch('/api/chats/' + chatId + '/archive', {{method: 'POST'}});
        if (chatId === currentChatId) {{
            currentChatId = null;
            localStorage.removeItem('currentChatId');
            messagesArea.innerHTML = '';
        }}
        loadChats();
    }};

    if (document.getElementById('chatSearch')) {{
        document.getElementById('chatSearch').addEventListener('input', loadChats);
    }}

    // Task switching
    taskSelect.value = currentTask;
    taskSelect.onchange = function() {{
        currentTask = taskSelect.value;
        localStorage.setItem('currentTask', currentTask);
        researchOptions.classList.toggle('visible', currentTask === 'research');
        updateTaskDisplay();
    }};

    function updateTaskDisplay() {{
        var display = document.getElementById('currentTaskDisplay');
        var names = {{chat: 'Chat Mode', research: 'Deep Research'}};
        display.textContent = names[currentTask] || 'Chat Mode';
    }}

    // Research depth presets
    function updateResearchPreset(depth) {{
        document.querySelectorAll('.research-btn').forEach(function(btn) {{
            btn.classList.toggle('active', btn.dataset.depth === depth);
        }});
        var times = {{quick: 2, standard: 10, deep: 30}};
        document.getElementById('researchTime').value = times[depth] || 10;
        document.getElementById('researchTimeDisplay').textContent = (times[depth] || 10) + ' minutes';
    }}

    document.querySelectorAll('.research-btn').forEach(function(btn) {{
        btn.onclick = function() {{
            currentResearchDepth = btn.dataset.depth;
            localStorage.setItem('researchDepth', currentResearchDepth);
            updateResearchPreset(currentResearchDepth);
            saveSetting('researchDepth', currentResearchDepth);
        }};
    }});

    document.getElementById('researchTime').oninput = function(e) {{
        document.getElementById('researchTimeDisplay').textContent = e.target.value + ' minutes';
    }};

    // Model switching
    modelSelect.value = currentModel;
    modelSelect.onchange = function() {{
        currentModel = modelSelect.value;
        localStorage.setItem('currentModel', currentModel);
    }};

    document.getElementById('presetSelect').onchange = function(e) {{
        var presets = {{
            'router': null,
            'fast': 'llama3.2:1b',
            'balanced': 'llama3.2:latest',
            'deep': 'llama3.1:8b'
        }};
        if (presets[e.target.value]) {{
            currentModel = presets[e.target.value];
            modelSelect.value = currentModel;
            localStorage.setItem('currentModel', currentModel);
        }} else {{
            currentModel = 'router';
            localStorage.setItem('currentModel', 'router');
        }}
    }};

    document.getElementById('autoSwitchEnabled').onchange = function(e) {{
        autoModelSwitch = e.target.checked;
        document.getElementById('autoSwitchModeRow').style.display = autoModelSwitch ? 'block' : 'none';
    }};

    // Memory management
    async function loadMemories() {{
        try {{
            var r = await fetch('/api/memories');
            var memories = await r.json();
            var list = document.getElementById('memoryList');
            list.innerHTML = '';
            (memories || []).forEach(function(mem) {{
                var div = document.createElement('div');
                div.className = 'memory-item';
                div.innerHTML = '<div class="memory-item-content">' +
                    '<div class="memory-item-key">' + mem.key + '</div>' +
                    '<div class="memory-item-value">' + mem.value + '</div>' +
                    '</div>' +
                    '<button onclick="deleteMemory(\\'' + mem.key + '\\')" style="background:none;border:none;color:var(--text-muted);cursor:pointer;">×</button>';
                list.appendChild(div);
            }});
        }} catch(e) {{
            console.error('Error loading memories:', e);
        }}
    }}

    document.getElementById('addMemoryBtn').onclick = function() {{
        var key = prompt('Memory key (e.g., "my_name"):');
        if (!key) return;
        var value = prompt('Memory value (e.g., "Alex"):');
        if (!value) return;
        fetch('/api/memories', {{
            method: 'POST',
            headers: {{'Content-Type': 'application/json'}},
            body: JSON.stringify({{key: key, value: value}})
        }}).then(loadMemories);
    }};

    window.deleteMemory = function(key) {{
        fetch('/api/memories/' + encodeURIComponent(key), {{method: 'DELETE'}}).then(loadMemories);
    }};

    // Send message
    sendBtn.onclick = sendMessage;
    promptEl.addEventListener('keydown', function(e) {{
        if (e.key === 'Enter' && !e.shiftKey) {{
            e.preventDefault();
            sendMessage();
        }}
    }});

    async function sendMessage() {{
        var text = promptEl.value.trim();
        if (!text) return;

        addMessage('user', text);
        promptEl.value = '';
        sendBtn.disabled = true;
        showProgress();

        var modelToUse = currentModel;
        var suggestedModel = null;

        if (autoModelSwitch && currentModel === 'router') {{
            try {{
                var r = await fetch('/api/suggest_model', {{
                    method: 'POST',
                    headers: {{'Content-Type': 'application/json'}},
                    body: JSON.stringify({{text: text}})
                }});
                var data = await r.json();
                suggestedModel = data.model;

                if (autoModelSwitchMode === 'auto') {{
                    modelToUse = suggestedModel;
                }} else {{
                    if (confirm('Switch to ' + suggestedModel + ' for this query?')) {{
                        modelToUse = suggestedModel;
                    }}
                }}
            }} catch(e) {{
                console.error('Error suggesting model:', e);
            }}
        }}

        var useStreaming = config.enableStreaming !== false;
        var responseDiv = null;

        try {{
            var body = {{
                text: text,
                model: modelToUse === 'router' ? 'llama3.2:latest' : modelToUse,
                task: currentTask,
                temperature: config.temperature || 0.7,
                contextTokens: config.contextTokens || 8000,
                researchDepth: currentResearchDepth
            }};

            if (useStreaming) {{
                var r = await fetch('/api/chat/stream', {{
                    method: 'POST',
                    headers: {{'Content-Type': 'application/json'}},
                    body: JSON.stringify(body)
                }});

                if (!r.ok) throw new Error('Stream request failed');

                responseDiv = addMessage('a', '');
                var reader = r.body.getReader();
                var decoder = new TextDecoder();
                var buffer = '';

                while (true) {{
                    var result = await reader.read();
                    if (result.done) break;
                    buffer += decoder.decode(result.value, {{stream: true}});
                    var lines = buffer.split('\\n');
                    buffer = lines.pop() || '';

                    for (var i = 0; i < lines.length; i++) {{
                        var line = lines[i];
                        if (line.startsWith('data: ')) {{
                            try {{
                                var data = JSON.parse(line.slice(6));
                                if (data.chunk) {{
                                    responseDiv.textContent += data.chunk;
                                    messagesArea.scrollTop = messagesArea.scrollHeight;
                                }} else if (data.error) {{
                                    responseDiv.textContent += '\\nError: ' + data.error;
                                }}
                            }} catch(e) {{}}
                        }}
                    }}
                }}
            }} else {{
                var r = await fetch('/api/chat', {{
                    method: 'POST',
                    headers: {{'Content-Type': 'application/json'}},
                    body: JSON.stringify(body)
                }});
                var data = await r.json();
                responseDiv = addMessage('a', data.response);
            }}

            // Save to chat
            if (currentChatId) {{
                var messages = Array.from(messagesArea.children).map(function(div) {{
                    return {{
                        role: div.classList.contains('u') ? 'user' : 'assistant',
                        content: div.textContent,
                        timestamp: new Date().toISOString()
                    }};
                }});
                await fetch('/api/chats/' + currentChatId, {{
                    method: 'PUT',
                    headers: {{'Content-Type': 'application/json'}},
                    body: JSON.stringify({{messages: messages}})
                }});
            }}
        }} catch(e) {{
            addMessage('a', 'Error: ' + e.message);
        }} finally {{
            sendBtn.disabled = false;
            hideProgress();
        }}
    }}

    // Initialize
    async function init() {{
        await loadModels();
        await loadSettings();
        loadChats();
        updateTaskDisplay();
        researchOptions.classList.toggle('visible', currentTask === 'research');
        updateResearchPreset(currentResearchDepth);
        document.getElementById('autoSwitchEnabled').checked = autoModelSwitch;
        document.getElementById('autoSwitchMode').value = autoModelSwitchMode;

        if (currentChatId) {{
            switchChat(currentChatId);
        }}
    }}

    init();
</script>
</body>
</html>
"""
    return html

@app.post("/api/chat")
def api_chat(req: ChatRequest):
    try:
        from agent.controller import Controller
        from agent.worker_ollama import OllamaWorker
        
        # Try to import OpenCodeWorker (may fail if dependencies missing)
        try:
            from agent.worker_opencode import OpenCodeWorker
        except ImportError:
            OpenCodeWorker = None
        
        from agent.tools import get_all_tools

        config = _load_config()
        model = req.model or config.get("defaultModel", "llama3.2:latest")
        temperature = req.temperature if req.temperature is not None else config.get("temperature", 0.7)
        context_tokens = req.contextTokens if req.contextTokens is not None else config.get("contextTokens", 8000)

        # Determine which worker to use based on model
        if model.startswith("opencode") and OpenCodeWorker is not None:
            worker = OpenCodeWorker(
                model=model, 
                temperature=temperature, 
                max_tokens=context_tokens,
                tools=get_all_tools()
            )
        else:
            worker = OllamaWorker(
                model=model, 
                temperature=temperature, 
                num_ctx=context_tokens
            )
        
        controller = Controller(worker=worker)

        objective = req.text or req.message
        if req.task == "research":
            objective = f"mode=RESEARCH {objective}"

        response = controller.run(objective)
        return JSONResponse({"response": response})
    except Exception as e:
        return JSONResponse({"response": f"Error: {str(e)}"}, status_code=500)

def generate_stream_response(objective: str, model: str, temperature: float, context_tokens: int, task: str | None, research_depth: str = "standard"):
    from agent.controller import Controller
    from agent.worker_ollama import OllamaWorker
    from agent.context import RunContext, Message
    from agent.router import route

    try:
        worker = OllamaWorker(model=model, temperature=temperature, num_ctx=context_tokens)
        controller = Controller(worker=worker)

        if task == "research":
            depth_map = {"quick": 1, "standard": 2, "deep": 4}
            passes = depth_map.get(research_depth, 2)
            objective = f"mode=RESEARCH depth={passes} {objective}"

        decision = route(objective)
        ctx = RunContext(objective=objective, decision=decision, project="default")
        ctx.messages.append(Message(role="user", content=objective))

        for chunk in controller.worker.run_stream(ctx):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"

        yield f"data: {json.dumps({'done': True})}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"

@app.post("/api/chat/stream")
def api_chat_stream(req: ChatRequest):
    try:
        config = _load_config()
        model = req.model or config.get("defaultModel", "llama3.2:latest")
        temperature = req.temperature if req.temperature is not None else config.get("temperature", 0.7)
        context_tokens = req.contextTokens if req.contextTokens is not None else config.get("contextTokens", 8000)
        research_depth = req.researchDepth or config.get("researchDepth", "standard")

        # Try to import OpenCodeWorker for streaming
        try:
            from agent.worker_opencode import OpenCodeWorker
        except ImportError:
            OpenCodeWorker = None

        objective = req.text or req.message
        
        # Use streaming response that handles both worker types
        def stream_generator():
            if model.startswith("opencode") and OpenCodeWorker is not None:
                try:
                    worker = OpenCodeWorker(
                        model=model, 
                        temperature=temperature, 
                        max_tokens=context_tokens,
                        tools=get_all_tools()
                    )
                    from agent.models import Mode
                    
                    # Determine mode from task
                    if req.task == "research":
                        mode = Mode.RESEARCH
                    elif req.task == "write":
                        mode = Mode.WRITE
                    elif req.task == "edit":
                        mode = Mode.EDIT
                    else:
                        mode = Mode.HYBRID
                    
                    for chunk in worker.chat_stream(objective, mode):
                        yield f"data: {json.dumps({'content': chunk})}\n\n"
                except Exception as e:
                    yield f"data: {json.dumps({'content': f'Error: {str(e)}'})}\n\n"
            else:
                # Use existing streaming response
                for chunk in generate_stream_response(objective, model, temperature, context_tokens, req.task, research_depth):
                    yield f"data: {json.dumps({'content': chunk})}\n\n"
        
        return StreamingResponse(
            stream_generator(),
            media_type="text/event-stream"
        )
    except Exception as e:
        return JSONResponse({"response": f"Error: {str(e)}"}, status_code=500)

@app.post("/api/opencode/test")
async def test_opencode_connection(request: dict[str, str]):
    """Test opencode.ai API connection"""
    try:
        api_key = request.get("apiKey")
        if not api_key:
            return {"success": False, "error": "API key required"}
        
        # Test with a simple request to opencode.ai
        async with httpx.AsyncClient(timeout=10.0) as client:
            headers = {"Authorization": f"Bearer {api_key}"}
            response = await client.get("https://api.opencode.ai/v1/models", headers=headers)
            
            if response.status_code == 200:
                return {"success": True, "message": "Connection successful"}
            elif response.status_code == 401:
                return {"success": False, "error": "Invalid API key"}
            else:
                return {"success": False, "error": f"HTTP {response.status_code}"}
                
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/settings")
def get_settings():
    return _load_config()

@app.post("/api/settings")
def save_settings(data: dict):
    _save_config(data)
    return {"status": "ok"}

@app.get("/api/memories")
def get_memories():
    return _load_memories()

@app.post("/api/memories")
def add_memory(data: dict):
    memories = _load_memories()
    key = data.get("key", "")
    value = data.get("value", "")
    if key and value:
        memories = [m for m in memories if m.get("key") != key]
        memories.append({"key": key, "value": value})
        _save_memories(memories)
    return {"status": "ok"}

@app.delete("/api/memories/{key}")
def delete_memory(key: str):
    memories = _load_memories()
    memories = [m for m in memories if m.get("key") != key]
    _save_memories(memories)
    return {"status": "ok"}

@app.get("/api/models")
def get_models():
    try:
        all_models = _get_all_models()
        model_names = [model["name"] for model in all_models]
        default_model = "llama3.2:latest"
        
        # Prefer opencode models if available
        for model in all_models:
            if model["provider"] == "opencode":
                default_model = model["name"]
                break
        
        return {
            "items": model_names, 
            "default": default_model,
            "providers": all_models  # Include provider info for UI
        }
    except Exception as e:
        print(f"Error fetching models: {e}")
        return {"items": ["llama3.2:latest"], "default": "llama3.2:latest"}

@app.get("/api/chats")
def list_chats():
    with _CHAT_CACHE_LOCK:
        chats = []
        show_archived = _load_config().get("showArchived", False)
        dirs = [chats_dir] + ([archived_dir] if show_archived else [])
        
        for d in dirs:
            for f in d.glob("*.json"):
                chat_id = f.stem
                cache_key = f"{chat_id}:{f.stat().st_mtime}"
                
                # Check if cached data is still valid
                if (cache_key in _CHAT_METADATA_CACHE and 
                    _CHAT_METADATA_CACHE[cache_key].get("archived") == (str(d) == str(archived_dir))):
                    chats.append(_CHAT_METADATA_CACHE[cache_key]["metadata"])
                    continue
                
                # Load and cache the chat metadata
                try:
                    with open(f) as file:
                        data = json.load(file)
                        chat_metadata = {
                            "id": chat_id,
                            "title": data.get("title", "Untitled"),
                            "created_at": data.get("created_at"),
                            "summary": data.get("summary", ""),
                            "archived": str(d) == str(archived_dir)
                        }
                        chats.append(chat_metadata)
                        _CHAT_METADATA_CACHE[cache_key] = {
                            "metadata": chat_metadata,
                            "archived": chat_metadata["archived"]
                        }
                except:
                    # Clean up cache entry for corrupted files
                    _CHAT_METADATA_CACHE.pop(cache_key, None)
                    pass
        
        return chats

@app.post("/api/chats")
def create_chat():
    chat_id = str(uuid.uuid4())
    chat_path = chats_dir / f"{chat_id}.json"
    data = {
        "id": chat_id,
        "title": "New Chat",
        "created_at": datetime.now().isoformat(),
        "messages": []
    }
    with open(chat_path, 'w') as f:
        json.dump(data, f, indent=2)
    return {"id": chat_id}

@app.get("/api/chats/{chat_id}")
def get_chat(chat_id: str):
    chat_path = chats_dir / f"{chat_id}.json"
    if not chat_path.exists():
        chat_path = archived_dir / f"{chat_id}.json"
    if chat_path.exists():
        with open(chat_path) as f:
            return json.load(f)
    return {"error": "Chat not found"}

@app.put("/api/chats/{chat_id}")
def update_chat(chat_id: str, data: dict):
    chat_path = chats_dir / f"{chat_id}.json"
    if not chat_path.exists():
        chat_path = archived_dir / f"{chat_id}.json"
    if chat_path.exists():
        current = json.load(open(chat_path))
        current.update(data)
        with open(chat_path, 'w') as f:
            json.dump(current, f, indent=2)
        return {"status": "ok"}
    return {"error": "Chat not found"}

@app.delete("/api/chats/{chat_id}")
def delete_chat(chat_id: str):
    chat_path = chats_dir / f"{chat_id}.json"
    if chat_path.exists():
        chat_path.unlink()
        return {"status": "ok"}
    return {"error": "Chat not found"}

@app.post("/api/chats/{chat_id}/archive")
def archive_chat(chat_id: str):
    chat_path = chats_dir / f"{chat_id}.json"
    if chat_path.exists():
        archived_path = archived_dir / f"{chat_id}.json"
        chat_path.rename(archived_path)
        return {"status": "ok"}
    return {"error": "Chat not found"}

@app.post("/api/suggest_model")
def suggest_model(data: dict):
    text = data.get("text", "").lower()
    if "code" in text or "programming" in text or "python" in text:
        return {"model": "codellama"}
    elif "research" in text or "analyze" in text or "deep" in text:
        return {"model": "llama3.1:8b"}
    else:
        return {"model": "llama3.2:latest"}

@app.get("/api/health")
def health():
    return {"status": "ok"}
