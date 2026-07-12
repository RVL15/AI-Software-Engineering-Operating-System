@echo off
title ForgeMind Backend :8080
echo.
echo [BACKEND] Starting Spring Boot on port 8080...
echo [BACKEND] Working directory: %~dp0
echo.
cd /d "%~dp0"
mvn spring-boot:run
echo.
echo [BACKEND] Spring Boot has stopped.
pause
