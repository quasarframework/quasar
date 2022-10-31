---
title: Directory Structure
desc: (@quasar/app-webpack) The structure of a Quasar app with explanations for each folder and file.
scope:
  tree:
    l: '.'
    c: [
      { l: 'public', e: 'Pure static assets (directly copied)' },
      {
        l: 'src',
        c: [
          { l: 'assets/', e: 'Dynamic assets (processed by Webpack)' },
          { l: 'components/', e: '.vue components used in pages & layouts' },
          {
            l: 'css',
            e: 'CSS/Sass/... files for your app',
            c: [
              { l: 'app.sass' },
              { l: 'quasar.variables.sass', e: 'Quasar Sass variables for you to tweak' }
            ]
          },
          { l: 'layouts/', e: 'Layout .vue files' },
          { l: 'pages/', e: 'Page .vue files' },
          { l: 'boot/', e: 'Boot files (app initialization code)' },
          { l: 'router',
            e: 'Vue Router',
            c: [
              { l: 'index.js', e: 'Vue Router definition' },
              { l: 'routes.js', e: 'App Routes definitions' }
            ]
          },
          {
            l: 'stores',
            e: 'Pinia Stores (if not using Vuex)',
            c: [
              { l: 'index.js', e: 'Pinia initialization' },
              { l: '<store>', e: 'Pinia stores...' },
              { l: '<store>...' }
            ]
          },
          {
            l: 'store',
            e: 'Vuex Store (if not using Pinia)',
            c: [
              { l: 'index.js', e: 'Vuex Store definition' },
              { l: '<folder>', e: 'Vuex Store Module..' },
              { l: '<folder>', e: 'Vuex Store Module..' }
            ]
          },
          { l: 'App.vue', e: 'Root Vue component of your App' },
          { l: 'index.template.html', e: 'Template for index.html' }
        ]
      },
      { l: 'src-ssr/', e: 'SSR specific code (like production Node webserver)' },
      { l: 'src-pwa/', e: 'PWA specific code (like Service Worker)' },
      { l: 'src-cordova/', e: 'Cordova generated folder used to create Mobile Apps' },
      { l: 'src-electron/', e: 'Electron specific code (like "main" thread)' },
      { l: 'src-bex/', e: 'BEX (browser extension) specific code (like "main" thread)' },
      { l: 'dist',
        e: 'Where production builds go',
        c: [
          { l: 'spa', e: 'Example when building SPA' },
          { l: 'ssr', e: 'Example when building SSR' },
          { l: 'electron', e: 'Example when building Electron' },
          { l: '...' }
        ]
      },
      { l: 'quasar.config.js', e: 'Quasar App Config file' },
      { l: 'babel.config.js', e: 'Babeljs config' },
      { l: '.editorconfig', e: 'EditorConfig file' },
      { l: '.eslintignore', e: 'ESLint ignore paths' },
      { l: '.eslintrc.js', e: 'ESLint config' },
      { l: '.postcssrc.js', e: 'PostCSS config' },
      { l: 'jsconfig.json', e: 'Editor config (if not using TypeScript)' },
      { l: 'tsconfig.json', e: 'TypeScript config' },
      { l: '.gitignore', e: 'GIT ignore paths' },
      { l: 'package.json', e: 'npm scripts and dependencies' },
      { l: 'README.md', e: 'Readme for your website/App' }
    ]
---
This is the structure of a project with all modes installed. There's no reason to be intimidated though!

::: tip
If you are a beginner, all you'll need to care about is `/quasar.config.js` (Quasar App Config file), `/src/router`, `/src/layouts`, `/src/pages` and optionally `/src/assets`.
:::

<doc-tree :def="scope.tree" />
