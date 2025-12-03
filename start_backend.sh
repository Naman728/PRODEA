#!/bin/bash

# Script to start the FastAPI backend server

cd "$(dirname "$0")"

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Check if uvicorn is installed
if ! command -v uvicorn &> /dev/null; then
    echo "Error: uvicorn is not installed"
    echo "Please install it with: pip install uvicorn"
    exit 1
fi

# Start the FastAPI server
echo "Starting FastAPI backend server on http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn app:app --reload --host 0.0.0.0 --port 8000

