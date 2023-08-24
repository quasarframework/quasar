---
title: Electron with Typescript
desc: (@quasar/app-vite) How to use Typescript with Electron in Quasar
---

In order to support Electron with Typescript, you will need to rename the extension for your files in /src-electron from `.js` to `.ts` and make the necessary TS code changes.

::: tip
`electron-packager` and `electron-builder` export their configuration types from their own packages.
Since autocomplete into the `quasar.config` file relies on those types, properties `electron.packager` and `electron.builder` will be fully typed only after the respective package is installed.
You can force the installation of the selected bundler (depending on your `electron.bundler` option) by running a build command in Electron mode: `quasar build -m electron`
:::
