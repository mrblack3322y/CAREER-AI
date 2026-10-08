# CareerAI MVP Platform - PowerShell Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      CareerAI MVP Platform - Quick Launcher" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting FastAPI Backend and Vite React Frontend..." -ForegroundColor Yellow

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Launch FastAPI Backend
Write-Host "`n[1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir'; python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

# 2. Launch React Frontend
Write-Host "[2/2] Launching Vite React Frontend on http://localhost:5173 ..." -ForegroundColor Green
$FrontendDir = Join-Path $ScriptDir "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PATH = 'C:\Program Files\nodejs;' + `$env:PATH; Set-Location '$FrontendDir'; npm.cmd run dev"

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "CareerAI MVP is running!" -ForegroundColor Cyan
Write-Host " - Web Application:       http://localhost:5173" -ForegroundColor White
Write-Host " - Interactive API Docs:  http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host " - Demo Credentials:      demo@careerai.com / demo123" -ForegroundColor White
Write-Host "========================================================`n" -ForegroundColor Cyan
