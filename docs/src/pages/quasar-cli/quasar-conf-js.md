---
title: Configuring quasar.conf.js
desc: Where, how and what you can configure in a Quasar app.
---
Quasar makes use of some awesome development tools under its hood, like [Webpack](https://webpack.js.org/). One of the great things about Quasar is its handling of most of the complex configuration needed by the underlying tools for you. As a result, you don't even need to know Webpack or any of the other development tools in order to use Quasar.

So what can you configure through `/quasar.conf.js`?
* Quasar components, directives and plugins that you'll be using in your website/app
* Default [Quasar Language Pack](/options/quasar-language-packs)
* [Icon libraries](/options/installing-icon-libraries) that you wish to use
* Default [Quasar Icon Set](/options/quasar-icon-sets) for Quasar components
* Development server port, HTTPS mode, hostname and so on
* [CSS animations](/options/animations) that you wish to use
* [Boot Files](/quasar-cli/boot-files) list (that determines order of execution too) -- which are files in `/src/boot` that tell how your app is initialized before mounting the root Vue component
* Global CSS/Stylus/... files to be included in the bundle
* PWA [manifest](/quasar-cli/developing-pwa/configuring-pwa#Configuring-Manifest-File) and [Workbox options](/quasar-cli/developing-pwa/configuring-pwa#Quasar.conf.js)
* [Electron Packager](/quasar-cli/developing-electron-apps/configuring-electron#Quasar.conf.js) and/or [Electron Builder](/quasar-cli/developing-electron-apps/configuring-electron#Quasar.conf.js)
* IE11+ support
* Extend Webpack config

::: tip
You'll notice that changing any of these settings does not require you to manually reload the dev server. Quasar detects if the changes can be injected through [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) and in case it can't, it will reload the dev server automatically for you. You won't lose your development flow, because you can just sit back while Quasar CLI quickly reloads the changed code, even keeping the current state. This saves tons of your time!
:::

::: warning
`/quasar.conf.js` is run by the Quasar CLI build system, so this code runs under Node directly, not in the context of your app. This means you can require modules like 'fs', 'path', 'webpack' and so on. Make sure the ES6 features that you want to write this file with are supported by the installed version of your Node (which should be >= 10).
:::

## Structure

### The basics

You'll notice that `/quasar.conf.js` exports a function that takes a `ctx` (context) parameter and returns an Object. This allows you to dynamically change your website/app config based on this context:

```js
module.exports = function (ctx) {
  console.log(ctx)

  // Example output on console:
  {
    dev: true,
    prod: false,
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

What this means is that, as an example, you can load a font when building for a certain mode (like PWA), and pick another one for the others:

```js
module.exports = function (ctx) {
  extras: [
    ctx.mode.pwa // we're adding only if working on a PWA
      ? 'roboto-font'
      : null
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

### IDE autocompletion

Starting with v1.9, you can wrap the returned function with `configure()` helper to get a better IDE autocomplete experience (through Typescript):

```js
const { configure } = require('quasar/wrappers')

module.exports = configure(function (ctx) {
  /* configuration options */
})
```

## Options to Configure
Let's take each option one by one:

| Property | Type | Description |
| --- | --- | --- |
| css | Array | Global CSS/Stylus/... files from `/src/css/`, except for theme files, which are included by default. |
| preFetch | Boolean | Enable [PreFetch Feature](/quasar-cli/prefetch-feature). |
| extras | Array | What to import from [@quasar/extras](https://github.com/quasarframework/quasar/tree/dev/extras) package. Example: _['material-icons', 'roboto-font', 'ionicons-v4']_ |
| vendor | Object | Add/remove files/3rd party libraries to/from vendor chunk: { add: [...], remove: [...] }. |
| supportTS | Boolean/Object | Add support for TypeScript. [More info](/quasar-cli/supporting-ts) |
| htmlVariables | Object | Add variables that you can use in index.template.html. |
| framework | Object/String | What Quasar components/directives/plugins to import, what Quasar language pack to use, what Quasar icon set to use for Quasar components. |
| animations | Object/String | What [CSS animations](/options/animations) to import. Example: _['bounceInLeft', 'bounceOutRight']_ |
| devServer | Object | Webpack dev server [options](https://webpack.js.org/configuration/dev-server/). Some properties are overwritten based on the Quasar mode you're using in order to ensure a correct config. Note: if you're proxying the development server (i.e. using a cloud IDE), set the `public` setting to your public application URL. |
| build | Object | Build configuration options. |
| sourceFiles | Object | Change the default name of parts of your app. |
| cordova | Object | Cordova specific [config](/quasar-cli/developing-cordova-apps/configuring-cordova). |
| capacitor | Object | Quasar CLI Capacitor specific [config](/quasar-cli/developing-capacitor-apps/configuring-capacitor). |
| pwa | Object | PWA specific [config](/quasar-cli/developing-pwa/configuring-pwa). |
| ssr | Object | SSR specific [config](/quasar-cli/developing-ssr/configuring-ssr). |
| electron | Object | Electron specific [config](/quasar-cli/developing-electron-apps/configuring-electron). |

### Property: css
Global CSS/Stylus/... files from `/src/css/`, except for theme files, which are included by default.

```js
// quasar.conf.js
return {
  css: [
    'app.styl', // referring to /src/css/app.styl
    '~some-library/style.css' // referring to node_modules/some-library/style.css
  ]
}
```

### Property: vendor
By default, everything that comes from `node_modules` will be injected into the vendor chunk for performance & caching reasons. However, should you wish to add or remove something from this special chunk, you can do so:

```js
// quasar.conf.js
return {
  vendor: {
    /* optional; @quasar/app v1.4.2+;
       disables vendor chunk: */ disable: true,

    add: [ 'src/plugins/my-special-plugin' ],
    remove: ['axios', 'vue$']
  }
}
```

### Property: framework <q-badge align="top" label="@quasar/app v2 specs" />
Tells the CLI what Quasar components/directives/plugins to import, what Quasar I18n language pack to use, what icon set to use for Quasar components and more.

Filling "components" and "directives" is required only if "all" is set to `false`.

```js
// quasar.conf.js
return {
  // a list with all options (all are optional)
  framework: {
    // Possible values for "importStrategy":
    // * 'auto' - Auto-import needed Quasar components & directives
    // * 'all'  - Import everything from Quasar
    //            (not treeshaking Quasar; biggest bundle size)
    importStrategy: 'auto',

    // is using "auto" import strategy, you can also configure:
    autoImportComponentCase: 'pascal', // or 'kebab' (default) or 'combined'

    // For special cases outside of where auto-import "auto" can have an impact
    // (like functional components as one of the examples),
    // you can manually specify Quasar components/directives to be available everywhere:
    //
    // components: [],
    // directives: [],

    // Quasar plugins
    plugins: ['Notify' /* ... */],

    // Quasar config
    // You'll see this mentioned for components/directives/plugins which use it
    config: { /* ... */ },

    iconSet: 'fontawesome', // requires icon library to be specified in "extras" section too,
    lang: 'de', // Tell Quasar which language pack to use for its own components

    cssAddon: true // Adds the flex responsive++ CSS classes (noticeable bump in footprint)
  }
}
```

More on cssAddon [here](/layout/grid/introduction-to-flexbox#Flex-Addons).

### Property: devServer
**Webpack devServer options**. Take a look at the [full list](https://webpack.js.org/configuration/dev-server/) of options. Some are overwritten by Quasar CLI based on "quasar dev" parameters and Quasar mode in order to ensure that everything is setup correctly. Note: if you're proxying the development server (i.e. using a cloud IDE), set the `public` setting to your public application URL.

Most used properties are:

| Property | Type | Description |
| --- | --- | --- |
| port | Number | Port of dev server |
| host | String | Local IP/Host to use for dev server |
| open | Boolean/String | Unless it's set to `false`, Quasar will open up a browser pointing to dev server address automatically. Applies to SPA, PWA and SSR modes. If specifying a String then see explanations below. |
| public | String | Public address of the application (for use with reverse proxies) |

Using `open` prop to open with a specific browser and not with the default browser of your OS (check [supported values](https://github.com/sindresorhus/open/blob/master/test.js) based on the host OS):

```
// quasar.conf.js

devServer: {
  open: 'firefox'
}
```

When you set `devServer > https: true` in your quasar.conf.js file, Quasar will auto-generate a SSL certificate for you. However, if you want to create one yourself for your localhost, then check out this blog post by [Filippo](https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/). Then your `quasar.conf.js > devServer > https` should look like this:

```js
// quasar.conf.js

const fs = require('fs')
// ...

devServer: {
  https: {
    key: fs.readFileSync('/path/to/server.key'),
    cert: fs.readFileSync('/path/to/server.crt'),
    ca: fs.readFileSync('/path/to/ca.pem'),
  }
}
```

Starting with **@quasar/app v1.3.2**, you can also configure automatically opening remote Vue Devtools:

```js
// quasar.conf.js

devServer: {
  vueDevtools: true
}
```

### Property: build <q-badge align="top" label="@quasar/app v2 specs" />
| Property | Type | Description |
| --- | --- | --- |
| transpile | Boolean | Enables or disables Babel transpiling. |
| transpileDependencies | Array of Regex | Does not applies if "transpile" is set to "false". Add dependencies for transpiling with Babel (from node_modules, which are by default not transpiled). Example: `[ /my-dependency/, ...]` |
| showProgress | Boolean | Show a progress bar while compiling. |
| transformAssetUrls | Object | (**@quasar/app 1.3.4+**) Add support for also referencing assets for custom tags props. Example: `{ 'my-img-comp': 'src', 'my-avatar': [ 'src', 'placeholder-src' ]}` |
| extendWebpack(cfg) | Function | Extend Webpack config generated by Quasar CLI. Equivalent to chainWebpack(), but you have direct access to the Webpack config object. |
| chainWebpack(chain) | Function | Extend Webpack config generated by Quasar CLI. Equivalent to extendWebpack(), but using [webpack-chain](https://github.com/neutrinojs/webpack-chain) instead. |
| beforeDev({ quasarConf }) | Function | Prepare external services before `$ quasar dev` command runs, like starting some backend or any other service that the app relies on. Can use async/await or directly return a Promise. |
| afterDev({ quasarConf }) | Function | Run hook after Quasar dev server is started (`$ quasar dev`). At this point, the dev server has been started and is available should you wish to do something with it. Can use async/await or directly return a Promise. |
| beforeBuild({ quasarConf }) | Function | Run hook before Quasar builds app for production (`$ quasar build`). At this point, the distributables folder hasn’t been created yet. Can use async/await or directly return a Promise. |
| afterBuild({ quasarConf }) | Function | Run hook after Quasar built app for production (`$ quasar build`). At this point, the distributables folder has been created and is available should you wish to do something with it. Can use async/await or directly return a Promise. |
| onPublish(opts) | Function | Run hook if publishing was requested (`$ quasar build -P`), after Quasar built app for production and the afterBuild hook (if specified) was executed. Can use async/await or directly return a Promise. `opts` is Object of form `{arg, distDir}`, where "arg" is the argument supplied (if any) to -P parameter. |
| publicPath | String | Public path of your app. By default, it uses the root. Use it when your public path is something else, like "&lt;protocol&gt;://&lt;domain&gt;/some/nested/folder" -- in this case, it means the distributables are in "some/nested/folder" on your webserver. |
| appBase | String | (**@quasar/app 1.4.2+**) Force app base tag with your custom value; configure only if you **really** know what you are doing, otherwise you can easily break your app. Highly recommended is to leave this computed by quasar/app. |
| vueRouterBase | String | (**@quasar/app 1.4.2+**) Force vue router base with your custom value; configure only if you **really** know what you are doing, otherwise you can easily break your app. Highly recommended is to leave this computed by quasar/app. |
| vueRouterMode | String | Sets [Vue Router mode](https://router.vuejs.org/en/essentials/history-mode.html): 'hash' or 'history'. Pick wisely. History mode requires configuration on your deployment web server too. |
| htmlFilename | String | Default is 'index.html'. |
| ssrPwaHtmlFilename | String | (**@quasar/app 1.8+**) Used for SSR+PWA mode. Default is 'offline.html'. |
| productName | String | Default value is taken from package.json > productName field. |
| distDir | String | Folder where Quasar CLI should generate the distributables. Relative path to project root directory. Default is 'dist/{ctx.modeName}'. Applies to all Modes except for Cordova (which is forced to `src-cordova/www`). |
| ignorePublicFolder | Boolean | (**@quasar/app 2.0.7+**) Ignores the /public folder. If you depend on a statics folder then you will need to configure it yourself (outside of Quasar or through the extendWebpack/chainWebpack), so make sure that you know what you are doing. |
| devtool | String | Source map [strategy](https://webpack.js.org/configuration/devtool/) to use. |
| env | Object | Add properties to `process.env` that you can use in your website/app JS code. |
| gzip | Boolean/Object | Gzip the distributables. Useful when the web server with which you are serving the content does not have gzip. If using as Object, it represents the compression-webpack-plugin config Object. |
| scopeHoisting | Boolean | Default: `true`. Use Webpack scope hoisting for slightly better runtime performance. |
| analyze | Boolean/Object | Show analysis of build bundle with webpack-bundle-analyzer. If using as Object, it represents the webpack-bundle-analyzer config Object. |
| vueCompiler | Boolean | Include vue runtime + compiler version, instead of default Vue runtime-only |
| uglifyOptions | Object | Minification options. [Full list](https://github.com/webpack-contrib/terser-webpack-plugin/#minify). |
| scssLoaderOptions | Object | Options to supply to `sass-loader` for `.scss` files. Example: scssLoaderOptions: { prependData: '@import "src/css/abstracts/_mixins.scss";'} |
| sassLoaderOptions | Object | Options to supply to `sass-loader` for `.sass` files. |
| stylusLoaderOptions | Object | Options to supply to `stylus-loader`. |
| lessLoaderOptions | Object | Options to supply to `less-loader`. |

The following properties of `build` are automatically configured by Quasar CLI depending on dev/build commands and Quasar mode. But if you like to override some (make sure you know what you are doing), you can do so:

| Property | Type | Description |
| --- | --- | --- |
| extractCSS | Boolean | Extract CSS from Vue files |
| sourceMap | Boolean | Use source maps |
| minify | Boolean | Minify code (html, js, css) |

If, for example, you run "quasar build --debug", sourceMap and extractCSS will be set to "true" regardless of what you configure.

### Property: htmlVariables <q-badge align="top" label="@quasar/app v2 specs" />

You can define and then reference variables in `src/index.template.html`, like this:
```js
// quasar.conf.js
module.exports = function (ctx) {
  return {
    htmlVariables: {
      title: 'test name',
      some: {
        prop: 'my-prop'
      }
    }
```
Then (just an example showing you how to reference a variable defined above, in this case `title`):
```html
<!-- src/index.template.html -->
<%= title %>
<%= some.prop %>
```

### Property: sourceFiles
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

### Example setting env for dev/build <q-badge align="top" label="@quasar/app v2 specs" />
```js
build: {
  env: {
    API: ctx.dev
      ? 'https://dev.api.com'
      : 'https://prod.api.com'
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
  env: {
    API: ctx.dev
      ? 'https://dev.' + process.env.MY_API
      : 'https://prod.' + process.env.MY_API
  }
}
```

> Alternatively you can use our [@quasar/dotenv](https://github.com/quasarframework/app-extension-dotenv) or [@quasar/qenv](https://github.com/quasarframework/app-extension-qenv) App Extensions.

::: tip
Also check out [Handling process.env](/quasar-cli/handling-process-env) page.
:::

### Handling Webpack configuration
In depth analysis on [Handling Webpack](/quasar-cli/handling-webpack) documentation page.
