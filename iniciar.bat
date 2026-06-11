@echo off
title Data Centers — Iniciando...

set PORT=3000
set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

:: ── 1. Python 3 ───────────────────────────────────────────
python --version >nul 2>&1
if %errorlevel%==0 (
  start /b "" python -m http.server %PORT% --directory "%ROOT%"
  goto :open
)
py --version >nul 2>&1
if %errorlevel%==0 (
  start /b "" py -3 -m http.server %PORT% --directory "%ROOT%"
  goto :open
)

:: ── 2. Node.js ────────────────────────────────────────────
node --version >nul 2>&1
if %errorlevel%==0 (
  start /b "" cmd /c "npx --yes http-server \"%ROOT%\" -p %PORT% -c-1 --silent"
  goto :open
)

:: ── 3. PowerShell (siempre disponible en Windows 10/11) ───
echo Usando PowerShell como servidor HTTP...
start /b "" powershell -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -Command ^
  "$p=%PORT%; $r='%ROOT%'; $l=New-Object Net.HttpListener; $l.Prefixes.Add(\"http://localhost:$p/\"); $l.Start(); while($l.IsListening){ $c=$l.GetContext(); $req=$c.Request; $res=$c.Response; $f=Join-Path $r ($req.Url.LocalPath.TrimStart('/') -replace '/','\'); if([IO.File]::Exists($f)){ $b=[IO.File]::ReadAllBytes($f); $ext=[IO.Path]::GetExtension($f).TrimStart('.').ToLower(); $m=@{html='text/html';htm='text/html';css='text/css';js='application/javascript';mp4='video/mp4';svg='image/svg+xml';png='image/png';jpg='image/jpeg';jpeg='image/jpeg';ico='image/x-icon';json='application/json'};$ct=$m[$ext]; if(-not $ct){$ct='application/octet-stream'}; $res.ContentType=$ct; $res.ContentLength64=$b.Length; $res.OutputStream.Write($b,0,$b.Length) }else{ $res.StatusCode=404 }; $res.Close() }"

:open
timeout /t 2 /nobreak >nul

:: ── Buscar Chrome ─────────────────────────────────────────
set "CHROME="
if exist "%PROGRAMFILES%\Google\Chrome\Application\chrome.exe"      set "CHROME=%PROGRAMFILES%\Google\Chrome\Application\chrome.exe"
if exist "%PROGRAMFILES(X86)%\Google\Chrome\Application\chrome.exe" set "CHROME=%PROGRAMFILES(X86)%\Google\Chrome\Application\chrome.exe"
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"      set "CHROME=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"

if "%CHROME%"=="" (
  echo Chrome no encontrado. Abre manualmente: http://localhost:%PORT%/index.html
  pause
  exit /b 1
)

start "" "%CHROME%" ^
  --autoplay-policy=no-user-gesture-required ^
  --disable-gesture-requirement-for-media-playback ^
  --disable-infobars ^
  --no-default-browser-check ^
  --no-first-run ^
  --app="http://localhost:%PORT%/index.html" ^
  --start-fullscreen

exit
