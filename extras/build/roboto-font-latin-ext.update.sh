#!/bin/bash

if ! command -v parallel &>/dev/null; then
  echo Please install parallel
  echo sudo apt install parallel
  exit 1
fi

if ! command -v wget &>/dev/null; then
  echo Please install wget
  echo sudo apt install wget
  exit 1
fi

cd ../exports/roboto-font-latin-ext || exit 1

FILE="roboto-font-latin-ext.css"
FONT_FOLDER="web-font"
# Firefox 40 supports woff2 but not unicode-range, so Google Fonts serves one woff2 per weight
AGENT="Mozilla/5.0 (Windows NT 6.1; rv:40.0) Gecko/20100101 Firefox/40.0"
VERSION=""

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

# download css as Firefox 40 for one .woff2 per weight
wget 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&subset=latin-ext' -O - --header="User-Agent: ${AGENT}" | \
  sed "s/local('.*'), //" > $FILE

URL=$(cat $FILE | tr '()' \\n | grep https\*:// | head -n 1)
[ -n "$URL" ] && VERSION=$(printf '%s' "$URL" | grep -oE 'v[0-9]+')

rm -rf $FONT_FOLDER
mkdir $FONT_FOLDER

# download all http links
cat $FILE | tr '()' \\n | grep https\*:// | while read -r URL; do
  FONT_FILE=$(get_local_font_name "$URL")
  wget -O "${FONT_FOLDER}/${FONT_FILE}" "$URL"
done

# replace links to local filenames
sed -E "s#https://[^)]*/font\\?kit=([^&)]*)[^)]*#./web-font/\\1.woff2#g; s#https://[^)]*/([^/?)]*\\.woff2?)#./web-font/\\1#g" \
  "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"

if [ -n "$VERSION" ]; then
  echo "QEXTRA_VERSION::roboto-font-latin-ext::${VERSION}"
else
  echo "Failed to determine version for roboto-font-latin-ext!!!"
  exit 1
fi
