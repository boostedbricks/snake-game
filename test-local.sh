#!/bin/bash

# Snake Game - Quick Test Script
# Tests the game locally before containerization

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=8080

echo "🐍 Snake Game - Quick Test"
echo "=========================="
echo ""

# Check if files exist
echo "✓ Checking files..."
FILES=("index.html" "snake.js" "styles.css" "Dockerfile" "nginx.conf")
for file in "${FILES[@]}"; do
    if [ ! -f "$SCRIPT_DIR/$file" ]; then
        echo "❌ Missing file: $file"
        exit 1
    fi
    echo "  ✓ $file"
done

echo ""
echo "📂 Project structure verified!"
echo ""

# Check if port is available
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port $PORT is already in use"
    echo "   Kill the process or choose a different port"
    exit 1
fi

# Start HTTP server
echo "🚀 Starting local web server..."
echo "   URL: http://localhost:$PORT"
echo ""
echo "🎮 Controls:"
echo "   - Arrow Keys or WASD to move"
echo "   - SPACE to start/pause"
echo "   - R to restart"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd "$SCRIPT_DIR"

# Try python3 first, fall back to python
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    python -m http.server $PORT
else
    echo "❌ Python not found. Please install Python 3"
    echo ""
    echo "Alternative: Open index.html directly in your browser"
    exit 1
fi
