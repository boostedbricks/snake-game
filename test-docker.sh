#!/bin/bash

# Snake Game - Docker Test Script
# Builds and runs the containerized game locally

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_NAME="snake-game"
CONTAINER_NAME="snake-game-test"
PORT=8080

echo "🐳 Snake Game - Docker Test"
echo "==========================="
echo ""

cd "$SCRIPT_DIR"

# Clean up existing container if it exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "🧹 Cleaning up existing container..."
    docker stop "$CONTAINER_NAME" 2>/dev/null || true
    docker rm "$CONTAINER_NAME" 2>/dev/null || true
fi

# Build image
echo "🔨 Building Docker image..."
docker build -t "$IMAGE_NAME:latest" .

if [ $? -eq 0 ]; then
    echo "✓ Build successful!"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""

# Run container
echo "🚀 Starting container..."
docker run -d \
    --name "$CONTAINER_NAME" \
    -p $PORT:80 \
    "$IMAGE_NAME:latest"

if [ $? -eq 0 ]; then
    echo "✓ Container started!"
else
    echo "❌ Container failed to start"
    exit 1
fi

echo ""
echo "⏳ Waiting for container to be ready..."
sleep 3

# Test health check
if docker exec "$CONTAINER_NAME" wget --quiet --tries=1 --spider http://localhost/ 2>/dev/null; then
    echo "✓ Health check passed!"
else
    echo "❌ Health check failed"
    docker logs "$CONTAINER_NAME"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Snake Game is running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Open in browser:"
echo "   http://localhost:$PORT"
echo ""
echo "📊 Container info:"
docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "📝 Useful commands:"
echo "   View logs:    docker logs $CONTAINER_NAME"
echo "   Stop:         docker stop $CONTAINER_NAME"
echo "   Remove:       docker rm $CONTAINER_NAME"
echo "   Restart:      docker restart $CONTAINER_NAME"
echo ""
echo "🎮 Test the game, then press Ctrl+C to stop"
echo ""

# Follow logs
docker logs -f "$CONTAINER_NAME"
