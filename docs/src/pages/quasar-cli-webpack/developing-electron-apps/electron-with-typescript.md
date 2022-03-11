---
title: Electron with Typescript
desc: How to use Typescript with Electron in Quasar
---

In order to support Electron with Typescript, you will need to:

1. Make sure that you are using `@quasar/app` v3.0.0-beta.8+
2. Edit quasar.conf.js > supportTS. Set it to `true` or use the Object form.
3. Rename the extension for your files in /src-electron from `.js` to `.ts` and make the necessary TS code changes.

::: tip
`electron-packager` and `electron-builder` export their configuration types from their own packages.
Since autocomplete into `quasar.conf.js` relies on those types, properties `electron.packager` and `electron.builder` will be fully typed only after the respective package is installed.
You can force the installation of the selected bundler (depending on your `electron.bundler` option) by running a build command in Electron mode: `quasar build -m electron`  
:::

More info: [Supporting TS](/quasar-cli/supporting-ts)
