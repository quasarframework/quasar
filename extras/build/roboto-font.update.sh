#!/bin/bash

if ! command -v wget &>/dev/null; then
  echo Please install wget
  echo sudo apt install wget
  exit 1
fi

cd ../exports/roboto-font || exit 1

FILE="roboto-font.css"
FONT_FOLDER="web-font"
# A current browser gets the variable font (wght 100..900) as one woff2 per script
# subset with unicode-range; a Windows UA gets the hinted build
AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
VERSION=""

wget 'https://fonts.googleapis.com/css2?family=Roboto:wght@100..900' -O - --header="User-Agent: ${AGENT}" > $FILE

URL=$(cat $FILE | tr '()' \\n | grep https\*:// | head -n 1)
[ -n "$URL" ] && VERSION=$(printf '%s' "$URL" | grep -oE 'v[0-9]+')

rm -rf $FONT_FOLDER
mkdir $FONT_FOLDER

# download every subset file once
cat $FILE | tr '()' \\n | grep https\*:// | sort -u | while read -r URL; do
  wget -O "${FONT_FOLDER}/$(basename "$URL")" "$URL"
done

# replace links to local filenames
sed -E "s#https://[^)]*/([^/?)]*\\.woff2)#./web-font/\\1#g" "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"

# roboto-font-latin-ext is an alias of this package, kept for compatibility
sed -E "s#\\./web-font/#../roboto-font/web-font/#g" "$FILE" > ../roboto-font-latin-ext/roboto-font-latin-ext.css

if [ -n "$VERSION" ]; then
  echo "QEXTRA_VERSION::roboto-font::${VERSION}"
  echo "QEXTRA_VERSION::roboto-font-latin-ext::${VERSION}"
else
  echo "Failed to determine version for roboto-font!!!"
  exit 1
fi
