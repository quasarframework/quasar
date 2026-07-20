---
title: Upgrade guide on Electron
description: (@quasar/app-vite) Upgrading instructions when dealing with Electron in Quasar.
canonical: https://quasar.dev/quasar-cli-vite/developing-electron-apps/electron-upgrade-guide
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Upgrading Electron

When you add the Electron mode in a Quasar project for the first time you will get the latest version of the Electron package. At some point in time, you will want to upgrade the Electron version.

Review Electron's [breaking changes](https://www.electronjs.org/docs/latest/breaking-changes) and release notes before upgrading. Move through major versions deliberately and rebuild any native dependencies afterward.

```tabs
<<| bash PNPM |>>
# from /src-electron:
pnpm add -D electron@latest
<<| bash Yarn |>>
# from /src-electron:
yarn add -D electron@latest
<<| bash NPM |>>
# from /src-electron:
npm install -D electron@latest
<<| bash Bun |>>
# from /src-electron:
bun add -D electron@latest
```
