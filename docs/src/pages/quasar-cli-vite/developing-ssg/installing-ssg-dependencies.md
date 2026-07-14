---
title: Installing SSG-specific dependencies
desc: (@quasar/app-vite) How to handle SSG-specific dependencies.
---

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

Notice the `/src-ssg/package.json` file in your generated `/src-ssg` folder. The purpose of it is for you to be able to install packages used by the SSG mode directly under this folder (and not pollute the common `/src`).

```json /src-ssg/package.json
{
  "name": "quasar-ssg-app",
  "version": "1.0.0",
  "description": "Quasar SSG folder",
  "type": "module",
  "private": true,
  "dependencies": {}
}
```

::: warning
If you import anything from node_modules in /src-ssg, then be aware that you will need to install those packages directly in /src-ssg. All these dependencies are used when building the SSG html files.
:::

Installing SSG specific packages:

```tabs
<<| bash PNPM |>>
# run in /src-ssg:
pnpm add <deps>
<<| bash Yarn |>>
# run in /src-ssg:
yarn add <deps>
<<| bash NPM |>>
# run in /src-ssg:
npm install <deps>
<<| bash Bun |>>
# run in /src-ssg:
bun add <deps>
```
