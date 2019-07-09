---
title: Configuring Proton
desc: How to manage your Proton apps with Quasar CLI.
related:
  - /quasar-cli/quasar-conf-js
---
We'll be using Quasar CLI to develop and build a Proton App. The difference between building a SPA, PWA, Mobile App, Electron or Proton App is simply determined by the "mode" parameter in "quasar dev" and "quasar build" commands.

But first, let's learn how we can configure the Proton build.

## Quasar.conf.js
You may notice that `/quasar.conf.js` contains a property called `proton`.
```js
proton: {
  // optional; webpack config Object for
  extendWebpack (cfg) {
    // directly change props of cfg;
    // no need to return anything
  },

  // optional; EQUIVALENT to extendWebpack() but uses webpack-chain;
  chainWebpack (chain) {
    // chain is a webpack-chain instance
    // of the Webpack configuration
  },

  // proton-builder options
  builder: {
    //...
  }
}
```
