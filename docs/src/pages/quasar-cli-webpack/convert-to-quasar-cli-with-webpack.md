---
title: Convert project to Quasar CLI with Webpack
desc: (@quasar/app-webpack) How to convert a Quasar CLI with Vite project to a Quasar CLI with Webpack one.
---

This page will guide you on how to convert a Quasar CLI with Vite (`@quasar/app-vite v2`) project into a Quasar CLI with Webpack one (`@quasar/app-webpack v4`).

### Step 1: Edit package.json

```diff /package.json
dependencies: {
+ "core-js": "^3.6.5",
},

devDependencies: {
- "@quasar/app-vite": "^2.0.0"
+ "@quasar/app-webpack": "^4.0.0"

+ "eslint-webpack-plugin": "^4.0.1",
+ "ts-loader": "^9.4.2", // if using TS

- "postcss"
- "postcss-rtlcss"

// if you have PWA mode:
+ "workbox-webpack-plugin": "^7.0.0"
- "workbox-build": "^7.0.0",
- "workbox-cacheable-response": "^7.0.0",
- "workbox-core": "^7.0.0",
- "workbox-expiration": "^7.0.0",
- "workbox-precaching": "^7.0.0",
- "workbox-routing": "^7.0.0",
- "workbox-strategies": "^7.0.0"
}

+ "browserslist": [
+   "last 10 Chrome versions",
+   "last 10 Firefox versions",
+   "last 4 Edge versions",
+   "last 7 Safari versions",
+   "last 8 Android versions",
+   "last 8 ChromeAndroid versions",
+   "last 8 FirefoxAndroid versions",
+   "last 10 iOS versions",
+   "last 5 Opera versions"
+ ],
```

Remember to yarn/npm/pnpm/bun install.

A Quasar CLI with Webpack project relies on `/package.json > browserslist` to specify which browsers you are targeting. More info: [Browser Compatibility](/quasar-cli-webpack/browser-compatibility) page.

### Step 2: Various files

- Create `/babel.config.js`:

  ```js
  export default api => {
    return {
      presets: [
        [
          '@quasar/babel-preset-app',
          api.caller(caller => caller && caller.target === 'node')
            ? { targets: { node: 'current' } }
            : {}
        ]
      ]
    }
  }
  ```

  <br>

- If you are using the RTL support, then edit `/postcss.config.js`. You will need to remove the `postcss-rtlcss` import and usage. This is handled automatically by Quasar CLI now:

  ```diff /postcss.config.js
  - import rtlcss from 'postcss-rtlcss'

  export default {
    plugins: [
  -   rtlcss()
    ]
  }
  ```

  <br>

  Also, uninstall the `postcss-rtlcss` package.

### Step 3: Copy folders from original folder

From your original project folder, copy these as they are:

- /src
- /src-cordova
- /src-capacitor
- /src-electron
- /src-pwa
- /src-ssr (with small caveat; see next steps)
- /src-bex (with small caveat; see next steps)

### Step 4: Check the new quasar.config file

The following props are detailed in the [quasar.config file](/quasar-cli-vite/quasar-config-file) page.

```diff
+ eslint: {
+   // fix: true,
+   // include: [],
+   // exclude: [],
+   // cache: false,
+   // rawEsbuildEslintOptions: {},
+   // rawWebpackEslintPluginOptions: {},
+   warnings: true,
+   errors: true
+ },

build: {
- target: {
-   browser: 'baseline-widely-available',
+ esbuildTarget: {
+   browser: [ 'es2022', 'firefox115', 'chrome115', 'safari14' ],
    node: 'node20'
  },

+ webpackTranspile
+ webpackTranspileDependencies
+ webpackDevtool

+ htmlFilename
+ rtl
+ showProgress
+ gzip
+ vueCompiler

- extendViteConf (viteConf, { isServer, isClient }) {}
+ extendWebpack () {}
+ chainWebpack () {}

- viteVuePluginOptions
- vitePlugins

- useFilenameHashes
- polyfillModulePreload

+ uglifyOptions
+ scssLoaderOptions
+ sassLoaderOptions
+ stylusLoaderOptions
+ lessLoaderOptions
+ vueLoaderOptions
+ tsLoaderOptions
},

devServer: {
+ server: {
+  type: 'http'
+ }
},

sourceFiles: {
+ indexHtmlTemplate: 'index.html'
}
```

### Step 5: SSR related

```diff /src-ssr/server.js
export const renderPreloadTag = defineSsrRenderPreloadTag((file/* , { ssrContext } */) => {
  if (jsRE.test(file) === true) {
-   return `<link rel="modulepreload" href="${file}" crossorigin>`;
+   return `<script src="${file}" defer crossorigin></script>`;
  }
```

### Step 6: BEX related

```diff /src-bex/background.js
- declare module '@quasar/app-vite' {
+ declare module '@quasar/app-webpack' {
  interface BexEventMap {
    // ...
  }
}
```

```diff /src-bex/my-content-script.js
// for ALL content script files:

- declare module '@quasar/app-vite' {
+ declare module '@quasar/app-webpack' {
  interface BexEventMap {
    // ...
  }
}
```

### Step 7: Linting

If you are using ESLint, you might want to check the requirements for it [here](/quasar-cli-webpack/linter).

### Step 8: And we're done

```bash
$ quasar prepare
$ quasar dev
$ quasar build
```
