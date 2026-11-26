@echo off
setlocal
set "HUD_PY=%~dp0server\hud_overlay.py"
if not exist "%HUD_PY%" (
  echo Could not locate "%HUD_PY%"
  exit /b 1
)

set "PYW_EXE=C:\Python314\pythonw.exe"
if not exist "%PYW_EXE%" (
  for %%I in (pythonw.exe) do set "PYW_EXE=%%~$PATH:I"
)
if "%PYW_EXE%"=="" set "PYW_EXE=pythonw"

start "" "%PYW_EXE%" "%HUD_PY%" %*
exit /b 0
