---
title: Browser compatibility
desc: (@quasar/app-vite) How to handle the browser support with Quasar CLI.
related:
  - /quasar-cli-vite/quasar-config-js
---

In order to configure the browser compatibility for your app, you will need to edit `/quasar.config.js`:

```js
// quasar.config.js
build: {
  target: {
    browser: [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1' ],
    node: 'node16'
  }
}
```

Based on the Quasar Mode that you will be using (SPA/SSR/PWA/Electron/... etc) you will have client-side files (that run in the browser) and possibly Node.js running files. This is what the two keys of `target` Object above are for.

Also, independent of this configuration, you need to decide if you want the [module preload polyfill](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill) since all the script tags will be injected as modules. By default, the polyfill is NOT included:

```js
// quasar.config.js
build: {
  polyfillModulePreload: false
}
```

Furthermore, based on your `/postcss.config.cjs` file content, your CSS will also pass through `autoprefixer` for which you can configure the browser levels that you are interested in:

```js
// postcss.config.cjs

require('autoprefixer')({
  overrideBrowserslist: [
    'last 4 Chrome versions',
    'last 4 Firefox versions',
    'last 4 Edge versions',
    'last 4 Safari versions',
    'last 4 Android versions',
    'last 4 ChromeAndroid versions',
    'last 4 FirefoxAndroid versions',
    'last 4 iOS versions'
  ]
})
```

More info on how to specify `autoprefixer` browser ranges: [browserslist](https://github.com/browserslist/browserslist).
