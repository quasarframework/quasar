---
title: Configuring quasar.conf.js
---
Quasar makes use of some awesome development tools under it's hood, like [Webpack](https://webpack.js.org/). One of the great things about Quasar is its handling of most of the complex configuration needed by the underlying tools for you. As a result, you don't even need to know Webpack or any of the other development tools in order to use Quasar.

So what can you configure through `/quasar.conf.js`?
* Quasar components, directives and plugins that you'll be using in your website/app.
* Default Quasar I18n language pack
* Icon pack(s) that you wish to use
* Default icon set for Quasar components
* Development server port, HTTPS mode, hostname and so on
* [CSS animations](/components/transition.html) that you wish to use
* [App Plugins](/guide/app-plugins.html) list (that determines order of execution too) -- which are files in `/src/plugins` that tell how your app is initialized before mounting the root Vue component
* Global CSS/Stylus/... files to be included in the bundle
* PWA [manifest](/guide/pwa-configuring-pwa.html#Configuring-Manifest-File) and [Workbox options](/guide/pwa-configuring-pwa.html#Quasar-conf-js)
* [Electron Packager](/guide/electron-configuring-electron.html) and/or [Electron Builder](/electron-configuring-electron.html)
* IE11+ support
* Extend Webpack config Object

**You'll notice that changing any of these settings does not require you to manually reload the dev server. Quasar detects if the changes can be injected through [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) and in case it can't, it will reload the dev server automatically for you. You won't lose your development flow, because you can just sit back while Quasar CLI quickly reloads the changed code, even keeping the current state. This save tons of your time!**

> `/quasar.conf.js` is run by the Quasar CLI build system, so this code runs under Node directly, not in the context of your app. This means you can require modules like 'fs', 'path', 'webpack' and so on. Make sure the ES6 features that you want to write this file with are supported by the installed version of your Node (which should be >= 8.9.0).

## Structure
You'll notice that `/quasar.conf.js` exports a function that takes a `ctx` (context) parameter and returns an Object. This allows you to dynamically change your website/app config based on this context:

```js
module.exports = function (ctx) {
  console.log(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false,
    theme: { mat: true },
    themeName: 'mat',
    mode: { spa: true },
    modeName: 'spa',
    target: {},
    targetName: undefined,
    arch: {},
    archName: undefined,
    debug: undefined
  }

  // context gets generated based on the parameters
  // with which you run "quasar dev" or "quasar build"
}
```

What this means is that, as an example, you can load a font when building with Quasar Material theme, and pick another one for Quasar iOS theme.
```js
module.exports = function (ctx) {
  extras: [
    ctx.theme.mat
      ? 'roboto-font' // we're building with Material theme
      : null // we're not building with Material theme, so it's iOS theme
  ]
}
```

Or you can use a global CSS file for SPA mode and another one for Cordova mode while avoiding loading any such file for the other modes.
```js
module.exports = function (ctx) {
  css: [
    ctx.mode.spa ? 'app-spa.styl' : null, // looks for /src/css/app-spa.styl
    ctx.mode.cordova ? 'app-cordova.styl' : null  // looks for /src/css/app-cordova.styl
  ]
}
```

Or you can configure the dev server to run on port 8000 for SPA mode, on port 9000 for PWA mode or on port 9090 for the other modes:
```js
module.exports = function (ctx) {
  devServer: {
    port: ctx.mode.spa
      ? 8000
      : (ctx.mode.pwa ? 9000 : 9090)
  }
}
```

The possibilities are endless.

## Options to Configure
Let's take each option one by one:

| Property | Type | Description |
| --- | --- | --- |
| css | Array | Global CSS/Stylus/... files from `/src/css/`, except for theme files, which are included by default. [More info](#css-Property) |
| preFetch | Boolean | Enable [PreFetch Feature](/guide/app-prefetch-feature.html). |
| extras | Array | What to import from [quasar-extras](https://github.com/quasarframework/quasar-extras) package. Example: _['material-icons', 'roboto-font', 'ionicons']_ |
| vendor | Object | (v0.17+) Add/remove files/3rd party libraries to/from vendor chunk: { add: [...], remove: [...] }. [More info](#vendor-Property) |
| supportIE | Boolean | Add support for IE11+. |
| htmlVariables | Object | (CLI v0.17.11+) Add variables that you can use in index.template.html. [More info](#htmlVariables-Property) |
| framework | Object/String | What Quasar components/directives/plugins to import, what Quasar I18n language pack to use, what icon set to use for Quasar components. [More info](#framework-Property) |
| animations | Object/String | What [CSS animations](/components/transition.html) to import. Example: _['bounceInLeft', 'bounceOutRight']_ |
| devServer | Object | Webpack dev server [options](https://webpack.js.org/configuration/dev-server/). Some properties are overwritten based on the Quasar mode you're using in order to ensure a correct config. Note: if you're proxying the development server (i.e. using a cloud IDE), set the `public` setting to your public application URL. |
| build | Object | Build configuration options. [More info](#build-Property) |
| sourceFiles | Object | (v0.16+) Change the default name of parts of your app. [More info](#sourceFiles-Property) |
| cordova | Object | Cordova specific [config](/guide/cordova-configuring-cordova.html). |
| pwa | Object | PWA specific [config](/guide/pwa-configuring-pwa.html). |
| ssr | Object | SSR specific [config](/guide/ssr-configuring-ssr.html). |
| electron | Object | Electron specific [config](/guide/electron-configuring-electron.html). |

### css Property
Global CSS/Stylus/... files from `/src/css/`, except for theme files, which are included by default.

```js
// quasar.conf
return {
  css: [
    'app.styl', // referring to /src/css/app.styl
    '~some-library/style.css' // referring to node_modules/some-library/style.css
  ]
}
```

### vendor Property
By default, everything that comes from `node_modules` will be injected into the vendor chunk for performance & caching reasons. However, should you wish to add or remove something from this special chunk, you can do so:

```js
// quasar.conf
return {
  vendor: {
    add: ['src/plugins/my-special-plugin'],
    remove: ['axios', 'vue$']
  }
}
```

### framework Property
Tells the CLI what Quasar components/directives/plugins to import, what Quasar I18n language pack to use, what icon set to use for Quasar components and more.
```js
// quasar.conf
return {
  // a list with all options (all are optional)
  framework: {
    components: ['QBtn', 'QIcon' /* ... */],
    directives: ['TouchSwipe' /* ... */],
    plugins: ['Notify' /* ... */],

    // Quasar config
    // You'll see this mentioned for components/directives/plugins which use it
    config: { /* ... */ },

    iconSet: 'fontawesome', // requires icon library to be specified in "extras" section too,
    i18n: 'de', // Tell Quasar which language pack to use for its own components

    // v0.17+
    cssAddon: true // Adds the flex responsive++ CSS classes (noticeable bump in footprint)
  }
}
```

More on cssAddon [here](/components/flex-css.html#Flex-Addons).

### devServer Property
Webpack devServer options. Take a look at the [full list](https://webpack.js.org/configuration/dev-server/) of options. Some are overwritten by Quasar CLI based on "quasar dev" parameters and Quasar mode in order to ensure that everything is setup correctly. Note: if you're proxying the development server (i.e. using a cloud IDE), set the `public` setting to your public application URL.

Most used properties are:

| Property | Type | Description |
| --- | --- | --- |
| port | Number | Port of dev server |
| host | String | Local IP/Host to use for dev server |
| open | Boolean | Open up browser pointing to dev server address automatically. Applies to SPA, PWA and SSR modes. |
| public | String | Public address of the application (for use with reverse proxies) |

### build Property
| Property | Type | Description |
| --- | --- | --- |
| transpileDependencies | Array of Regex | (CLI v0.17.6+) Add dependencies for transpiling with Babel (from node_modules, which are by default not transpiled). Example: `[ /my-dependency/, ...]` |
| showProgress | Boolean | (CLI v0.17+) Show a progress bar while compiling. |
| extendWebpack(cfg) | Function | [Extend Webpack config](#Extending-Webpack-Config-Object) generated by Quasar CLI. Equivalent to chainWebpack(), but you have direct access to the Webpack config object. |
| chainWebpack(chain) | Function | (CLI v0.16.2+) [Extend Webpack config](#Extending-Webpack-Config-Object) generated by Quasar CLI. Equivalent to extendWebpack(), but using webpack-chain instead. |
| publicPath | String | Public path of your app. By default, it uses the root. Use it when your public path is something else, like "&lt;protocol&gt;://&lt;domain&gt;/some/nested/folder" -- in this case, it means the distributables are in "some/nested/folder" on your webserver. |
| vueRouterMode | String | Sets [Vue Router mode](https://router.vuejs.org/en/essentials/history-mode.html): 'hash' or 'history'. Pick wisely. History mode requires configuration on your deployment web server too. |
| htmlFilename | String | Default is 'index.html'. |
| productName | String | Default value is taken from package.json > productName field. |
| distDir | String | Folder where Quasar CLI should generate the distributables. Relative path to project root directory. Default is 'dist/{ctx.modeName}-{ctx.themeName}'. Applies to all Modes except for Cordova (which is forced to `src-cordova/www`). |
| devtool | String | Source map [strategy](https://webpack.js.org/configuration/devtool/) to use. |
| env | Object | Add properties to `process.env` that you can use in your website/app JS code. Each property needs to be JSON encoded. Example: { SOMETHING: JSON.stringify('someValue') }. |
| gzip | Boolean | Gzip the distributables. Useful when the web server with which you are serving the content does not have gzip. |
| scopeHoisting | Boolean | Default: `true`. Use Webpack scope hoisting for slightly better runtime performance. |
| analyze | Boolean/Object | Show analysis of build bundle with webpack-bundle-analyzer. If using as Object, it represents the webpack-bundle-analyzer config Object. |
| vueCompiler | Boolean | (v0.15.7+) Include vue runtime + compiler version, instead of default Vue runtime-only |
| uglifyOptions | Object | (v0.16+) Minification options. [Full list](https://github.com/mishoo/UglifyJS2/tree/harmony#minify-options). |
| preloadChunks | Boolean | (v0.16+) Default is "true". Preload chunks when browser is idle to improve user's later navigation to the other pages. |

The following properties of `build` are automatically configured by Quasar CLI depending on dev/build commands and Quasar mode. But if you like to override some (make sure you know what you are doing), you can do so:

| Property | Type | Description |
| --- | --- | --- |
| extractCSS | Boolean | Extract CSS from Vue files |
| sourceMap | Boolean | Use source maps |
| minify | Boolean | Minify code (html, js, css) |
| webpackManifest | Boolean | Improves caching strategy. Use a webpack manifest (runtime) file to avoid cache bust on vendor chunk changing hash on each build. |

If, for example, you run "quasar build --debug", sourceMap and extractCSS will be set to "true" regardless of what you configure.

### htmlVariables Property
*CLI v0.17.11+*

You can define and then reference variables in `src/index.template.html`, like this:
```js
// quasar.conf
module.exports = function (ctx) {
  return {
    htmlVariables: { title: 'test name' }
```
Then (just an example showing you how to reference a variable defined above, in this case `title`):
```html
<!-- src/index.template.html -->
<%= htmlWebpackPlugin.options.title %>
```

### sourceFiles Property
*Quasar v0.16+*

Use this property to change the default names of some files of your website/app if you have to. All paths must be relative to the root folder of your project.

```js
// default values:
sourceFiles: {
  rootComponent: 'src/App.vue',
  router: 'src/router',
  store: 'src/store',
  indexHtmlTemplate: 'src/index.template.html',
  registerServiceWorker: 'src-pwa/register-service-worker.js',
  serviceWorker: 'src-pwa/custom-service-worker.js',
  electronMainDev: 'src-electron/main-process/electron-main.dev.js',
  electronMainProd: 'src-electron/main-process/electron-main.js'
}
```

### Example setting env for dev/build
```js
build: {
  env: ctx.dev
    ? { // so on dev we'll have
      API: JSON.stringify('https://dev.api.com')
    }
    : { // and on build (production):
      API: JSON.stringify('https://prod.api.com')
    }
}
```
Then in your website/app you can access `process.env.API` and it's gonna point to one of those two links above, based on dev or production build type.

You can even go one step further. Supply it with values taken from the `quasar dev/build` env variables:
```
# we set an env variable in terminal
$ MY_API=api.com quasar build

# then we pick it up in /quasar.conf.js
build: {
  env: ctx.dev
    ? { // so on dev we'll have
      API: JSON.stringify('https://dev.'+ process.env.MY_API)
    }
    : { // and on build (production):
      API: JSON.stringify('https://prod.'+ process.env.MY_API)
    }
}
```

### Extending Webpack Config Object
This is achieved through `build > extendWebpack()` Function. Example adding a Webpack loader.

```js
// quasar.conf.js
build: {
  extendWebpack (cfg, { isServer, isClient }) {
    // Booleans "isServer" or "isClient" are useful when
    // building for SSR mode, telling if you are extending
    // the server or client webpack config

    // we make in-place changes
    cfg.module.rules.push({
      test: /\.json$/,
      loader: 'json-loader'
    })

    // no need to return anything
  }
}
```

If you are using Quasar CLI v0.16.2+, then you have another method to tamper with the generated Webpack config, through `build > chainWebpack(chain)`. The difference is that it is easier because you'll be using [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) to do it.

Equivalent with `chainWebpack(chain)`:
```js
// quasar.conf.js
build: {
  chainWebpack (chain, { isServer, isClient }) {
    // Booleans "isServer" or "isClient" are useful when
    // building for SSR mode, telling if you are extending
    // the server or client webpack config

    chain.module.rule('json')
      .test(/\.json$/)
      .use('json-loader')
        .loader('json-loader')

    // no need to return anything
  }
}
```

> **NOTE**
> 1. chainWebpack() gets executed BEFORE extendWebpack()
> 2. The two examples above are equivalent. Do NOT use both methods to tamper for the same thing!

#### Adding your own alias to Webpack

To add your own alias you can extend the webpack config and merge it with the existing alias.
Use the `path.resolve` helper to resolve the path to your intended alias.

```js
// quasar.conf.js
build: {
  extendWebpack (cfg, { isServer, isClient }) {
    cfg.resolve.alias = {
      ...cfg.resolve.alias, // This adds the existing alias

      // Add your own alias like this
      myalias: path.resolve(__dirname, './src/somefolder'),
    }
  }
}
```

Equivalent with chainWebpack():
```js
// quasar.conf.js
build: {
  chainWebpack (chain, { isServer, isClient }) {
    chain.resolve.alias
      .set('myalias', path.resolve(__dirname, './src/somefolder'))
  }
}
```
