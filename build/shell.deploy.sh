BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" == "master" ]
then
  TAG="latest"
else
  TAG="$BRANCH"
fi

set -e
echo "Enter release version @$TAG: "
read VERSION

read -p "Deploy $VERSION@$TAG - are you sure? (y/n)" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Deploying $VERSION@$TAG ..."

  # lint and test
  npm run lint 2>/dev/null

  # build
  VERSION=$VERSION npm run build

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION"

  # publish
  git push origin refs/tags/v$VERSION
  git push
  npm publish --tag=$TAG
fi
