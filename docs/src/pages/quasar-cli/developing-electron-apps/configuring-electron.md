---
title: Configuring Electron
desc: How to manage your Electron apps with Quasar CLI.
related:
  - /quasar-cli/quasar-conf-js
---
We'll be using Quasar CLI to develop and build an Electron App. The difference between building a SPA, PWA, Mobile App or an Electron App is simply determined by the "mode" parameter in "quasar dev" and "quasar build" commands.

But first, let's learn how we can configure the Electron build.

## Quasar.conf.js
You may notice that `/quasar.conf.js` contains a property called `electron`.

```js
// should you wish to change default files
// (notice no extension, so it resolves to both .js and .ts)
sourceFiles: {
  electronMain: 'src-electron/electron-main',
  electronPreload: 'src-electron/electron-preload'
},

// electron configuration
electron: {
  bundler: 'packager', // or 'builder'

  // electron-packager options
  // https://electron.github.io/electron-packager/master/
  packager: {
    //...
  },

  // electron-builder options
  // https://www.electron.build/configuration/configuration
  builder: {
    //...
  },

  // Specify additional parameters when yarn/npm installing
  // the UnPackaged folder, right before bundling with either
  // electron packager or electron builder;
  // Example: [ '--ignore-optional', '--some-other-param' ]
  unPackagedInstallParams: [],

  // optional; add/remove/change properties
  // of production generated package.json
  extendPackageJson (pkg) {
    // directly change props of pkg;
    // no need to return anything
  },

  // optional; webpack config Object for
  // the Main Process ONLY (/src-electron/main-process/electron-main.js)
  extendWebpackMain (cfg) {
    // directly change props of cfg;
    // no need to return anything
  },

  // optional; EQUIVALENT to extendWebpackMain() but uses webpack-chain;
  // for the Main Process ONLY (/src-electron/main-process/electron-main.js)
  chainWebpackMain (chain) {
    // chain is a webpack-chain instance
    // of the Webpack configuration

    // example:
    // chain.plugin('eslint-webpack-plugin')
    //   .use(ESLintPlugin, [{ extensions: [ 'js' ] }])
  },

  // optional; webpack config Object for
  // the Preload Process ONLY (/src-electron/main-process/electron-preload.js)
  extendWebpackPreload (cfg) {
    // directly change props of cfg;
    // no need to return anything
  },

  // optional; EQUIVALENT to extendWebpackPreload() but uses webpack-chain;
  // for the Preload Process ONLY (/src-electron/main-process/electron-preload.js)
  chainWebpackPreload (chain) {
    // chain is a webpack-chain instance
    // of the Webpack configuration

    // example:
    // chain.plugin('eslint-webpack-plugin')
    //   .use(ESLintPlugin, [{ extensions: [ 'js' ] }])
  }
}
```

The "packager" prop refers to [electron-packager options](https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options). The `dir` and `out` properties are overwritten by Quasar CLI to ensure the best results.

The "builder" prop refers to [electron-builder options](https://www.electron.build/configuration/configuration).

## Packager vs. Builder
You have to choose to use either packager or builder. They are both excellent open-source projects, however they serve slightly different needs. With packager you will be able to build unsigned projects for all major platforms from one machine. Although this is great, if you just want something quick and dirty, there is more platform granularity (and general polish) in builder. Cross-compiling your binaries from one computer doesn't really work with builder (or we haven't found the recipe yet...)
