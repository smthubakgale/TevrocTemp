@echo off

set PATH=%PATH%;C:\Program Files\nodejs

echo Installing dependencies...
call npm install @youware/vite-plugin-react
call npm install

echo Starting Vite dev server...
call npm run dev

pause