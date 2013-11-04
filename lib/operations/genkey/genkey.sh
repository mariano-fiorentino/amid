#/bin/bash
## lunch it with database collection params

sed  s/"application_seach"/$2/ nodekey.js > nodekey$2.js;

mongo --quiet $1 nodekey$2.js  > ../cache/$2Key
