# Router Phase 1 Documentation

## Overview

Router Phase 1 is an advanced AI assistant system that intelligently routes user queries to appropriate processing modes using tool calling and research capabilities.

## Architecture

### Core Components

- **Router**: Analyzes queries and routes to WRITE/EDIT/RESEARCH/HYBRID modes
- **Controller**: Orchestrates tool execution and manages worker coordination
- **Workers**: Handle AI model interactions (currently Ollama-based)
- **Tools**: Comprehensive toolkit for file operations, web search, knowledge bases, and system control
- **Research Engine**: Multi-pass analysis system for complex queries

### Key Features

- Intelligent query routing based on keyword analysis
- Tool calling with structured parameters
- Sandboxed file operations
- Offline knowledge base integration (Kiwix)
- Web search and content extraction
- System management tools
- Chat persistence and management
- Web-based UI with theme support

## Installation

1. Create virtual environment: `python -m venv .venv`
2. Activate: `source .venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Run setup: `make doctor`
5. Start web UI: `./run_webui.sh`

## Usage

### Command Line
- `./agt run "query"` - Run agent directly
- `python -m agent "query"` - Alternative execution

### Web UI
- Start server: `./run_webui.sh`
- Access at http://localhost:8000
- Features chat management, model switching, research modes

## Configuration

- Environment variables: OLLAMA_HOST, OLLAMA_MODEL
- Config file: router.json for UI settings
- Tool permissions and budgets configurable

## Development

- Run tests: `make test`
- Format code: `make fmt`
- Add tools: Inherit from BaseTool, register in Controller
- Add modes: Update Mode enum, routing logic, worker implementations

## Security

- File operations sandboxed to projects/ directory
- Input validation on tool parameters
- Environment variable handling for credentials
- System tool permissions restricted

## API Endpoints

- `/api/chat` - Send chat messages
- `/api/models` - List available models
- `/api/chats` - Manage chat sessions
- `/api/settings` - UI configuration