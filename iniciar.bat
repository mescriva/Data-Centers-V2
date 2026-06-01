@echo off
title Iniciando Proyecto Local...
echo Cargando aplicacion...
timeout /t 1 /nobreak >nul

:: Construye la ruta file:// correcta
set "DIR=%~dp0"
set "DIR=%DIR:\=/%"

:: Chrome con autoplay desbloqueado, pantalla completa, sin UI de navegador
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --autoplay-policy=no-user-gesture-required ^
  --disable-gesture-requirement-for-media-playback ^
  --allow-file-access-from-files ^
  --app="file:///%DIR%index.html" ^
  --start-fullscreen

exit