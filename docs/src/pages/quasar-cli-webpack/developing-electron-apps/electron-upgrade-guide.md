---
title: Upgrade guide on Electron
desc: (@quasar/app-webpack) Upgrading instructions when dealing with Electron in Quasar.
---

## Upgrading Electron

When you add the Electron mode in a Quasar project for the first time you will get the latest version of the Electron package. At some point in time, you will want to upgrade the Electron version.

Before upgrading Electron, please consult its release notes. Are there breaking changes?

```tabs
<<| bash Yarn |>>
# from the root of your Quasar project
$ yarn upgrade electron@latest
<<| bash NPM |>>
# from the root of your Quasar project
$ npm install electron@latest
<<| bash PNPM |>>
# from the root of your Quasar project
$ pnpm add electron@latest
<<| bash Bun |>>
# from the root of your Quasar project
$ bun add electron@latest
```
