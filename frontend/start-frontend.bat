@echo off
title ForgeMind Frontend :5173
echo.
echo [FRONTEND] Starting Vite dev server on port 5173...
echo [FRONTEND] Working directory: %~dp0
echo.
cd /d "%~dp0"
if not exist node_modules (
    echo [FRONTEND] node_modules missing - running npm install first...
    npm install
)
npm run dev
echo.
echo [FRONTEND] Vite dev server has stopped.
pause
