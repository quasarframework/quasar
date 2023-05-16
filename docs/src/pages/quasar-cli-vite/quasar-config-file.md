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

## Structure

### The basics

You'll notice that the `/quasar.config` file exports a function that takes a `ctx` (context) parameter and returns an Object. This allows you to dynamically change your website/app config based on this context:

```js
export default function (ctx) { // can be async too
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
export default function (ctx) {
  extras: [
    ctx.mode.pwa // we're adding only if working on a PWA
      ? 'roboto-font'
      : null
  ]
}
```

Or you can use a global CSS file for SPA mode and another one for Cordova mode while avoiding loading any such file for the other modes.

```js
export default function (ctx) {
  css: [
    ctx.mode.spa ? 'app-spa.sass' : null, // looks for /src/css/app-spa.sass
    ctx.mode.cordova ? 'app-cordova.sass' : null  // looks for /src/css/app-cordova.sass
  ]
}
```

Or you can configure the dev server to run on port 8000 for SPA mode, on port 9000 for PWA mode or on port 9090 for the other modes:

```js
export default function (ctx) {
  devServer: {
    port: ctx.mode.spa
      ? 8000
      : (ctx.mode.pwa ? 9000 : 9090)
  }
}
```

You can also do async work before returning the quasar configuration:

```js
export default async function (ctx) {
  const data = await someAsyncFunction()
  return {
    // ... use "data"
  }
}

// or:
export default function (ctx) {
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

You can wrap the returned function with `configure()` helper to get a better IDE autocomplete experience (through Typescript):

```js
const { configure } = require('quasar/wrappers')

export default configure(function (ctx) {
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

```js
// quasar.config file
return {
  css: [
    'app.sass', // referring to /src/css/app.sass
    '~some-library/style.css' // referring to node_modules/some-library/style.css
  ]
}
```

### boot

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

More on the [PreFetch Feature](/quasar-cli-vite/prefetch-feature).

```js
/** Enable the preFetch feature. */
preFetch?: boolean;
```

### eslint

You will need the linting files already installed. If you don't know which those are, scaffold a new Quasar project folder (`yarn create quasar` or `npm init quasar` or the experimental `pnpm create quasar`) and pick "Linting" when asked about it.

```js
/** Options with which Quasar CLI will use ESLint */
eslint?: QuasarEslintConfiguration;

interface QuasarEslintConfiguration {
  /**
   * Should it report warnings?
   * @default true
   */
  warnings?: boolean;

  /**
   * Should it report errors?
   * @default true
   */
  errors?: boolean;

  /**
   * Fix on save
   */
  fix?: boolean;

  /**
   * Raw options to send to ESLint
   */
  rawOptions?: object;

  /**
   * Files to include (can be in glob format)
   */
  include?: string[];

  /**
   * Files to exclude (can be in glob format).
   * Recommending to use .eslintignore file instead.
   */
  exclude?: string[];
}
```

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
 * set to use for Quasar components.
 */
framework?: QuasarFrameworkConfiguration;

interface QuasarFrameworkConfiguration {
  config?: /* Quasar UI config -- you'll notice in docs when you need it */;

  /**
   * one of the Quasar IconSets (see specific docs page)
   * @example 'material-icons'
   */
  iconSet?: QuasarIconSets;

  /**
   * one of the Quasar language pack in String format (see specific docs page)
   * @example 'en-US' / 'es' / 'he' / ...
   */
  lang?: QuasarLanguageCodes;

  /* if you want the Quasar CSS Addons (see specific docs page) */
  cssAddon?: boolean;

  /**
   * Format in which you will write your Vue templates when
   * using Quasar components.
   *
   * @default 'kebab'
   */
  autoImportComponentCase?: "kebab" | "pascal" | "combined";

  /**
   * For special cases outside of where the auto-import strategy can have an impact
   * (like plain .js or .ts files),
   * you can manually specify Quasar components/directives to be available everywhere.
   * @example [ 'QAvatar', 'QChip' ]
   */
  components?: (keyof QuasarPluginOptions["components"])[];
  directives?: (keyof QuasarPluginOptions["directives"])[];

  /**
   * Quasar plugins.
   * @example [ 'Notify', 'Loading', 'Meta', 'AppFullscreen' ]
   */
  plugins?: (keyof QuasarPluginOptions["plugins"])[];
}
```

More on cssAddon [here](/layout/grid/introduction-to-flexbox#flex-addons).

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
import { ServerOptions } from "vite";

/**
 * Vite "server" options.
 * Some properties are overwritten based on the Quasar mode you're using in order
 * to ensure a correct config.
 * Note: if you're proxying the development server (i.e. using a cloud IDE),
 * set the `public` setting to your public application URL.
 */
devServer?: ServerOptions;
```

Apart from these options, Quasar CLI tampers with some and you will experience them differently than on a Vite app:

Using `open` prop to open with a specific browser and not with the default browser of your OS (check [supported values](https://github.com/sindresorhus/open#options)). The `options` param described in previous link is what you should configure quasar.config file > devSever > open with. Some examples:

```js
// quasar.config file

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

```js
// quasar.config file
devServer: {
  vueDevtools: true
}
```

### build

```js
/** Build configuration options. */
build?: QuasarBuildConfiguration;

import { UserConfig as ViteUserConfig } from "vite";
import { Options as VuePluginOptions } from "@vitejs/plugin-vue"

interface InvokeParams {
  isClient: boolean;
  isServer: boolean;
}

interface BuildTargetOptions {
  /**
   * @default ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1']
   */
  browser?: string[];
  /**
   * @example 'node16'
   */
  node: string;
}

interface QuasarStaticBuildConfiguration {
  /**
   * @example
   *    {
   *      browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
   *      node: 'node16'
   *    }
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
   */
  viteVuePluginOptions?: VuePluginOptions;
  /**
   * Vite plugins
   *
   * @example
   *   [
   *     [ 'package-name', { ..options.. } ],
   *     [ require('some-plugin'), { ...options... } ]
   *   ]
   */
  vitePlugins?: object[];
  /**
   * @example setting an alias for a custom folder
   *    {
   *       locales: path.join(__dirname, 'src/locales')
   *    }
   */
  alias?: object[];
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
   * Generates and opens an html report.
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
   * @example { SOMETHING: 'someValue' }
   */
  env?: { [index: string]: string };
  /**
   * Defines constants that get replaced in your app.
   * Unlike `env`, you will need to use JSON.stringify() on the values yourself except for booleans.
   * Also, these will not be prefixed with `process.env.`.
   *
   * @example { SOMETHING: JSON.stringify('someValue') } -> console.log(SOMETHING) // console.log('someValue')
   */
  rawDefine?: { [index: string]: string };
  /**
   * Folder where Quasar CLI should look for .env* files.
   * Can be an absolute path or a relative path to project root directory.
   *
   * @default project root directory
   */
  envFolder?: string;
  /**
   * Additional .env* files to be loaded.
   * Each entry can be an absolute path or a relative path to quasar.config > build > envFolder.
   *
   * @example ['.env.somefile', '../.env.someotherfile']
   */
  envFiles?: string[];

  /**
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
   * Treeshake Quasar's UI on dev too?
   * Recommended to leave this as false for performance reasons.
   * @default false
   */
  devQuasarTreeshaking?: boolean;

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

/**
 * Following properties of `build` are automatically configured by Quasar CLI
 *  depending on dev/build commands and Quasar mode.
 * You can override some, but make sure you know what you are doing.
 */
interface QuasarDynamicBuildConfiguration {
  /**
   * Set to `false` to disable minification, or specify the minifier to use.
   * Available options are 'terser' or 'esbuild'.
   * If set to anything but boolean false then it also applies to CSS.
   * For production only.
   * @default 'esbuild'
   */
  minify?: boolean | 'terser' | 'esbuild';
  /**
   * If `true`, a separate sourcemap file will be created. If 'inline', the
   * sourcemap will be appended to the resulting output file as data URI.
   * 'hidden' works like `true` except that the corresponding sourcemap
   * comments in the bundled files are suppressed.
   * @default false
   */
  sourcemap?: boolean | 'inline' | 'hidden';
}
```

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
htmlVariables?: { [index: string]: string };
```

You can define and then reference variables in `/index.html`, like this:

```js
htmlVariables: {
  myVar: 'some-content'
}

// then in /index.html
<%= myVar %>
<% if (myVar) { %>something<% } %>
```

One more example:

```js
// quasar.config file
export default function (ctx) {
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
<!-- /index.html -->
<%= title %>
<%= some.prop %>
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
