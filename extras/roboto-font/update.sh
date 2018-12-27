#!/bin/bash

FILE="roboto-font.css"
FONT_FOLDER="web-font"
AGENT_WOFF="Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko"
AGENT_WOFF2="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36"

# download css as IE11 for .woff
wget https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900 -O - --header="User-Agent: ${AGENT_WOFF}" | \
  sed "s/local('.*'), //" > $FILE

# get links dirname
URL=$(cat $FILE | tr '()' \\n | grep https\*:// | head -n 1)
DIRNAME=$(dirname $URL)

rm -rf $FONT_FOLDER
mkdir $FONT_FOLDER

# download all http links
cat $FILE | tr '()' \\n | grep https\*:// | parallel --gnu "wget {} -P $FONT_FOLDER"

# replace links to local
sed -e "s*"$DIRNAME"*\./web-font*" $FILE > $FILE".tmp" && mv $FILE".tmp" $FILE
