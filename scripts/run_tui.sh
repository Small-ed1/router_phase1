#!/bin/bash
cd "$(dirname "$(readlink -f "$0")")"

# Check if API is running
if ! curl -sf http://127.0.0.1:8000/health 2>/dev/null; then
    echo "Warning: API server may not be running."
    echo "Start with: sudo systemctl start cognihub"
    echo "Or run manually: uvicorn src.cognihub.app:app --reload --host 0.0.0.0 --port 8000"
    echo ""
fi

# Activate venv and run TUI
if [ -d "venv" ]; then
    source venv/bin/activate
    python3 src/cognihub/tui/cognihub_tui.py
else
    echo "Virtual environment not found. Run: python3 src/cognihub/tui/cognihub_tui.py"
fi
