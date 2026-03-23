---
title: Convert project to Quasar CLI with Vite
desc: (@quasar/app-vite) How to convert a Quasar CLI with Webpack project to a Quasar CLI with Vite one.
---

This page will guide you on how to convert a Quasar CLI with Webpack (`@quasar/app-webpack v4`) project into a Quasar CLI with Vite one (`@quasar/app-vite v2`).

### Step 1: Edit package.json

A Quasar CLI with Webpack project relies on `/package.json > browserslist` to specify which browsers you are targeting. That property no longer has any meaning. Projects managed by Quasar CLI with Vite work completely different and you might want to check the [Browser Compatibility](/quasar-cli-vite/browser-compatibility) page.

```diff /package.json
dependencies: {
- core-js
},

devDependencies: {
- "@quasar/app-webpack": "^4.0.0"
+ "@quasar/app-vite": "^2.0.0"

+ "postcss": "^8.5.8"
+ "postcss-rtlcss": "^5.4.0" // if using RTL support

- eslint-webpack-plugin
- ts-loader
- workbox-webpack-plugin
}

- browserslist: {}
```

Remember to yarn/npm/pnpm/bun install.

### Step 2: Various files

- Delete `/babel.config.js`. It will serve no purpose now.
- If you are using using the RTL support, then edit `/postcss.config.js`. You will need to manually install `postcss-rtlcss` and make the following edit:

  ```diff /postcss.config.js
  + import rtlcss from 'postcss-rtlcss'

  export default {
    plugins: [
  +   rtlcss()
    ]
  }
  ```

### Step 3: Copy folders from original folder

From your original project folder, copy these as they are:

- /src
- /src-cordova
- /src-capacitor
- /src-electron
- /src-pwa
- /src-ssr (with small caveat; see next steps)
- /src-bex (with small caveat; see next steps)

### Step 4: Explicitly specify extensions on all your import statements

Make sure that all your Vue component files (SFC) are imported with their `.vue` extension explicitly specified. Omitting the file extension works with Webpack (due to Quasar CLI configured list of extensions for it to try), but not with Vite too.

```js
// BAD! Will not work:
import MyComponent from './MyComponent'

// GOOD:
import MyComponent from './MyComponent.vue'
```

### Step 5: Check the new quasar.config file

The following props are detailed in the [quasar.config file](/quasar-cli-vite/quasar-config-file) page.

```diff
- eslint: {
-   // fix: true,
-   // include: [],
-   // exclude: [],
-   // cache: false,
-   // rawEsbuildEslintOptions: {},
-   // rawWebpackEslintPluginOptions: {},
-   warnings: true,
-   errors: true
- },

build: {
- esbuildTarget: {
-   browser: [ 'es2022', 'firefox115', 'chrome115', 'safari14' ],
+ target: {
+   browser: 'baseline-widely-available',
    node: 'node22'
  },

- webpackTranspile
- webpackTranspileDependencies
- webpackDevtool

- htmlFilename
- rtl
- showProgress
- gzip
- vueCompiler

- extendWebpack () {}
- chainWebpack () {}
+ extendViteConf (viteConf, { isServer, isClient }) {}

+ viteVuePluginOptions
+ vitePlugins

+ useFilenameHashes
+ polyfillModulePreload

- uglifyOptions
- scssLoaderOptions
- sassLoaderOptions
- stylusLoaderOptions
- lessLoaderOptions
- vueLoaderOptions
- tsLoaderOptions
},

devServer: {
- server: {
-  type: 'http'
- }
},

sourceFiles: {
- indexHtmlTemplate: 'index.html'
}
```

### Step 6: SSR related

```diff /src-ssr/server.js
export const renderPreloadTag = defineSsrRenderPreloadTag((file/* , { ssrContext } */) => {
  if (jsRE.test(file) === true) {
-   return `<script src="${file}" defer crossorigin></script>`;
+   return `<link rel="modulepreload" href="${file}" crossorigin>`;
  }
```

### Step 7: BEX related

```diff /src-bex/background.js
- declare module '@quasar/app-webpack' {
+ declare module '@quasar/app-vite' {
  interface BexEventMap {
    // ...
  }
}
```

```diff /src-bex/my-content-script.js
// for ALL content script files:

- declare module '@quasar/app-webpack' {
+ declare module '@quasar/app-vite' {
  interface BexEventMap {
    // ...
  }
}
```

### Step 8: Linting

If you are using ESLint, you might want to check the requirements for it [here](/quasar-cli-vite/linter).

### Step 9: And we're done

```bash
$ quasar prepare
$ quasar dev
$ quasar build
```
