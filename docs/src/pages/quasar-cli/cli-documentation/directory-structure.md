---
title: Directory Structure
---
This is the structure of a project with all modes installed. There's no reason to be intimidated though!

::: tip
If you are a beginner, all you'll need to care about is `/quasar.conf.js` (Quasar App Config file), `/src/router`, `/src/layouts`, `/src/pages` and optionally `/src/assets`.
:::

``` bash
.
├── src/
│   ├── assets/              # dynamic assets (processed by webpack)
│   ├── statics/             # pure static assets (directly copied)
│   ├── components/          # .vue components used in pages & layouts
│   ├── css/                 # CSS/Stylus/Sass/... files for your app
|   |   ├── app.styl
|   │   └── themes/          # Quasar themes entry points for you to tweak
|   │       ├── common.variables.styl # Common Stylus variables for all Quasar themes
|   │       ├── variables.mat.styl    # Variables for Material Design theme
|   │       └── variables.ios.styl    # Variables for iOS theme
│   ├── layouts/             # layout .vue files
│   ├── pages/               # page .vue files
│   ├── plugins/             # app plugins (app initialization code)
│   ├── router/              # Vue Router
|   |   ├── index.js         # Vue Router definition
|   │   └── routes.js        # App Routes definitions
│   ├── store/               # Vuex Store
|   |   ├── index.js         # Vuex Store definition
|   │   ├── <folder>         # Vuex Store Module...
|   │   └── <folder>         # Vuex Store Module...
│   ├── App.vue              # root Vue component of your App
│   └── index.template.html  # Template for index.html
├── src-ssr/                 # SSR specific code (like production Node webserver)
├── src-pwa/                 # PWA specific code (like Service Worker)
├── src-cordova/             # Cordova generated folder used to create Mobile Apps
├── src-electron/            # Electron specific code (like "main" thread)
├── dist/                    # where production builds go
│   ├── spa-mat/             # example when building SPA with MAT theme
│   ├── spa-ios/             # example when building SPA with IOS theme
│   ├── electron-mat/        # example when building Electron with MAT theme
│   └── ....
├── quasar.conf.js           # Quasar App Config file
├── .babelrc                 # babel config
├── .editorconfig            # editor config
├── .eslintignore            # ESlint ignore paths
├── .eslintrc.js             # ESlint config
├── .postcssrc.js            # PostCSS config
├── .stylintrc               # Stylus lint config
├── .gitignore               # GIT ignore paths
├── package.json             # npm scripts and dependencies
└── README.md                # readme for your website/App
```
