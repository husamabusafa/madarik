#!/bin/bash

# Madarik Development Startup Script
echo "🚀 Starting Madarik Real Estate Platform..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start the NestJS server
echo "📡 Starting NestJS server..."
cd server && npm run start:dev &
SERVER_PID=$!

# Wait a moment for server to initialize
sleep 5

# Start the React client
echo "⚛️  Starting React client..."
cd client && npm run dev &
CLIENT_PID=$!

# Wait a moment for client to initialize
sleep 5

echo ""
echo "✅ Both servers are running:"
echo "   🖥️  Client: http://localhost:5100"
echo "   🔧 Server: http://localhost:3100"
echo "   📊 API Health: http://localhost:3100/api/v1/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $SERVER_PID $CLIENT_PID
