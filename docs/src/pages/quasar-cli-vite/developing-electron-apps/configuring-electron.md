---
title: Configuring Electron
desc: (@quasar/app-vite) How to manage your Electron apps with Quasar CLI.
related:
  - /quasar-cli-vite/quasar-config-js
---
We'll be using Quasar CLI to develop and build an Electron App. The difference between building a SPA, PWA, Mobile App or an Electron App is simply determined by the "mode" parameter in "quasar dev" and "quasar build" commands.

But first, let's learn how we can configure the Electron build.

## quasar.config.js
You may notice that `/quasar.config.js` contains a property called `electron`.

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
  // https://electron.github.io/electron-packager/main/
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

  inspectPort: 5858,

  extendElectronMainConf (cfg) {
    // do something with Esbuild config
    // for the Electron Main thread
  },

  extendElectronPreloadConf (cfg) {
    // do something with Esbuild config
    // for the Electron Preload thread
  }
}
```

The "packager" prop refers to [electron-packager options](https://electron.github.io/electron-packager/main/). The `dir` and `out` properties are overwritten by Quasar CLI to ensure the best results.

The "builder" prop refers to [electron-builder options](https://www.electron.build/configuration/configuration).

Should you want to tamper with the "Renderer" thread (UI in /src) Vite config:

```js
// quasar.config.js
module.exports = function (ctx) {
  return {
    build: {
      extendViteConf (viteConf) {
        if (ctx.mode.electron) {
          // do something with ViteConf
        }
      }
    }
  }
}
```

## Packager vs. Builder
You have to choose to use either packager or builder. They are both excellent open-source projects, however they serve slightly different needs. With packager you will be able to build unsigned projects for all major platforms from one machine (with restrictions). Although this is great, if you just want something quick and dirty, there is more platform granularity (and general polish) in builder. Cross-compiling your binaries from one computer doesn't really work with builder (or we haven't found the recipe yet...)
