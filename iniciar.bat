@echo off
title Iniciando Proyecto Local...
echo Cargando aplicacion sin internet...
timeout /t 1 /nobreak >nul

start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --autoplay-policy=no-user-gesture-required --app="%~dp0index.html"

exit