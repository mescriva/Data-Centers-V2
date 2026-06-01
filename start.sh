#!/bin/bash
# Abre el prototipo en el navegador con un servidor local
PORT=8080
cd "$(dirname "$0")"
echo "Iniciando servidor en http://localhost:$PORT ..."
open "http://localhost:$PORT"
python3 -m http.server $PORT
