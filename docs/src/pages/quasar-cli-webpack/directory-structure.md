---
title: Directory Structure
desc: (@quasar/app-webpack) The structure of a Quasar app with explanations for each folder and file.
scope:
  tree:
    l: '.'
    c: [
      { l: 'public', e: 'Pure static assets (directly copied)', r: '/quasar-cli-webpack/handling-assets#static-assets-public' },
      {
        l: 'src',
        c: [
          { l: 'assets/', e: 'Dynamic assets (processed by Webpack)', r: '/quasar-cli-webpack/handling-assets#regular-assets-src-assets' },
          { l: 'components/', e: '.vue components used in pages & layouts', r: '/start/how-to-use-vue#vue-single-file-components-sfc-' },
          {
            l: 'css',
            e: 'CSS/Sass/... files for your app',
            c: [
              { l: 'app.sass' },
              { l: 'quasar.variables.sass', e: 'Quasar Sass variables for you to tweak', r: '/style/sass-scss-variables#introduction' }
            ]
          },
          { l: 'layouts/', e: 'Layout .vue files', r: '/layout/layout' },
          { l: 'pages/', e: 'Page .vue files' },
          { l: 'boot/', e: 'Boot files (app initialization code)', r: '/quasar-cli-webpack/boot-files' },
          { l: 'router',
            e: 'Vue Router',
            r: '/quasar-cli-webpack/routing',
            c: [
              { l: 'index.js', e: 'Vue Router definition' },
              { l: 'routes.js', e: 'App Routes definitions' }
            ]
          },
          {
            l: 'stores',
            e: 'Pinia Stores (if not using Vuex)',
            r: '/quasar-cli-webpack/state-management-with-pinia',
            c: [
              { l: 'index.js', e: 'Pinia initialization' },
              { l: '<store>', e: 'Pinia stores...' },
              { l: '<store>...' }
            ]
          },
          {
            l: 'store',
            e: 'Vuex Store (if not using Pinia)',
            r: '/quasar-cli-webpack/state-management-with-vuex',
            c: [
              { l: 'index.js', e: 'Vuex Store definition' },
              { l: '<folder>', e: 'Vuex Store Module..' },
              { l: '<folder>', e: 'Vuex Store Module..' }
            ]
          },
          { l: 'App.vue', e: 'Root Vue component of your App', r: 'https://vuejs.org/guide/essentials/application.html' },
          { l: 'index.template.html', e: 'Template for index.html' }
        ]
      },
      { l: 'src-ssr/', e: 'SSR specific code (like production Node webserver)', r: '/quasar-cli-webpack/developing-ssr/introduction' },
      { l: 'src-pwa/', e: 'PWA specific code (like Service Worker)', r: '/quasar-cli-webpack/developing-spa/introduction' },
      { l: 'src-cordova/', e: 'Cordova generated folder used to create Mobile Apps', r: '/quasar-cli-webpack/developing-cordova-apps/introduction' },
      { l: 'src-electron/', e: 'Electron specific code (like "main" thread)', r: '/quasar-cli-webpack/developing-electron-apps/introduction' },
      { l: 'src-bex/', e: 'BEX (browser extension) specific code (like "main" thread)', r: '/quasar-cli-webpack/developing-browser-extensions/introduction' },
      { l: 'dist',
        e: 'Where production builds go',
        c: [
          { l: 'spa', e: 'Example when building SPA' },
          { l: 'ssr', e: 'Example when building SSR' },
          { l: 'electron', e: 'Example when building Electron' },
          { l: '...' }
        ]
      },
      { l: 'quasar.config.js', e: 'Quasar App Config file', r: 'quasar-cli-webpack/quasar-config-js' },
      { l: 'babel.config.js', e: 'Babeljs config', r: 'https://babeljs.io/docs/en/configuration' },
      { l: '.editorconfig', e: 'EditorConfig file', r: 'https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig' },
      { l: '.eslintignore', e: 'ESLint ignore paths', r: 'https://eslint.org/docs/latest/user-guide/configuring/ignoring-code#the-eslintignore-file' },
      { l: '.eslintrc.js', e: 'ESLint config', r: 'https://eslint.org/docs/latest/user-guide/configuring/configuration-files#using-configuration-files' },
      { l: '.postcssrc.js', e: 'PostCSS config', r: 'https://github.com/postcss/postcss' },
      { l: 'jsconfig.json', e: 'Editor config (if not using TypeScript)', r: 'https://code.visualstudio.com/docs/languages/jsconfig' },
      { l: 'tsconfig.json', e: 'TypeScript config', r: 'https://www.typescriptlang.org/docs/handbook/tsconfig-json.html' },
      { l: '.gitignore', e: 'GIT ignore paths', r: 'https://git-scm.com/docs/gitignore' },
      { l: 'package.json', e: 'npm scripts and dependencies', r: 'https://docs.npmjs.com/cli/v9/configuring-npm/package-json' },
      { l: 'README.md', e: 'Readme for your website/App', r: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes' }
    ]
---
This is the structure of a project with all modes installed. There's no reason to be intimidated though!

::: tip
If you are a beginner, all you'll need to care about is `/quasar.config.js` (Quasar App Config file), `/src/router`, `/src/layouts`, `/src/pages` and optionally `/src/assets`.
:::

<doc-tree :def="scope.tree" />
