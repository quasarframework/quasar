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
electron: {
  // optional; webpack config Object for
  // the Main Process ONLY (/src-electron/main-process/)
  extendWebpack (cfg) {
    // directly change props of cfg;
    // no need to return anything
  },

  // optional; EQUIVALENT to extendWebpack() but uses webpack-chain;
  // for the Main Process ONLY (/src-electron/main-process/)
  chainWebpack (chain) {
    // chain is a webpack-chain instance
    // of the Webpack configuration
  },

  bundler: 'packager', // or 'builder'

  // electron-packager options
  packager: {
    //...
  },

  // electron-builder options
  builder: {
    //...
  }
}
```

The "packager" prop refers to [electron-packager options](https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options). The `dir` and `out` properties are overwritten by Quasar CLI to ensure the best results.

The "builder" prop refers to [electron-builder options](https://www.electron.build/configuration/configuration).

## Packager vs. Builder
You have to choose to use either packager or builder. They are both excellent open-source projects, however they serve slightly different needs. With packager you will be able to build unsigned projects for all major platforms from one machine. Although this is great, if you just want something quick and dirty, there is more platform granularity (and general polish) in builder. Cross-compiling your binaries from one computer doesn't really work with builder (or we haven't found the recipe yet...)
