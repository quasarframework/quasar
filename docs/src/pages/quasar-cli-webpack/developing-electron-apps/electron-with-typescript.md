---
title: Electron with Typescript
desc: (@quasar/app-webpack) How to use Typescript with Electron in Quasar
---

In order to support Electron with Typescript, you will need to:

1. Edit quasar.config.js > supportTS. Set it to `true` or use the Object form.
2. Rename the extension for your files in /src-electron from `.js` to `.ts` and make the necessary TS code changes.

::: tip
`electron-packager` and `electron-builder` export their configuration types from their own packages.
Since autocomplete into `quasar.config.js` relies on those types, properties `electron.packager` and `electron.builder` will be fully typed only after the respective package is installed.
You can force the installation of the selected bundler (depending on your `electron.bundler` option) by running a build command in Electron mode: `quasar build -m electron`
:::

More info: [Supporting TS](/quasar-cli-webpack/supporting-ts)
