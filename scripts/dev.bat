@echo off
REM Development script for DTDucas LeetCode Website (Windows)
REM This script starts both TypeScript website and Jekyll blog using Docker

echo 🚀 Starting DTDucas LeetCode Website Development Environment
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo 📦 Building Docker images...
docker-compose build

echo.
echo 🌐 Starting services...
echo   - TypeScript Website: http://localhost:3000
echo   - Jekyll Blog: http://localhost:4000/dtducas-leetcode/blog/
echo.
echo Press Ctrl+C to stop all services
echo.

REM Start both services
docker-compose up jekyll-dev vite-dev
