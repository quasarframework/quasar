---
title: Directory Structure
description: (@quasar/app-vite) The structure of a Quasar app with explanations for each folder and file.
canonical: https://quasar.dev/quasar-cli-vite/directory-structure
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

This is the structure of a project with all modes installed. There's no reason to be intimidated though!

::: tip
If you are a beginner, all you'll need to care about is the `/quasar.config` file (Quasar App Config file), `/src/router`, `/src/layouts`, `/src/pages` and optionally `/src/assets`.
:::

- .
  - [public/](/quasar-cli-vite/handling-assets#static-assets-public) — Pure static assets (copied as-is)
  - src
    - [assets/](/quasar-cli-vite/handling-assets#regular-assets-src-assets) — Dynamic assets (processed by Vite)
    - [components/](/start/how-to-use-vue#vue-single-file-components-sfc-) — .vue components used in pages & layouts
    - css — CSS/Sass/... files for your app
      - app.sass
      - [quasar.variables.sass](/style/sass-scss-variables) — Quasar Sass variables for you to tweak
    - [layouts/](/layout/layout) — Layout .vue files
    - pages/ — Page .vue files
    - [boot/](/quasar-cli-vite/boot-files) — Boot files (app initialization code)
    - [router](/quasar-cli-vite/page-routing-with-vue-router) — Vue Router
      - index.js — (or .ts) Vue Router definition
      - routes.js — (or .ts) App Routes definitions
      - typed-router.d.ts — TypeScript only, along with build.filenameBasedRouting enabled
    - [stores](/quasar-cli-vite/state-management-with-pinia) — Pinia Stores
      - index.js — (or .ts) Pinia initialization
      - <store> — Pinia stores...
      - <store>...
    - App.vue — Root Vue component of your App
  - [src-ssr/](/quasar-cli-vite/developing-ssr/introduction) — SSR specific code (like production Node.js webserver)
  - [src-ssg/](/quasar-cli-vite/developing-ssg/introduction) — SSG specific code (like ssg-renderer script)
  - [src-pwa/](/quasar-cli-vite/developing-pwa/introduction) — PWA specific code (like Service Worker)
  - [src-capacitor/](/quasar-cli-vite/developing-capacitor-apps/introduction) — Capacitor generated folder used to create Mobile Apps
  - [src-cordova/](/quasar-cli-vite/developing-cordova-apps/introduction) — Cordova generated folder used to create Mobile Apps
  - [src-electron/](/quasar-cli-vite/developing-electron-apps/introduction) — Electron specific code (like "main" thread)
  - [src-bex/](/quasar-cli-vite/developing-browser-extensions/introduction) — BEX (browser extension) specific code (like "main" thread)
  - dist — Where production builds go
    - spa — Example when building SPA
    - ssr — Example when building SSR
    - electron — Example when building Electron
    - ...
  - [quasar.config.js](/quasar-cli-vite/quasar-config-file) — (or .ts) Quasar App Config file
  - index.html — Template for index.html
  - [.gitignore](https://git-scm.com/docs/gitignore) — GIT ignore paths
  - [.editorconfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) — EditorConfig file
  - [eslint.config.js](https://eslint.org/docs/latest/user-guide/configuring/configuration-files#using-configuration-files) — ESLint config
  - [postcss.config.js](https://github.com/postcss/postcss) — PostCSS config
  - [jsconfig.json](https://code.visualstudio.com/docs/languages/jsconfig) — Editor config (if not using TypeScript)
  - [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) — TypeScript config
  - env.d.ts — TypeScript only
  - [package.json](https://docs.npmjs.com/cli/v9/configuring-npm/package-json) — npm scripts and dependencies
  - [README.md](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) — Readme for your website/App
