@echo off
echo ========================================================
echo  Pushing MedCare Plus Project to GitHub Repository
echo ========================================================
echo.
"C:\Users\nayan\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" remote set-url origin https://github.com/Nayan01747/itue301-exam-24DCE002-A.git
"C:\Users\nayan\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" branch -M main
"C:\Users\nayan\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe" push -u origin main
echo.
echo Done! Refresh https://github.com/Nayan01747/itue301-exam-24DCE002-A in your browser.
pause
