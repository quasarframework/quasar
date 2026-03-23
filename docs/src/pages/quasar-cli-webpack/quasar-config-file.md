---
title: Configuring quasar.config file
desc: (@quasar/app-webpack) Where, how and what you can configure in a Quasar app.
---

Quasar makes use of some awesome development tools under its hood, like [Webpack](https://webpack.js.org/). One of the great things about Quasar is its handling of most of the complex configuration needed by the underlying tools for you. As a result, you don't even need to know Webpack or any of the other development tools in order to use Quasar.

So what can you configure through the `/quasar.config` file?

- Quasar components, directives and plugins that you'll be using in your website/app
- Default [Quasar Language Pack](/options/quasar-language-packs)
- [Icon libraries](/options/installing-icon-libraries) that you wish to use
- Default [Quasar Icon Set](/options/quasar-icon-sets) for Quasar components
- Development server port, HTTPS mode, hostname and so on
- [CSS animations](/options/animations) that you wish to use
- [Boot Files](/quasar-cli-webpack/boot-files) list (that determines order of execution too) -- which are files in `/src/boot` that tell how your app is initialized before mounting the root Vue component
- Global CSS/Sass/... files to be included in the bundle
- PWA [manifest](/quasar-cli-webpack/developing-pwa/configuring-pwa#Configuring-Manifest-File) and [Workbox options](/quasar-cli-webpack/developing-pwa/configuring-pwa#quasar-config-file)
- [Electron Packager](/quasar-cli-webpack/developing-electron-apps/configuring-electron#quasar-config-file) and/or [Electron Builder](/quasar-cli-webpack/developing-electron-apps/configuring-electron#quasar-config-file)
- Extend Webpack config

::: tip
You'll notice that changing any of these settings does not require you to manually reload the dev server. Quasar detects and reloads the necessary processes. You won't lose your development flow, because you can just sit back while Quasar CLI quickly reloads the changed code, even keeping the current state. This saves tons of your time!
:::

::: warning
The `/quasar.config` file is run by the Quasar CLI build system, so this code runs under Node.js directly, not in the context of your app. This means you can require modules like 'node:fs', 'node:path', 'webpack', and so on.
:::

## Structure

### The basics

You'll notice that the `/quasar.config` file exports a function that takes a `ctx` (context) parameter and returns an Object. This allows you to dynamically change your website/app config based on this context:

```js
import { defineConfig } from '#q-app/wrappers'

export default defineConfig((ctx) => { // can be async too
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

  return {
    // ... your config
  }
})
```

What this means is that, as an example, you can load a font when building for a certain mode (like PWA), and pick another one for the others:

```js
{
  extras: [
    ctx.mode.pwa // we're adding only if working on a PWA
      ? 'roboto-font'
      : null
  ]
}
```

Or you can use a global CSS file for SPA mode and another one for Cordova mode while avoiding loading any such file for the other modes.

```js
{
  css: [
    ctx.mode.spa ? 'app-spa.sass' : null, // looks for /src/css/app-spa.sass
    ctx.mode.cordova ? 'app-cordova.sass' : null // looks for /src/css/app-cordova.sass
  ]
}
```

Or you can configure the dev server to run on port 8000 for SPA mode, on port 9000 for PWA mode or on port 9090 for the other modes:

```js
{
  devServer: {
    port: ctx.mode.spa ? 8000 : ctx.mode.pwa ? 9000 : 9090
  }
}
```

You can also do async work before returning the quasar configuration:

```js
export default defineConfig(async (ctx) => {
  const data = await someAsyncFunction()
  return {
    // ... use "data"
  }
})

// or:
export default defineConfig((ctx) => {
  return new Promise(resolve => {
    // some async work then:
    // resolve() with the quasar config
    resolve({
      //
    })
  })
})
```

The possibilities are endless.

### IDE autocompletion

You can wrap the returned function with `configure()` helper to get a better IDE autocomplete experience (through Typescript):

```js
import { defineConfig } from '#q-app/wrappers'

export default defineConfig(ctx => {
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

### vendor

By default, everything that comes from `node_modules` will be injected into the vendor chunk for performance & caching reasons. However, should you wish to add or remove something from this special chunk, you can do so:

```js /quasar.config file
return {
  vendor: {
    /* optional;
       disables vendor chunk: */ disable: true,

    add: ['src/plugins/my-special-plugin'],
    remove: ['axios', 'vue$']
  }
}
```

### boot

More on [Boot Files](/quasar-cli-webpack/boot-files).

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

More on the [PreFetch Feature](/quasar-cli-webpack/prefetch-feature) page.

```js
/** Enable the preFetch feature. */
preFetch?: boolean;
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

Tells the CLI what Quasar components/directives/plugins to import, what Quasar I18n language pack to use, what icon set to use for Quasar components and more.

Filling "components" and "directives" is required only if "all" is set to `false`.

```js /quasar.config file
framework: {
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
   * @see https://v2.quasar.dev/layout/grid/introduction-to-flexbox#flex-addons
   * @see https://v2.quasar.dev/style/spacing#flex-addons
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
 * What Quasar CSS animations to import.
 * @example [ 'bounceInLeft', 'bounceOutRight' ]
 * */
animations?: QuasarAnimationsConfiguration | 'all';
```

### devServer

**Webpack devServer options**. Take a look at the [full list](https://webpack.js.org/configuration/dev-server/) of options. Some are overwritten by Quasar CLI based on "quasar dev" parameters and Quasar mode in order to ensure that everything is setup correctly. Note: if you're proxying the development server (i.e. using a cloud IDE or local tunnel), set the `webSocketURL` setting in the `client` section to your public application URL to allow features like Live Reload and Hot Module Replacement to work as [described here](https://webpack.js.org/configuration/dev-server/#websocketurl).

Most used properties are:

| Property                | Type           | Description                                                                                                                                                                                                                                            |
| ----------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| port                    | Number         | Port of dev server                                                                                                                                                                                                                                     |
| host                    | String         | Local IP/Host to use for dev server                                                                                                                                                                                                                    |
| open                    | Boolean/Object | Unless it's set to `false`, Quasar will open up a browser pointing to dev server address automatically. Applies to SPA, PWA and SSR modes. Uses [open](https://github.com/sindresorhus/open#usage) package params. For more details, please see below. |
| proxy                   | Object/Array   | Proxying some URLs can be useful when you have a separate API backend development server and you want to send API requests on the same domain.                                                                                                         |
| devMiddleware           | Object         | Configuration supplied to webpack-dev-middleware v4                                                                                                                                                                                                    |
| server                  | Object         | Here you can configure HTTPS instead of HTTP (see below)                                                                                                                                                                                               |
| onBeforeSetupMiddleware | Function       | Configure the dev middlewares before webpack-dev-server applies its own config.                                                                                                                                                                        |
| onAfterSetupMiddleware  | Function       | Configure the dev middlewares after webpack-dev-server applies its own config.                                                                                                                                                                         |

Using `open` prop to open with a specific browser and not with the default browser of your OS (check [supported values](https://github.com/sindresorhus/open#options)). The `options` param described in previous link is what you should configure quasar.config file > devSever > open with. Some examples:

```js /quasar.config file
// (syntax below requires @quasar/app-webpack v3.3+)

// opens Google Chrome
devServer: {
  open: {
    app: {
      name: 'google chrome'
    }
  }
}

// opens Firefox
devServer: {
  open: {
    app: {
      name: 'firefox'
    }
  }
}

// opens Google Chrome and automatically deals with cross-platform issues:
import open from 'open'

devServer: {
  open: {
    app: {
      name: open.apps.chrome
    }
  }
}
```

When you set `devServer > server > type: 'https'` in your the `/quasar.config` file, Quasar will auto-generate a SSL certificate for you. However, if you want to create one yourself for your localhost, then check out this blog post by [Filippo](https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/). Then your `quasar.config file > devServer > server` should look like this:

```js /quasar.config file
devServer: {
  server: {
    type: 'https', // NECESSARY (alternative is type 'http')

    options: {
      // Use ABSOLUTE paths or path.join(__dirname, 'root/relative/path')
      key: "/path/to/server.key",
      pfx: "/path/to/server.pfx",
      cert: "/path/to/server.crt",
      ca: "/path/to/ca.pem",
      passphrase: 'webpack-dev-server' // do you need it?
    }
  }
}
```

You can also configure automatically opening remote Vue Devtools:

```js /quasar.config file
devServer: {
  vueDevtools: true
}
```

#### Docker and WSL Issues with HMR

If you are using a Docker Container, you may find HMR stops working. HMR relies on the operating system to give notifications about changed files which may not work for your Docker Container.

A stop-gap solution can be achieved by using the polling mode to check for filesystem changes.
This can be enabled with:

```js /quasar.config file
build: {
  // ...
  extendWebpack(cfg) {
    cfg.watchOptions = {
      aggregateTimeout: 200,
      poll: 1000,
    };
  },
// ...
```

### build

```js /quasar.config file
build: {
  /**
   * Transpile JS code with Babel
   *
   * @default true
   */
  webpackTranspile?: boolean;
  /**
   * Add dependencies for transpiling with Babel (from node_modules, which are by default not transpiled).
   * It is ignored if "transpile" is not set to true.
   * @example [ /my-dependency/, 'my-dep', ...]
   */
  webpackTranspileDependencies?: (RegExp | string)[];
  /**
   * Esbuild is used to build contents of /src-pwa, /src-ssr, /src-electron, /src-bex
   * @example
   *    {
   *      browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
   *      node: 'node20'
   *    }
   */
  esbuildTarget?: EsbuildTargetOptions;

  /**
   * Extend Webpack config generated by Quasar CLI.
   * Equivalent to chainWebpack(), but you have direct access to the Webpack config object.
   */
  extendWebpack?: (
    config: WebpackConfiguration,
    invokeParams: InvokeParams
  ) => void;
  /**
   * Extend Webpack config generated by Quasar CLI.
   * Equivalent to extendWebpack(), but using [webpack-chain](https://github.com/sorrycc/webpack-chain) instead.
   */
  chainWebpack?: (chain: WebpackChain, invokeParams: InvokeParams) => void;

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
   * @default 'index.html'
   */
  htmlFilename?: string;
  /**
   * Folder where Quasar CLI should generate the distributables.
   * Relative path to project root directory.
   *
   * @default 'dist/{ctx.modeName}' For all modes except Cordova.
   * @default 'src-cordova/www' For Cordova mode.
   */
  distDir?: string;
  /**
   * Ignores the public folder.
   */
  ignorePublicFolder?: boolean;

  /**
   * Sets [Vue Router mode](https://router.vuejs.org/guide/essentials/history-mode.html).
   * History mode requires configuration on your deployment web server too.
   * For Capacitor and Electron, it's always 'hash' for [compatibility reasons](https://github.com/quasarframework/quasar/issues/17322#issuecomment-2191987962).
   *
   * @default 'hash'
   */
  vueRouterMode?: "hash" | "history";
  /**
   * Sets Vue Router base.
   * Should not need to configure this, unless absolutely needed.
   */
  vueRouterBase?: string;
  /** Include vue runtime + compiler version, instead of default Vue runtime-only. */
  vueCompiler?: boolean;
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

  /** Show a progress bar while compiling with Webpack. */
  webpackShowProgress?: boolean;
  /**
   * Source map [strategy](https://webpack.js.org/configuration/devtool/) to use.
   */
  webpackDevtool?: WebpackConfiguration["devtool"];

  /**
   * @example
   * {
   *   // import { ... } from 'locales/...'
   *   locales: path.join(__dirname, 'src/locales')
   * }
   */
  alias?: { [key: string]: string };
  /**
   * Configuration for TypeScript integration.
   */
  typescript?: {
    /**
     * Once your codebase is fully using TypeScript and all team members are comfortable with it,
     * you can set this to `true` to enforce stricter type checking.
     * It is recommended to set this to `true` and use stricter typescript-eslint rules.
     *
     * It will set the following TypeScript options:
     * - "strict": true
     * - "allowUnreachableCode": false
     * - "allowUnusedLabels": false
     * - "noImplicitOverride": true
     * - "exactOptionalPropertyTypes": true
     * - "noUncheckedIndexedAccess": true
     *
     * @see https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html#getting-stricter-checks
     */
    strict?: boolean;

    /**
     * Extend the generated `.quasar/tsconfig.json` file.
     *
     * If you don't have dynamic logic, you can directly modify your `tsconfig.json` file instead.
     */
    extendTsConfig?: (tsConfig: TSConfig) => void;

    /**
     * Generate a shim file for `*.vue` files to process them as plain Vue component instances.
     *
     * Vue Language Tools VS Code extension can analyze `*.vue` files in a better way, without the shim file.
     * So, you can disable the shim file generation and let the extension handle the types.
     *
     * However, some tools like ESLint can't work with `*.vue` files without the shim file.
     * So, if your tooling is not properly working, enable this option.
     */
    vueShim?: boolean;
  };

  /**
   * Add properties to `process.env` that you can use in your website/app JS code.
   *
   * @example { SOMETHING: 'someValue' }
   */
  env?: { [index: string]: string | boolean | undefined | null };
  /**
   * Defines constants that get replaced in your app.
   * Unlike `env`, you will need to use JSON.stringify() on the values yourself except for booleans.
   * Also, these will not be prefixed with `process.env.`.
   *
   * @example { SOMETHING: JSON.stringify('someValue') } -> console.log(SOMETHING) // console.log('someValue')
   */
  rawDefine?: { [index: string]: string | boolean | undefined | null };
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
   * Gzip the distributables.
   * Could be either a boolean or compression plugin options object.
   * In addition, you can specify which file extension you want to
   * gzip with extension array field in replacement of compression plugin test option.
   * By default it's ['js','css'].
   * @example
   *    {
   *      extension: ['js','css','svg'],
   *      threshold: 0,
   *      minRatio: 1
   *    }
   * @default false
   */
  gzip?:
    | boolean
    | (DefinedDefaultAlgorithmAndOptions<any> & {
        extensions: string[];
      });
  /**
   * Show analysis of build bundle with webpack-bundle-analyzer.
   * When providing an object, it represents webpack-bundle-analyzer config options.
   */
  analyze?: boolean | BundleAnalyzerPlugin.Options;

  /**
   * Minification options. [Full list](https://github.com/webpack-contrib/terser-webpack-plugin/#minify).
   */
  uglifyOptions?: TerserOptions;
  /** Options to supply to `sass-loader` for `.scss` files. */
  scssLoaderOptions?: object;
  /** Options to supply to `sass-loader` for [`.sass`](https://github.com/webpack-contrib/sass-loader#sassoptions) files. */
  sassLoaderOptions?: object;
  /** Options to supply to `stylus-loader`. */
  stylusLoaderOptions?: object;
  /** Options to supply to `less-loader`. */
  lessLoaderOptions?: object;
  /** Options to supply to `vue-loader` */
  vueLoaderOptions?: object;
  /** Options to supply to `ts-loader` */
  tsLoaderOptions?: object;
  /**
   * RTL options. [Full list](https://github.com/vkalinichev/postcss-rtl).
   * When providing an object, it is the configuration for postcss-rtl plugin, and if fromRTL is present it will only be used for client styles
   * When providing a function, the function will receive a boolean that is true for client side styles and false otherwise and the path to the style file
   *
   */
  rtl?:
    | boolean
    | object
    | ((isClientCSS: boolean, resourcePath: string) => object);

  /**
   * Set to `false` to disable minification, or specify the minifier to use.
   * Available options are 'terser' or 'esbuild'.
   * If set to anything but boolean false then it also applies to CSS.
   * For production only.
   * @default 'esbuild'
   */
  minify?: boolean | 'terser' | 'esbuild';
  /**
   * Minification options for html-minifier-terser: https://github.com/terser/html-minifier-terser?tab=readme-ov-file#options-quick-reference
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
}
```

If, for example, you run "quasar build --debug", sourceMap and extractCSS will be set to "true" regardless of what you configure.

### sourceFiles

Use this property to change the default names of some files of your website/app if you have to. All paths must be relative to the root folder of your project.

```js /quasar.config file
/**
 * Use this property to change the default names of some files of your website/app if you have to.
 * All paths must be relative to the root folder of your project.
 *
 * @default
 * {
 *  rootComponent: 'src/App.vue',
 *  router: 'src/router/index',
 *  store: 'src/stores/index',
 *  indexHtmlTemplate: 'index.html',
 *  pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
 *  pwaServiceWorker: 'src-pwa/custom-service-worker',
 *  pwaManifestFile: 'src-pwa/manifest.json',
 *  electronMain: 'src-electron/electron-main',
 *  bexManifestFile: 'src-bex/manifest.json'
 * }
 */
sourceFiles: {
  rootComponent?: string;
  router?: string;
  store?: string;
  indexHtmlTemplate?: string;
  pwaRegisterServiceWorker?: string;
  pwaServiceWorker?: string;
  pwaManifestFile?: string;
  electronMain?: string;
  bexManifestFile?: string;
}
```

### htmlVariables

```js
/** Add variables that you can use in /index.html. */
htmlVariables?: Record<string, any>;
```

You can define and then reference variables in `/index.html`, like this:

```js /quasar.config file
import { defineConfig } from '#q-app/wrappers'

export default defineConfig(ctx => {
  return {
    htmlVariables: {
      myVar: 'some-content'
    }
  }
})
```

Then, as an example:

```html /index.html
<%= myVar %> <% if (myVar) { %>something<% } %>
```

One more example:

```js /quasar.config file
htmlVariables: {
  title: 'test name',
  some: {
    prop: 'my-prop'
  }
}
```

Then, as an example:

```html /index.html
<%= title %> <%= some.prop %> <% if (some.prop) { %><%= title %><% } %>
```

### Example setting env for dev/build

Please refer to [Adding to process.env](/quasar-cli-webpack/handling-process-env#adding-to-process-env) section in our docs.

### Handling Webpack configuration

In depth analysis on [Handling Webpack](/quasar-cli-webpack/handling-webpack) documentation page.
