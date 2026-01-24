# AGENTS.md - CogniHub Development Guide

This file contains essential information for AI coding agents working on the CogniHub codebase. It includes build/lint/test commands, code style guidelines, and development practices.

## Build/Lint/Test Commands

### Running the Application

```bash
# Start the web server (development mode)
uvicorn src.cognihub.app:app --reload --host 0.0.0.0 --port 8000

# Start the terminal UI
python src/cognihub/tui/cognihub_tui.py

# Run the Ollama tool agent
./scripts/run_agent.sh
```

### Testing Commands

```bash
# Run all tests
python -m pytest tests/ -v

# Run specific test file
python -m pytest tests/test_context_builder.py -v

# Run single test function
python -m pytest tests/test_context_builder.py::test_build_context_caps_and_dedupe -v

# Run tests with coverage
python -m pytest tests/ --cov=src/cognihub --cov-report=html

# Run component tests (if backup directory exists)
python backup/test_components.py

# Run integration tests (if backup directory exists)
python backup/test_integration.py
```

### Code Quality Commands

```bash
# Type checking with mypy
mypy src/cognihub/ --ignore-missing-imports

# Syntax validation
python -m py_compile src/cognihub/app.py src/cognihub/stores/*.py src/cognihub/services/*.py

# Import testing
python -c "import sys; sys.path.insert(0, 'src'); import cognihub.app, cognihub.stores.chatstore, cognihub.stores.ragstore; print('All imports successful')"
```

### Database Operations

```bash
# Check database integrity
sqlite3 data/chat.sqlite3 "PRAGMA integrity_check;"
sqlite3 data/rag.sqlite3 "PRAGMA integrity_check;"
sqlite3 data/web.sqlite3 "PRAGMA integrity_check;"

# Vacuum databases (optimize storage)
sqlite3 data/chat.sqlite3 "VACUUM;"
sqlite3 data/rag.sqlite3 "VACUUM;"
sqlite3 data/web.sqlite3 "VACUUM;"
```

## Code Style Guidelines

### Python Version & Imports

- **Python Version**: 3.8+
- **Import Style**: Use absolute imports within the package
- **Import Order**:
  1. Standard library imports (grouped, one per line)
  2. Third-party imports (grouped, one per line)
  3. Local imports (relative imports with dots)
- **Import Example**:
```python
from __future__ import annotations

import os, json, time, asyncio, logging
from typing import Optional, Any, Dict
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from . import config
from .stores import chatstore
from .services.chat import stream_chat
```

### Naming Conventions

- **Variables**: `snake_case` (e.g., `ollama_url`, `max_upload_bytes`)
- **Functions**: `snake_case` (e.g., `stream_chat()`, `_validate_messages()`)
- **Classes**: `PascalCase` (e.g., `Config`, `ModelRegistry`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `OLLAMA_URL`, `MAX_UPLOAD_BYTES`)
- **Private Methods**: Prefix with single underscore (e.g., `_now()`, `_conn()`)
- **Modules**: `snake_case` (e.g., `chatstore.py`, `web_ingest.py`)

### Type Hints

- **Required**: Use type hints for all function parameters and return values
- **Style**: Use `|` for union types (Python 3.10+) or `Union` from typing
- **Optional Types**: Use `Optional[T]` or `T | None`
- **Examples**:
```python
def _cached_get(key: str, ttl: int, fetcher) -> Any:
async def stream_chat(
    *,
    http: httpx.AsyncClient,
    model: str,
    messages: list[dict],
    options: dict | None,
    keep_alive: str | None,
) -> AsyncGenerator[str, None]:
```

### Async/Await Patterns

- **Context Managers**: Use `@asynccontextmanager` for async context managers
- **Locks**: Use `asyncio.Lock()` for shared state protection
- **Timeouts**: Set appropriate timeouts on HTTP clients
- **Example**:
```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup code
    yield
    # Cleanup code

async def _cached_get(key: str, ttl: int, fetcher):
    async with _cache_lock:
        # Critical section
```

### Error Handling

- **HTTP Exceptions**: Use `HTTPException` from FastAPI for API errors
- **Validation**: Raise `ValueError` for invalid input parameters
- **Logging**: Use structured logging with appropriate levels
- **Database**: Use context managers for connection handling
- **Example**:
```python
if not messages or not model:
    raise ValueError("Messages and model are required")

if total_chars > 100000:
    raise HTTPException(status_code=400, detail="Messages too long")

logger.error(f"Failed to process request: {e}")
```

### Database Patterns

- **Connection Management**: Use context managers (`_db()`) for transactions
- **Pragma Settings**:
  - `journal_mode=WAL`
  - `synchronous=NORMAL`
  - `foreign_keys=ON`
  - `busy_timeout=5000`
  - `temp_store=MEMORY`
  - `cache_size=-20000`
- **Migrations**: Use version-based migrations with `_get_user_version()` and `_set_user_version()`
- **Row Factory**: Set `con.row_factory = sqlite3.Row` for dict-like access

### Logging

- **Configuration**: Use `logging.basicConfig()` with structured format
- **Format**: `'%(asctime)s - %(name)s - %(levelname)s - %(message)s'`
- **Levels**: INFO for general operations, ERROR for failures, DEBUG for development
- **Logger Creation**: `logger = logging.getLogger(__name__)`

### Configuration

- **Environment Variables**: Use `os.getenv()` with sensible defaults
- **Config Class**: Centralize configuration in `config.py`
- **Type Conversion**: Convert strings to appropriate types (int, bool, etc.)
- **Example**:
```python
self.max_upload_bytes = int(os.getenv("MAX_UPLOAD_BYTES", str(10 * 1024 * 1024)))
self.web_allowed_hosts = os.getenv("WEB_ALLOWED_HOSTS", "")
```

### Security Considerations

- **Input Validation**: Always validate and sanitize user inputs
- **File Uploads**: Check file sizes, sanitize filenames, validate extensions
- **Web Scraping**: Use allowed/blocked host lists for SSRF protection
- **API Keys**: Support optional API key authentication
- **SQL Injection**: Use parameterized queries (automatic with sqlite3)

### Pydantic Models

- **Base Models**: Extend `BaseModel` from pydantic
- **Field Validation**: Use `Field()` for constraints and defaults
- **Config**: Use `ConfigDict` for model configuration
- **Example**:
```python
class ChatSettings(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    model: str = Field(default="llama3.1")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    context: int = Field(default=4096, gt=0)
```

### API Design

- **RESTful Endpoints**: Follow REST conventions
- **Streaming Responses**: Use `StreamingResponse` for chat streaming
- **File Responses**: Use `FileResponse` for static file serving
- **JSON Responses**: Use `JSONResponse` for structured data
- **Error Codes**: Use appropriate HTTP status codes (400, 404, 500, etc.)

### Testing Patterns

- **Test Structure**: Use descriptive function names starting with `test_`
- **Assertions**: Use standard `assert` statements
- **Mocking**: Mock external dependencies (HTTP calls, database connections)
- **Fixtures**: Use pytest fixtures for setup/teardown
- **Example**:
```python
def test_build_context_caps_and_dedupe():
    results = [...]
    sources, context = build_context(results, max_chars=5000, per_source_cap=1)
    assert len(sources) == 2
    assert "[D1]" in context[0]
```

### Documentation

- **README**: Comprehensive setup and usage instructions
- **Code Comments**: Minimal comments, focus on complex business logic
- **Type Hints**: Serve as documentation for function signatures
- **API Docs**: Auto-generated from FastAPI decorators

### Tool Calling System

- **Contract**: Strict JSON schema validation for tool requests/responses (tool_request/final)
- **Registry**: Centralized tool registration with side-effect metadata and confirmation gating
- **Executor**: Timeouts (12s), output caps (12k chars), comprehensive logging with SHA256 hashes
- **Store**: SQLite logging of all tool executions with async I/O offloading (non-blocking)
- **Built-ins**: web_search (network), doc_search (read-only), shell_exec (dangerous, opt-in) with dependency injection
- **Integration**: All chats use tool contract loop - LLM returns JSON, tools execute, results fed back
- **Security**: Result truncation (4k chars) prevents context explosion, request ID traceability
- **Streaming**: Compatible with existing SSE format, tool results fed as system messages

### Dependencies

- **Core**: fastapi, uvicorn, httpx, pydantic
- **Data Processing**: numpy, beautifulsoup4, lxml, readability-lxml
- **UI**: textual, rich
- **System**: psutil, requests
- **Development**: pytest, mypy (for type checking)

### File Structure

```
src/cognihub/
├── app.py                 # FastAPI application
├── config.py              # Configuration management
├── stores/                # Database layer
│   ├── chatstore.py
│   ├── ragstore.py
│   ├── webstore.py
│   └── researchstore.py
├── services/              # Business logic
│   ├── chat.py
│   ├── research.py
│   ├── models.py
│   └── ...
└── tui/                   # Terminal UI
    └── cognihub_tui.py
```

This guide ensures consistent development practices across the CogniHub codebase. Always run type checking and tests before committing changes.