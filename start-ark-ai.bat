@echo off
setlocal

REM ============================================================
REM ARK AI Customer Support Assistant - automatic local startup
REM ============================================================

cd /d "%~dp0"

echo Waiting for Docker Desktop...
:wait_docker
docker info >nul 2>&1
if errorlevel 1 (
    timeout /t 3 /nobreak >nul
    goto wait_docker
)

REM Containers use restart=unless-stopped, so Docker will normally
REM start them automatically. These commands are safe as a fallback.
docker start crm-postgres >nul 2>&1
docker start n8n >nul 2>&1

echo Waiting for PostgreSQL...
:wait_postgres
docker exec crm-postgres pg_isready -U crmadmin -d crm >nul 2>&1
if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    goto wait_postgres
)

REM Start Node backend only if port 3000 is not already listening.
netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul
if %errorlevel%==0 (
    echo ARK AI backend is already running on port 3000.
    exit /b 0
)

cd /d "%~dp0backend"
start "ARK AI Backend" /min cmd /c "npm start"

echo.
echo ========================================
echo ARK AI startup completed.
echo Backend:    http://localhost:3000
 echo n8n:       http://localhost:5678
 echo PostgreSQL: localhost:5432
 echo ========================================
