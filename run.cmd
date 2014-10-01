@echo off
start /i /b python -m SimpleHTTPServer
explorer http://localhost:8000
