#!/bin/bash

# Development script for DTDucas LeetCode Website
# This script starts both TypeScript website and Jekyll blog using Docker

echo "🚀 Starting DTDucas LeetCode Website Development Environment"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "📦 Building Docker images..."
docker-compose build

echo ""
echo "🌐 Starting services..."
echo "  - TypeScript Website: http://localhost:3000"
echo "  - Jekyll Blog: http://localhost:4000/dtducas-leetcode/blog/"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start both services
docker-compose up jekyll-dev vite-dev
