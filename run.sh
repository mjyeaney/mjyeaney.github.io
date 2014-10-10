pkill Python
cp /dev/null log.txt
python -m SimpleHTTPServer > log.txt 2>&1 &
