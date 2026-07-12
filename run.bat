@echo off
setlocal EnableDelayedExpansion

:: ============================================================
:: ForgeMind X - Idempotent Development Environment Launcher
:: Pure ASCII - safe to run multiple times
:: ============================================================

set "SCRIPT_DIR=%~dp0"
set "BACKEND_DIR=%SCRIPT_DIR%backend"
set "FRONTEND_DIR=%SCRIPT_DIR%frontend"
set "ENV_FILE=%SCRIPT_DIR%.env"

call :print_header

:: ----------------------------------------------------------
:: STEP 1: Check Docker daemon
:: ----------------------------------------------------------
call :log "Checking Docker daemon..."
docker info >nul 2>&1
if errorlevel 1 (
    call :error "Docker is not running. Start Docker Desktop and try again."
    exit /b 1
)
call :log "Docker daemon is running."

:: ----------------------------------------------------------
:: STEP 2: Load .env safely (skip comment and blank lines)
:: ----------------------------------------------------------
if exist "%ENV_FILE%" (
    call :log "Loading environment from .env..."
    for /f "usebackq eol=# tokens=1,* delims==" %%A in ("%ENV_FILE%") do (
        set "LINE=%%A"
        if not "!LINE!"=="" (
            if not "!LINE:~0,1!"=="#" (
                set "%%A=%%B"
            )
        )
    )
    call :log "Environment loaded."
) else (
    call :warn ".env not found. Using defaults."
)

:: ----------------------------------------------------------
:: STEP 3: Validate docker-compose.yml
:: ----------------------------------------------------------
call :log "Validating docker-compose.yml..."
cd /d "%SCRIPT_DIR%"
docker compose config >nul 2>&1
if errorlevel 1 (
    call :error "docker-compose.yml is invalid. Run: docker compose config"
    exit /b 1
)
call :log "docker-compose.yml is valid."

:: ----------------------------------------------------------
:: STEP 4: Start infrastructure - no-recreate (idempotent)
:: ----------------------------------------------------------
call :log "Starting PostgreSQL and Redis containers..."
docker compose up db cache -d --no-recreate 2>&1
if errorlevel 1 (
    call :error "Failed to start Docker services."
    exit /b 1
)
call :log "Docker services started (or already running)."

:: ----------------------------------------------------------
:: STEP 5: Wait for PostgreSQL health
:: Uses docker inspect to avoid Windows exec hang
:: ----------------------------------------------------------
call :log "Waiting for PostgreSQL to be healthy..."
set "PG_READY=0"
for /l %%i in (1,1,30) do (
    if "!PG_READY!"=="0" (
        for /f "delims=" %%H in ('docker inspect --format={{.State.Health.Status}} forgemind-db-1 2^>nul') do (
            if "%%H"=="healthy" (
                set "PG_READY=1"
                call :log "PostgreSQL is healthy."
            ) else (
                call :log "PostgreSQL status: %%H - attempt %%i/30 - waiting 2s..."
                timeout /t 2 /nobreak >nul
            )
        )
    )
)
if "!PG_READY!"=="0" (
    call :error "PostgreSQL did not become healthy in 60s. Run: docker compose logs db"
    exit /b 1
)

:: ----------------------------------------------------------
:: STEP 6: Wait for Redis health
:: ----------------------------------------------------------
call :log "Waiting for Redis to be healthy..."
set "REDIS_READY=0"
for /l %%i in (1,1,20) do (
    if "!REDIS_READY!"=="0" (
        for /f "delims=" %%H in ('docker inspect --format={{.State.Health.Status}} forgemind-cache-1 2^>nul') do (
            if "%%H"=="healthy" (
                set "REDIS_READY=1"
                call :log "Redis is healthy."
            ) else (
                call :log "Redis status: %%H - attempt %%i/20 - waiting 2s..."
                timeout /t 2 /nobreak >nul
            )
        )
    )
)
if "!REDIS_READY!"=="0" (
    call :error "Redis did not become healthy in 40s. Run: docker compose logs cache"
    exit /b 1
)

:: ----------------------------------------------------------
:: STEP 7: Show infrastructure status
:: ----------------------------------------------------------
echo.
call :log "Infrastructure ready:"
docker compose ps db cache
echo.

:: ----------------------------------------------------------
:: STEP 8: Verify backend launcher exists
:: ----------------------------------------------------------
call :log "Verifying backend..."
if not exist "%BACKEND_DIR%\pom.xml" (
    call :error "pom.xml not found at: %BACKEND_DIR%"
    exit /b 1
)
if not exist "%BACKEND_DIR%\start-backend.bat" (
    call :error "start-backend.bat not found at: %BACKEND_DIR%"
    exit /b 1
)
call :log "Backend OK."

:: ----------------------------------------------------------
:: STEP 9: Verify frontend launcher exists
:: ----------------------------------------------------------
call :log "Verifying frontend..."
if not exist "%FRONTEND_DIR%\package.json" (
    call :error "package.json not found at: %FRONTEND_DIR%"
    exit /b 1
)
if not exist "%FRONTEND_DIR%\start-frontend.bat" (
    call :error "start-frontend.bat not found at: %FRONTEND_DIR%"
    exit /b 1
)
call :log "Frontend OK."

:: ----------------------------------------------------------
:: STEP 10: Launch backend in new CMD window
:: Uses dedicated start-backend.bat - zero quoting complexity
:: ----------------------------------------------------------
call :log "Launching Spring Boot Backend..."
start "ForgeMind Backend" cmd /k "%BACKEND_DIR%\start-backend.bat"
call :log "Backend window opened."

:: ----------------------------------------------------------
:: STEP 11: Launch frontend in new CMD window
:: ----------------------------------------------------------
call :log "Launching React Frontend..."
start "ForgeMind Frontend" cmd /k "%FRONTEND_DIR%\start-frontend.bat"
call :log "Frontend window opened."

:: ----------------------------------------------------------
:: DONE
:: ----------------------------------------------------------
echo.
echo ============================================================
echo   ForgeMind X - All services are launching!
echo ============================================================
echo.
echo   Infrastructure (running now):
echo     PostgreSQL  : localhost:5432
echo     Redis       : localhost:6379
echo.
echo   Application (launching in separate windows):
echo     Backend API : http://localhost:8080
echo     Swagger UI  : http://localhost:8080/swagger-ui.html
echo     Health      : http://localhost:8080/actuator/health
echo     Frontend UI : http://localhost:5173
echo.
echo   Backend takes ~30s to start. Watch the Backend window.
echo   This window can be closed. Services keep running.
echo ============================================================
echo.
pause
exit /b 0

:: ----------------------------------------------------------
:: Subroutines
:: ----------------------------------------------------------
:print_header
echo.
echo ============================================================
echo   ForgeMind X - Development Environment Launcher
echo ============================================================
echo.
goto :eof

:log
echo [%TIME:~0,8%] %~1
goto :eof

:warn
echo [%TIME:~0,8%] WARNING: %~1
goto :eof

:error
echo.
echo [%TIME:~0,8%] ERROR: %~1
echo.
goto :eof
