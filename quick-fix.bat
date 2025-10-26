@echo off
echo.
echo ========================================
echo   QUICK FIX: Add Your OpenAI API Key
echo ========================================
echo.
echo Opening .env file in Notepad...
echo.
echo PASTE THIS LINE (replace with your key):
echo OPENAI_API_KEY=sk-your-actual-key-here
echo.
echo Then SAVE and CLOSE the file.
echo.
pause
notepad .env
echo.
echo ========================================
echo   Starting server...
echo ========================================
echo.
npm run server

