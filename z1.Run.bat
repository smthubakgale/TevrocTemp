::@echo off

rem Project Path  
set proj=%cd%
set port=3009
rem PHP Path 
set PATH=%PATH%;C:\php;C:\php 

rem Run in localhost
C:\php\php.exe -S localhost:%port% -t %proj%/  

pause 