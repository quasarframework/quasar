#!/bin/bash

echo Deploying Quasar. Whoa!

if [ -z $1 ]; then
  echo Missing parameter: edge or future
  echo
  exit 1
elif [ ! "$1" == "edge" ] && [ ! "$1" == "future" ]; then
  echo Wrong parameter. Specify: edge or future
  echo
  exit 1
fi

npm run build
rm -rf deploy
mkdir deploy
cp -R dist i18n icons LICENSE package.json deploy
cp "build/README-$1.md" deploy/README.md
node_modules/git-directory-deploy/bin/git-directory-deploy.sh -ddeploy -bmaster "-rgit@github.com:quasarframework/quasar-$1.git"
rm -rf deploy
