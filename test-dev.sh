#!/bin/bash

echo "🧪 Testing development setup..."

# Kill any existing processes on ports 5100 and 3100
echo "🔄 Cleaning up existing processes..."
lsof -ti:5100 | xargs kill -9 2>/dev/null || true
lsof -ti:3100 | xargs kill -9 2>/dev/null || true

echo "🚀 Starting development servers..."
pnpm dev &
DEV_PID=$!

# Wait a bit for servers to start
sleep 8

echo "🔍 Checking if servers are running..."

# Check if client is running on port 5100
if curl -s http://localhost:5100 > /dev/null; then
    echo "✅ Client is running on http://localhost:5100"
else
    echo "❌ Client is not responding on port 5100"
fi

# Check if server is running on port 3100
if curl -s http://localhost:3100 > /dev/null; then
    echo "✅ Server is running on http://localhost:3100"
else
    echo "❌ Server is not responding on port 3100"
fi

# Check GraphQL endpoint
if curl -s http://localhost:3100/graphql > /dev/null; then
    echo "✅ GraphQL endpoint is available at http://localhost:3100/graphql"
else
    echo "❌ GraphQL endpoint is not responding"
fi

echo "🛑 Stopping test servers..."
kill $DEV_PID 2>/dev/null || true
sleep 2
lsof -ti:5100 | xargs kill -9 2>/dev/null || true
lsof -ti:3100 | xargs kill -9 2>/dev/null || true

echo "✨ Test completed!"
