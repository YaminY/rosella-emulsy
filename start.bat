@echo off
title Rosella Emulsy
echo.
echo ╔══════════════════════════════════════════════╗
echo ║         Rosella Emulsy - Startup             ║
echo ╚══════════════════════════════════════════════╝
echo.
echo [1/2] Building frontend...
cd /d "%~dp0frontend"
call npx vite build --logLevel silent
echo       Frontend built successfully.
echo.
echo [2/2] Starting server...
cd /d "%~dp0backend"
start "" http://localhost:3001
node src/app.js
pause