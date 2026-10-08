@echo off
echo ========================================================
echo       CareerAI MVP Platform - Quick Launcher
echo ========================================================
echo Starting FastAPI Backend and Vite React Frontend...
echo.

set PATH=C:\Program Files\nodejs;%PATH%

echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "CareerAI Backend (FastAPI)" cmd /k "python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Launching Vite React Frontend on http://localhost:5173 ...
cd frontend
start "CareerAI Frontend (Vite/React)" cmd /k "npm.cmd run dev"

echo.
echo ========================================================
echo CareerAI is booting up!
echo - Web Application: http://localhost:5173
echo - Interactive API Docs: http://127.0.0.1:8000/docs
echo - Demo Credentials: demo@careerai.com / demo123
echo ========================================================
pause
