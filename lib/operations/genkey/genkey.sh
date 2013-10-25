#|/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

sed  s/"application_seach"/$1/ $DIR/nodekey.js > $DIR/nodekey$1.js;

mongo --quiet  application nodekey$1.js  > ../cache/$1Key
