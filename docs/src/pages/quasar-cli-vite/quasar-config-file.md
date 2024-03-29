---
title: Configuring quasar.config file
desc: (@quasar/app-vite) Where, how and what you can configure in a Quasar CLI with Vite app.
---

Notice that your scaffolded project folder contains a `/quasar.config` file. So what can you configure through it? Basically anything that Quasar CLI does for you.

* Quasar components, directives and plugins that you'll be using in your website/app
* Default [Quasar Language Pack](/options/quasar-language-packs)
* [Icon libraries](/options/installing-icon-libraries) that you wish to use
* Default [Quasar Icon Set](/options/quasar-icon-sets) for Quasar components
* Development server port, HTTPS mode, hostname and so on
* [CSS animations](/options/animations) that you wish to use
* [Boot Files](/quasar-cli-vite/boot-files) list (that determines order of execution too) -- which are files in `/src/boot` that tell how your app is initialized before mounting the root Vue component
* Global CSS/Sass/... files to be included in the bundle
* SPA, PWA, Electron, Capacitor, Cordova, SSR, BEX (browser extensions) configuration
* Extend the under the hood tools, like the generated Vite config
* ...and many many more that you'll discover along the way

::: tip
You'll notice that changing any of these settings does not require you to manually reload the dev server. Quasar detects and reloads the necessary processes. You won't lose your development flow, because you can just sit back while Quasar CLI quickly reloads the changed code, even keeping the current state. This saves tons of your time!
:::

::: warning
The `/quasar.config` file is run by the Quasar CLI build system, so this code runs under Node directly, not in the context of your app. This means you can require modules like 'fs', 'path', Vite plugins, and so on. Make sure the ES features that you want to use in this file are [supported by your Node version](https://node.green/) (which should be >= 14.19.0).
:::

## Structure

### The basics

You'll notice that the `/quasar.config` file exports a function that takes a `ctx` (context) parameter and returns an Object. This allows you to dynamically change your website/app config based on this context:

```js /quasar.config file
module.exports = function (ctx) { // can be async too
  console.log(ctx)

  // Example output on console:
  /*
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
  */

  // context gets generated based on the parameters
  // with which you run "quasar dev" or "quasar build"

  return {
    // ... your config
  }
}
```

What this means is that, as an example, you can load a font when building for a certain mode (like PWA), and pick another one for the others:

```js /quasar.config file
{
  extras: [
    ctx.mode.pwa // we're adding only if working on a PWA
      ? 'roboto-font'
      : null
  ]
}
```

Or you can use a global CSS file for SPA mode and another one for Cordova mode while avoiding loading any such file for the other modes.

```js /quasar.config file
{
  css: [
    ctx.mode.spa ? 'app-spa.sass' : null, // looks for /src/css/app-spa.sass
    ctx.mode.cordova ? 'app-cordova.sass' : null  // looks for /src/css/app-cordova.sass
  ]
}
```

Or you can configure the dev server to run on port 8000 for SPA mode, on port 9000 for PWA mode or on port 9090 for the other modes:

```js /quasar.config file
{
  devServer: {
    port: ctx.mode.spa
      ? 8000
      : (ctx.mode.pwa ? 9000 : 9090)
  }
}
```

You can also do async work before returning the quasar configuration:

```js /quasar.config file
module.exports = async function (ctx) {
  const data = await someAsyncFunction()
  return {
    // ... use "data"
  }
}

// or:
module.exports = function (ctx) {
  return new Promise(resolve => {
    // some async work then:
    // resolve() with the quasar config
    resolve({
      //
    })
  })
}
```

The possibilities are endless.

### IDE autocompletion

You can wrap the returned function with `configure()` helper to get a better IDE autocomplete experience (through TypeScript):

```js /quasar.config file
const { configure } = require('quasar/wrappers')

module.exports = configure(function (ctx) {
  /* configuration options */
})
```

## Options to Configure

### css

```js
/**
 * Global CSS/Stylus/SCSS/SASS/... files from `/src/css/`,
 * except for theme files, which are included by default.
 */
css?: string[];
```

Example:

```js /quasar.config file
{
  css: [
    'app.sass', // referring to /src/css/app.sass
    '~some-library/style.css' // referring to node_modules/some-library/style.css
  ]
}
```

### boot

More on [Boot Files](/quasar-cli-vite/boot-files).

```js
/** Boot files to load. Order is important. */
boot?: QuasarBootConfiguration;

interface BootConfigurationItem {
  path: string;
  server?: false;
  client?: false;
}

type QuasarBootConfiguration = (string | BootConfigurationItem)[];
```

### preFetch

More on the [PreFetch Feature](/quasar-cli-vite/prefetch-feature) page.

```js
/** Enable the preFetch feature. */
preFetch?: boolean;
```

### eslint <q-badge label="deprecated" />

::: warning
This property has been deprecated in favour of using vite-plugin-checker.
:::

More on the [Linter](/quasar-cli-vite/linter) page.

### extras

```js
/**
 * What to import from [@quasar/extras](https://github.com/quasarframework/quasar/tree/dev/extras) package.
 * @example ['material-icons', 'roboto-font', 'ionicons-v4']
 */
extras?: (QuasarIconSets | QuasarFonts)[];
```

### framework

```js
/**
 * What Quasar language pack to use, what Quasar icon
 * set to use for Quasar components, etc.
 */
framework?: QuasarFrameworkConfiguration;

interface QuasarFrameworkConfiguration {
  /**
   * @see - QuasarConfOptions tab in API cards throughout the docs
   */
  config?: SerializableConfiguration<QuasarUIConfiguration>;
  /**
   * One of the Quasar IconSets
   *
   * @see https://v2.quasar.dev/options/quasar-icon-sets
   *
   * @example 'material-icons'
   */
  iconSet?: QuasarIconSets;
  /**
   * One of the Quasar language packs
   *
   * @see https://v2.quasar.dev/options/quasar-language-packs
   *
   * @example 'en-US'
   * @example 'es'
   */
  lang?: QuasarLanguageCodes;
  /**
   * Quasar CSS addons have breakpoint aware versions of flex and spacing classes
   *
   * @see https://quasar.dev/layout/grid/introduction-to-flexbox#flex-addons
   * @see https://quasar.dev/style/spacing#flex-addons
   */
  cssAddon?: boolean;

  /**
   * Auto import - how to detect components in your vue files
   *   "kebab": q-carousel q-page
   *   "pascal": QCarousel QPage
   *   "combined": q-carousel QPage
   *
   * @default 'kebab'
   */
  autoImportComponentCase?: "kebab" | "pascal" | "combined";
  /**
   * Auto import - which file extensions should be interpreted as referring to Vue SFC?
   *
   * @default ['vue']
   */
  autoImportVueExtensions?: string[];
  /**
   * Auto import - which file extensions should be interpreted as referring to script files?
   *
   * @default ['js', 'jsx', 'ts', 'tsx']
   */
  autoImportScriptExtensions?: string[];
  /**
   * Treeshake Quasar's UI on dev too?
   * Recommended to leave this as false for performance reasons.
   *
   * @default false
   */
  devTreeshaking?: boolean;

  /**
   * Quasar will auto import components based on your usage.
   * But, in case you have a special case, you can manually specify Quasar components to be available everywhere.
   *
   * An example case would be having custom component definitions with plain string templates, inside .js or .ts files,
   * in which you are using Quasar components (e.g. q-avatar).
   *
   * Another example would be that dynamically rendering components depending on an API response or similar (e.g. in a CMS),
   * something like `<component :is="dynamicName">` where `dynamicName` is a string that matches a Quasar component name.
   *
   * @example ['QAvatar', 'QChip']
   */
  components?: (keyof QuasarComponents)[];
  /**
   * Quasar will auto import directives based on your usage.
   * But, in case you have a special case, you can manually specify Quasar directives to be available everywhere.
   *
   * An example case would be having custom component definitions with plain string templates, inside .js or .ts files,
   * in which you are using Quasar directives (e.g. v-intersection).
   *
   * @example ['Intersection', 'Mutation']
   */
  directives?: (keyof QuasarDirectives)[];
  /**
   * Quasar plugins to be installed. Specify the ones you are using in your app.
   *
   * @example ['Notify', 'Loading', 'Meta', 'AppFullscreen']
   */
  plugins?: (keyof QuasarPlugins)[];
}
```

See these references for more info:
- [Quasar Language Packs](/options/quasar-language-packs)
- [Quasar Icon Sets](/options/quasar-icon-sets)
- [Quasar CSS Addons - Flex](/layout/grid/introduction-to-flexbox#flex-addons)
- [Quasar CSS Addons - Spacing](/style/spacing#flex-addons)

### animations

More on [CSS animations](/options/animations).

```js
/**
 * What Quasar CSS animations](/options/animations) to import.
 * @example [ 'bounceInLeft', 'bounceOutRight' ]
 * */
animations?: QuasarAnimationsConfiguration | 'all';
```

### devServer

More info: [Vite server options](https://vitejs.dev/config/#server-options)

```js
import { ServerOptions as ViteServerOptions } from "vite";
import { Options as OpenOptions } from "open";
type DevServerOptions = Omit<ViteServerOptions, "open"> & {
  open?: Omit<OpenOptions, "wait"> | boolean;
};

/**
 * Vite "server" options.
 * Some properties are overwritten based on the Quasar mode you're using in order
 * to ensure a correct config.
 * Note: if you're proxying the development server (i.e. using a cloud IDE),
 * set the `public` setting to your public application URL.
 */
devServer?: DevServerOptions;
```

Apart from these options, Quasar CLI tampers with some and you will experience them differently than on a Vite app:

Using `open` prop to open with a specific browser and not with the default browser of your OS (check [supported values](https://github.com/sindresorhus/open#options)). The `options` param described in previous link is what you should configure quasar.config file > devSever > open with. Some examples:

```js /quasar.config file
// opens Google Chrome
devServer: {
  open: {
    app: { name: 'google chrome' }
  }
}

// opens Firefox
devServer: {
  open: {
    app: { name: 'firefox' }
  }
}

// opens Google Chrome and automatically deals with cross-platform issues:
const open = require('open')

devServer: {
  open: {
    app: { name: open.apps.chrome }
  }
}
```

You can also configure automatically opening remote Vue Devtools:

```js /quasar.config file
devServer: {
  vueDevtools: true
}
```

### build

```js
/** Build configuration options. */
build?: QuasarBuildConfiguration;

import { Plugin, UserConfig as ViteUserConfig } from "vite";
import { Options as VuePluginOptions } from "@vitejs/plugin-vue"

interface InvokeParams {
  isClient: boolean;
  isServer: boolean;
}

interface BuildTargetOptions {
  /**
   * @default ['es2022', 'firefox115', 'chrome115', 'safari14']
   */
  browser?: string[];
  /**
   * @example 'node20'
   */
  node: string;
}

interface PluginEntryRunOptions {
  server?: boolean;
  client?: boolean;
}

/* requires @quasar/app-vite 1.8+ */
type PluginEntry =
  | [pluginName: string, options?: any, runOptions?: PluginEntryRunOptions]
  | [pluginFactory: (options?: any) => Plugin, options?: any, runOptions?: PluginEntryRunOptions]
  | Plugin
  | null
  | undefined
  | false;

interface QuasarStaticBuildConfiguration {
  /**
   * @example
   * {
   *   browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
   *   node: 'node20'
   * }
   */
  target?: BuildTargetOptions;

  /**
   * Extend Vite config generated by Quasar CLI.
   */
  extendViteConf?: (
    config: ViteUserConfig,
    invokeParams: InvokeParams
  ) => void;

  /**
   * Options to supply to @vitejs/plugin-vue
   *
   * @see https://v2.quasar.dev/quasar-cli-vite/handling-vite#vite-vue-plugin-options
   */
  viteVuePluginOptions?: VuePluginOptions;

  /**
   * Vite plugins
   *
   * @see https://v2.quasar.dev/quasar-cli-vite/handling-vite#adding-vite-plugins
   *
   * @example
   * [
   *   [ 'package-name', { ..options.. } ],
   *   [ require('some-plugin'), { ...options... } ]
   * ]
   */
  vitePlugins?: PluginEntry[];

  /**
   * @see https://v2.quasar.dev/quasar-cli-vite/handling-vite#folder-aliases
   *
   * @example
   * {
   *   // import { ... } from 'locales/...'
   *   locales: path.join(__dirname, 'src/locales')
   * }
   */
  alias?: { [key: string]: string };

  /**
   * Public path of your app.
   * Use it when your public path is something else,
   * like _“<protocol>://<domain>/some/nested/folder”_ – in this case,
   * it means the distributables are in _“some/nested/folder”_ on your webserver.
   *
   * @default '/'
   */
  publicPath?: string;

  /**
   * Sets [Vue Router mode](https://router.vuejs.org/guide/essentials/history-mode.html).
   * History mode requires configuration on your deployment web server too.
   *
   * @default 'hash'
   */
  vueRouterMode?: "hash" | "history";

  /**
   * Sets Vue Router base.
   * Should not need to configure this, unless absolutely needed.
   */
  vueRouterBase?: string;
  /**
   * Automatically open remote Vue Devtools when running in development mode.
   */
  vueDevtools?: boolean;
  /**
   * Should the Vue Options API be available? If all your components only use Composition API
   * it would make sense performance-wise to disable Vue Options API for a compile speedup.
   *
   * @default true
   */
  vueOptionsAPI?: boolean;

  /**
   * Should we invalidate the Vite and ESLint cache on startup?
   * @default false
   */
  rebuildCache?: boolean;

  /**
   * Do you want to analyze the production bundles?
   * Generates and opens an HTML report.
   *
   * @default false
   */
  analyze?: boolean;

  /**
   * Folder where Quasar CLI should generate the distributables.
   * Relative path to project root directory.
   *
   * @default 'dist/{ctx.modeName}' For all modes except Cordova.
   * @default 'src-cordova/www' For Cordova mode.
   */
  distDir?: string;

  /**
   * Add properties to `process.env` that you can use in your website/app JS code.
   *
   * @see https://v2.quasar.dev/quasar-cli-vite/handling-process-env
   *
   * @example { SOMETHING: 'someValue' }
   */
  env?: { [index: string]: string };

  /**
   * Defines constants that get replaced in your app.
   *
   * @example { SOMETHING: JSON.stringify('someValue') } -> console.log(SOMETHING) // console.log('someValue')
   */
  rawDefine?: { [index: string]: string };

  /**
   * (requires @quasar/app-vite v1.1+)
   *
   * Build production assets with or without the hash part in filenames.
   * Example: "454d87bd" in "assets/index.454d87bd.js"
   *
   * When used, please be careful how you configure your web server cache strategy as
   * files will not change name so your client might get 304 (Not Modified) even when
   * it's not the case.
   *
   * Will not change anything if your Vite config already touches the
   * build.rollupOptions.output.entryFileNames/chunkFileNames/assetFileNames props.
   *
   * Gets applied to production builds only.
   *
   * Useful especially for (but not restricted to) PWA. If set to false then updating the
   * PWA will force to re-download all assets again, regardless if they were changed or
   * not (due to how Rollup works through Vite).
   *
   * @default true
   */
  useFilenameHashes?: boolean;

  /**
   * whether to inject module preload polyfill.
   * @default false
   */
  polyfillModulePreload?: boolean;

  /**
   * Ignores the public folder.
   * @default false
   */
  ignorePublicFolder?: boolean;

  /**
   * Set to `false` to disable minification, or specify the minifier to use.
   * Available options are 'terser' or 'esbuild'.
   * If set to anything but boolean false then it also applies to CSS.
   * For production only.
   * @default 'esbuild'
   */
  minify?: boolean | 'terser' | 'esbuild';

  /**
   * (requires @quasar/app-vite v1.5.2+)
   *
   * Minification options for html-minifier.
   *
   * @see https://github.com/kangax/html-minifier#options-quick-reference for complete list of options
   *
   * @default
   *  {
   *    removeComments: true,
   *    collapseWhitespace: true,
   *    removeAttributeQuotes: true,
   *    collapseBooleanAttributes: true,
   *    removeScriptTypeAttributes: true
   *  }
   */
  htmlMinifyOptions?: HtmlMinifierOptions;

  /**
   * If `true`, a separate sourcemap file will be created. If 'inline', the
   * sourcemap will be appended to the resulting output file as data URI.
   * 'hidden' works like `true` except that the corresponding sourcemap
   * comments in the bundled files are suppressed.
   * @default false
   */
  sourcemap?: boolean | 'inline' | 'hidden';

  /**
   * Prepare external services before `$ quasar dev` command runs
   * like starting some backend or any other service that the app relies on.
   * Can use async/await or directly return a Promise.
   */
  beforeDev?: (params: QuasarHookParams) => void;

  /**
   * Run hook after Quasar dev server is started (`$ quasar dev`).
   * At this point, the dev server has been started and is available should you wish to do something with it.
   * Can use async/await or directly return a Promise.
   */
  afterDev?: (params: QuasarHookParams) => void;

  /**
   * Run hook before Quasar builds app for production (`$ quasar build`).
   * At this point, the distributables folder hasn’t been created yet.
   * Can use async/await or directly return a Promise.
   */
  beforeBuild?: (params: QuasarHookParams) => void;

  /**
   * Run hook after Quasar built app for production (`$ quasar build`).
   * At this point, the distributables folder has been created and is available
   *  should you wish to do something with it.
   * Can use async/await or directly return a Promise.
   */
  afterBuild?: (params: QuasarHookParams) => void;

  /**
   * Run hook if publishing was requested (`$ quasar build -P`),
   *  after Quasar built app for production and the afterBuild hook (if specified) was executed.
   * Can use async/await or directly return a Promise.
   * `opts` is Object of form `{arg, distDir}`,
   * where “arg” is the argument supplied (if any) to -P parameter.
   */
  onPublish?: (ops: { arg: string; distDir: string }) => void;
}
```

See these references for more info:
- [Vite server options](https://vitejs.dev/config/#server-options)
- [Vite Vue Plugin options](/quasar-cli-vite/handling-vite#vite-vue-plugin-options)
- [Adding Vite plugins](/quasar-cli-vite/handling-vite#adding-vite-plugins)
- [Folder Aliases](/quasar-cli-vite/handling-vite#folder-aliases)
- [Handling Process Env](/quasar-cli-vite/handling-process-env)
- [html-minifier options](https://github.com/kangax/html-minifier#options-quick-reference)

### sourceFiles

```js
sourceFiles?: QuasarSourceFilesConfiguration;

/**
 * Use this property to change the default names of some files of your website/app if you have to.
 * All paths must be relative to the root folder of your project.
 *
 * @default
 * {
 *  rootComponent: 'src/App.vue',
 *  router: 'src/router/index',
 *  store: 'src/stores/index', // for Pinia
 *  // store: 'src/store/index' // for Vuex
 *  pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
 *  pwaServiceWorker: 'src-pwa/custom-service-worker',
 *  pwaManifestFile: 'src-pwa/manifest.json',
 *  electronMain: 'src-electron/electron-main',
 *  electronPreload: 'src-electron/electron-preload'
 * }
 */
interface QuasarSourceFilesConfiguration {
  rootComponent?: string;
  router?: string;
  store?: string;
  pwaRegisterServiceWorker?: string;
  pwaServiceWorker?: string;
  pwaManifestFile?: string;
  electronMain?: string;
  electronPreload?: string;
}
```

### htmlVariables

```js
/** Add variables that you can use in /index.html. */
htmlVariables?: Record<string, any>;
```

You can define and then reference variables in `/index.html`, like this:

```js /quasar.config file
module.exports = function (ctx) {
  return {
    htmlVariables: {
      myVar: 'some-content'
    }
  }
}
```

Then, as an example:

```html /index.html
<%= myVar %>
<% if (myVar) { %>something<% } %>
```

One more example:

```js /quasar.config file
module.exports = function (ctx) {
  return {
    htmlVariables: {
      title: 'test name',
      some: {
        prop: 'my-prop'
      }
    }
  }
}
```

Then, as an example:

```html /index.html
<%= title %>
<%= some.prop %>
<% if (some.prop) { %><%= title %><% } %>
```

### Quasar Mode Specific

| Property | Type | Description |
| --- | --- | --- |
| cordova | Object | Cordova specific [config](/quasar-cli-vite/developing-cordova-apps/configuring-cordova). |
| capacitor | Object | Quasar CLI Capacitor specific [config](/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor). |
| pwa | Object | PWA specific [config](/quasar-cli-vite/developing-pwa/configuring-pwa). |
| ssr | Object | SSR specific [config](/quasar-cli-vite/developing-ssr/configuring-ssr). |
| electron | Object | Electron specific [config](/quasar-cli-vite/developing-electron-apps/configuring-electron). |
| bex | Object | BEX specific [config](/quasar-cli-vite/developing-browser-extensions/configuring-bex). |


## Examples

### Setting env for dev/build

Please refer to [Adding to process.env](/quasar-cli-vite/handling-process-env#adding-to-process-env) section in our docs.

### Adding Vite plugins

Please refer to the [Handling Vite](/quasar-cli-vite/handling-vite#adding-vite-plugins) page.
