#!/bin/bash

FILE="material-symbols-sharp.css"
FONT_FOLDER="web-font"
AGENT_WOFF="Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko"
AGENT_WOFF2="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36"

SRC_LINE=""
# src: url('./web-font/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2') format('woff2'), url('./web-font/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.woff') format('woff');

rm -rf $FONT_FOLDER
mkdir $FONT_FOLDER

for AGENT in "$AGENT_WOFF2" "$AGENT_WOFF"; do
  # download css
  URL=$(wget https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200 -O - --header="User-Agent: ${AGENT}" | \
    sed "s/local('.*'), //" | tr '()' \\n | grep https\*:// | head -n 1)

  SRC_LINE+="url\(\'\.\/web-font\/"$(basename $URL)"\'\) format\(\'woff"
  if [ "$AGENT" == "$AGENT_WOFF" ]; then
    SRC_LINE+="\'\)\;"
  else
    SRC_LINE+="2\'\), "
  fi

  # download http link
  wget $URL -P $FONT_FOLDER
done

SED="s!src: .*;!src: "$SRC_LINE"!g"
sed -e "$SED" $FILE > $FILE".tmp" && mv $FILE".tmp" $FILE
