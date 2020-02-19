# Development and Build Scripts

## Updating Icons

The `src/svg` directory is the single source of truth for svgs. They should not already be optimized and can be the original svg export straight out of an svg editor. A build step before releasing will optimize the source svgs (remove comments, reduce the size, etc) and ensure they'll work within `ion-icon`.


## Build Locally

After an svg has been updated, added or deleted from the `src/svg` directory, run:

    npm run build

The build command will optimize all of the icons and generate the files to be distributed. After the build command, all of the optimized svgs are saved in `dist/ionicons/svg`. Additionally the `dist` directory contains the distribution files for the `ion-icon` web component.


## Svg Symbols Cheatsheet

After a build, a new `www/cheatsheet.html` file will be created. This version uses svg symbols rather than `ion-icon`.


## ion-icon Component Preview

To see the `ion-icon` component in action, run:

    npm start


## Release Steps

    npm run release.prepare

The release script will ask what version to use. After the script completes, double check the `www/cheatsheet.html` to ensure everything is good to go.

Next, update `CHANGELOG.md`, then commit and push your changes Github.

Next run:

    npm run release

Triple check the version number is correct, and choose which tag this should be released as. If it's a pre-release, it should be `dev`.
