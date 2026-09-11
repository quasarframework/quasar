#!/bin/bash

if ! command -v wget &>/dev/null; then
  echo Please install wget
  echo sudo apt install wget
  exit 1
fi

cd ../exports/material-symbols-outlined || exit 1

FILE="material-symbols-outlined.css"
FONT_FOLDER="web-font"
AGENT="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36"

VERSION=""
# src: url('./web-font/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2') format('woff2');

get_local_font_name() {
  local url="$1"

  if [[ "$url" == *"/font?kit="* ]]; then
    local font_file="${url#*kit=}"
    font_file="${font_file%%&*}"
    printf '%s.woff2' "$font_file"
  else
    basename "$url"
  fi
}

rm -rf $FONT_FOLDER
mkdir $FONT_FOLDER

# download css
URL=$(wget https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200 -O - --header="User-Agent: ${AGENT}" | \
  sed "s/local('.*'), //" | tr '()' \\n | grep https\*:// | head -n 1)
VERSION=$(printf '%s' "$URL" | grep -oE 'v[0-9]+')

FONT_FILE=$(get_local_font_name "$URL")
SRC_LINE="url\(\'\.\/web-font\/${FONT_FILE}\'\) format\(\'woff2\'\);"

# download http link
wget -O "${FONT_FOLDER}/${FONT_FILE}" "$URL"

SED="s!src: .*;!src: "$SRC_LINE"!g"
sed -e "$SED" $FILE > $FILE".tmp" && mv $FILE".tmp" $FILE

if [ -n "$VERSION" ]; then
  echo "QEXTRA_VERSION::material-symbols-outlined::${VERSION}"
else
  echo "Failed to determine version for material-symbols-outlined!!!"
  exit 1
fi
