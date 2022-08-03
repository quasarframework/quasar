---
title: Directory Structure
desc: (@quasar/app-vite) The structure of a Quasar app with explanations for each folder and file.
---
This is the structure of a project with all modes installed. There's no reason to be intimidated though!

::: tip
If you are a beginner, all you'll need to care about is `/quasar.config.js` (Quasar App Config file), `/src/router`, `/src/layouts`, `/src/pages` and optionally `/src/assets`.
:::

``` bash
.
├── public/                  # pure static assets (directly copied)
├── src/
│   ├── assets/              # dynamic assets (processed by Vite)
│   ├── components/          # .vue components used in pages & layouts
│   ├── css/                 # CSS/Sass/... files for your app
|   |   ├── app.sass
|   │   └── quasar.variables.sass # Quasar Sass variables for you to tweak
│   ├── layouts/             # layout .vue files
│   ├── pages/               # page .vue files
│   ├── boot/                # boot files (app initialization code)
│   ├── router/              # Vue Router
|   |   ├── index.js         # Vue Router definition
|   │   └── routes.js        # App Routes definitions
│   ├── stores/              # Pinia Stores (if not using Vuex)
|   |   ├── index.js         # Pinia initialization
|   │   ├── <store>          # Pinia stores...
|   │   └── <store>...
│   ├── store/               # Vuex Store (if not using Pinia)
|   |   ├── index.js         # Vuex Store definition
|   │   ├── <folder>         # Vuex Store Module...
|   │   └── <folder>         # Vuex Store Module...
│   └── App.vue              # root Vue component of your App
├── index.html               # Template for index.html
├── src-ssr/                 # SSR specific code (like production Node webserver)
├── src-pwa/                 # PWA specific code (like Service Worker)
├── src-cordova/             # Cordova generated folder used to create Mobile Apps
├── src-electron/            # Electron specific code (like "main" thread)
├── src-bex/                 # BEX (browser extension) specific code (like "main" thread)
├── dist/                    # where production builds go
│   ├── spa/                 # example when building SPA
│   ├── ssr/                 # example when building SSR
│   ├── electron/            # example when building Electron
│   └── ....
├── quasar.config.js         # Quasar App Config file
├── .gitignore               # GIT ignore paths
├── .editorconfig            # editor config
├── .eslintignore            # ESlint ignore paths
├── .eslintrc.js             # ESlint config
├── postcss.config.js        # PostCSS config
├── jsconfig.json            # Editor config (if not using Typescript)
├── tsconfig.json            # Typescript config
├── package.json             # npm scripts and dependencies
└── README.md                # readme for your website/App
```
