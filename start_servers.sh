#!/bin/bash

cd "$(dirname "$0")"

source .venv/bin/activate

# Start webui
python -m uvicorn webui.app:app --host 0.0.0.0 --port 8000 &

WEBUI_PID=$!

# Start kiwix proxy
python kiwix_proxy.py &

KIWIX_PID=$!

# Optionally start Ollama if available
if command -v ollama &> /dev/null; then
    ollama serve &
    OLLAMA_PID=$!
fi

# Wait for them
if [ -n "$OLLAMA_PID" ]; then
    wait $WEBUI_PID $KIWIX_PID $OLLAMA_PID
else
    wait $WEBUI_PID $KIWIX_PID
fi