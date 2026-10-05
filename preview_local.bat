@echo off
cd /d "%~dp0"
echo ZiruPDF website local preview: http://127.0.0.1:8000
py -m http.server 8000 --bind 127.0.0.1
