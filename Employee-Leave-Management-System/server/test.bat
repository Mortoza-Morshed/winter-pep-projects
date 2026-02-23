@echo off
echo Testing... > success_bat.txt
node -v >> success_bat.txt
npm -v >> success_bat.txt
dir >> success_bat.txt
echo Done.
