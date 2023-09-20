#!/bin/bash


# Test anti injection SQL

curl 'http://localhost/api/login'  \
-X POST  \
-H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/116.0'  \
-H 'Accept: application/json, text/plain, */*'  \
-H 'Accept-Language: en-US,en;q=0.5'  \
-H 'Accept-Encoding: gzip, deflate, br'  \
-H 'Content-Type: application/json'  \
-H 'Origin: http://localhost:3000'  \
-H 'Connection: keep-alive'  \
-H 'Referer: http://localhost:3000/'  \
-H 'Cookie: sessionId=k090af2mhcq'  \
-H 'Sec-Fetch-Dest: empty'  \
-H 'Sec-Fetch-Mode: cors'  \
-H 'Sec-Fetch-Site: same-site'  \
--data-raw $'{"username":"admin","password":"\'or\'1\'=\'1"}'

echo

