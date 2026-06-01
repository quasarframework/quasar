---
title: Configuring quasar.config file
desc: (@quasar/app-vite) Where, how and what you can configure in a Quasar CLI with Vite app.
related:
  - /quasar-cli-vite/handling-vite
  - /quasar-cli-vite/handling-import-meta-env
---

Notice that your scaffolded project folder contains a `/quasar.config` file. So what can you configure through it? Basically anything that Quasar CLI does for you.

- Quasar components, directives and plugins that you'll be using in your website/app
- Default [Quasar Language Pack](/options/quasar-language-packs)
- [Icon libraries](/options/installing-icon-libraries) that you wish to use
- Default [Quasar Icon Set](/options/quasar-icon-sets) for Quasar components
- Development server port, HTTPS mode, hostname and so on
- [CSS animations](/options/animations) that you wish to use
- [Boot Files](/quasar-cli-vite/boot-files) list (that determines order of execution too) -- which are files in `/src/boot` that tell how your app is initialized before mounting the root Vue component
- Global CSS/Sass/... files to be included in the bundle
- SPA, PWA, Electron, Capacitor, Cordova, SSR, BEX (browser extensions) configuration
- Extend the under the hood tools, like the generated Vite config
- ...and many many more that you'll discover along the way

::: tip
You'll notice that changing any of these settings does not require you to manually reload the dev server. Quasar detects and reloads the necessary processes. You won't lose your development flow, because you can just sit back while Quasar CLI quickly reloads the changed code, even keeping the current state. This saves tons of your time!
:::

::: warning
The `/quasar.config` file is run by the Quasar CLI build system, so this code runs under Node.js directly, not in the context of your app. This means you can require modules like `node:fs`, `node:path`, Vite plugins, and so on.
:::

## Structure

### The basics

You'll notice that the `/quasar.config` file exports a function that takes a `ctx` (context) parameter and returns an Object. This allows you to dynamically change your website/app config based on this context:

```js /quasar.config file
import { defineConfig } from '#q-app'

export default defineConfig(ctx => {
  // can be async too
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
})
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
    ctx.mode.cordova ? 'app-cordova.sass' : null // looks for /src/css/app-cordova.sass
  ]
}
```

Or you can configure the dev server to run on port 8000 for SPA mode, on port 9000 for PWA mode or on port 9090 for the other modes:

```js /quasar.config file
{
  devServer: {
    port: ctx.mode.spa ? 8000 : ctx.mode.pwa ? 9000 : 9090
  }
}
```

You can also do async work before returning the quasar configuration:

```js /quasar.config file
import { defineConfig } from '#q-app'

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

### Logging via ctx

The `ctx` object has a logger that prints in the same style as the Quasar CLI itself:

```js /quasar.config file
import { defineConfig } from '#q-app'

export default defineConfig(ctx => {
  ctx.logger.log('hello') // green-bannered line
  ctx.logger.warn('careful') // yellow-bannered warning
  ctx.logger.fatal('boom') // red-bannered error; exits with code 1
  ctx.logger.tip('try foo') // TIP-pilled tip line
  ctx.logger.info('synced') // INFO-pilled line
  ctx.logger.info('synced', 'SYNC') // custom pill text instead of INFO
  ctx.logger.success('built')
  ctx.logger.error('oh no')
  ctx.logger.warning('hmm')

  const finish = ctx.logger.progress({
    tool: 'fetch',
    waitAction: 'reading',
    doneAction: 'read'
  })
  // ...later
  finish() // prints the DONE line with elapsed time

  ctx.logger.dot // the bullet character the helpers print

  return {
    // ...
  }
})
```

### IDE autocompletion

Notice the `defineConfig` import from `#q-app`. This is essentially a no-op function but what it does is it helps with the IDE autocomplete experience. Every option you set is type-checked, every value gets completion, and hovering a key reveals its JSDoc.

<!-- prettier-ignore -->
```ts [twoslash] /quasar.config file
// @noErrors
import { defineConfig } from '#q-app'

export default defineConfig(ctx => ({
  boot: ['axios', 'i18n'],

  css: ['app.sass'],

  extras: ['material-symbols-outlined', 'roboto-font'],

  framework: {
    lang: 'en-US',
    plugins: ['Notify', 'Dialog'],
    iconSet: 'material-'
    //                 ^|
  },

  build: {
    vueRouterMode: 'history'
  }
}))
```

## Options to Configure

### css

```ts
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

```ts
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

```ts
/** Enable the preFetch feature. */
preFetch?: boolean;
```

### extras

```ts
/**
 * What to import from [@quasar/extras](https://github.com/quasarframework/quasar/tree/dev/extras) package.
 * @example ['material-icons', 'roboto-font', 'ionicons-v4']
 */
extras?: (QuasarIconSets | QuasarFonts)[];
```

### framework

```ts
/**
 * What Quasar language pack to use, what Quasar icon
 * set to use for Quasar components, etc.
 */
framework?: {
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

```ts
/**
 * What Quasar CSS animations to import.
 * @example [ 'bounceInLeft', 'bounceOutRight' ]
 * */
animations?: QuasarAnimationsConfiguration | 'all';
```

### devServer

More info: [Vite server options](https://vitejs.dev/config/#server-options)

```ts
import { ServerOptions as ViteServerOptions } from "vite";
import { Options as OpenOptions } from "open";
type DevServerOptions = Omit<ViteServerOptions, "open" | "https"> & {
  open?: Omit<OpenOptions, "wait"> | boolean;
  https?: ViteServerOptions["https"] | boolean;
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

You can also configure automatically opening remote Vue Devtools:

```js /quasar.config file
devServer: {
  vueDevtools: true
}
```

### build

```ts
import { Plugin, UserConfig as ViteUserConfig } from 'vite'
import { Options as VuePluginOptions } from '@vitejs/plugin-vue'
import { CompilerOptions, TypeAcquisition } from 'typescript'
import { QuasarHookParams } from './conf'
import type { Options as VueRouterVitePluginOptions } from 'vue-router/dist/unplugin/options.d.mts'

interface HtmlMinifierOptions {
  caseSensitive?: boolean
  collapseBooleanAttributes?: boolean
  collapseInlineTagWhitespace?: boolean
  collapseWhitespace?: boolean
  conservativeCollapse?: boolean
  continueOnParseError?: boolean
  customAttrAssign?: RegExp[]
  customAttrCollapse?: RegExp
  customAttrSurround?: RegExp[]
  customEventAttributes?: RegExp[]
  decodeEntities?: boolean
  html5?: boolean
  ignoreCustomComments?: RegExp[]
  ignoreCustomFragments?: RegExp[]
  includeAutoGeneratedTags?: boolean
  keepClosingSlash?: boolean
  maxLineLength?: number
  minifyCSS?: boolean
  minifyJS?: boolean
  minifyURLs?: boolean
  preserveLineBreaks?: boolean
  preventAttributesEscaping?: boolean
  processConditionalComments?: boolean
  processScripts?: string[]
  quoteCharacter?: string
  removeAttributeQuotes?: boolean
  removeComments?: boolean
  removeEmptyAttributes?: boolean
  removeEmptyElements?: boolean
  removeOptionalTags?: boolean
  removeRedundantAttributes?: boolean
  removeScriptTypeAttributes?: boolean
  removeStyleLinkTypeAttributes?: boolean
  removeTagWhitespace?: boolean
  sortAttributes?: boolean
  sortClassName?: boolean
  trimCustomFragments?: boolean
  useShortDoctype?: boolean
}

// TSConfig type is adapted from https://github.com/unjs/pkg-types/blob/0bec64641468c9560dea95da2cff502ea8118286/src/types/tsconfig.ts
type StripEnums<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends boolean
    ? T[K]
    : T[K] extends string
      ? T[K]
      : T[K] extends object
        ? T[K]
        : T[K] extends Array<any>
          ? T[K]
          : T[K] extends undefined
            ? undefined
            : any
}

interface PluginEntryRunOptions {
  readonly server?: boolean
  readonly client?: boolean
}

type PluginEntry =
  | [pluginName: string, options?: any, runOptions?: PluginEntryRunOptions]
  | [
      pluginFactory: (options?: any) => Plugin,
      options?: any,
      runOptions?: PluginEntryRunOptions
    ]
  | Plugin
  | null
  | undefined
  | false

interface QuasarStaticBuildConfiguration {
  /**
   * @default
   * {
   *   browser: 'baseline-widely-available',
   *   node: 'node22'
   * }
   * @example
   * {
   *   browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
   *   node: 'node24'
   * }
   */
  target?: {
    /**
     * @default 'baseline-widely-available'
     * @example ['es2022', 'firefox115', 'chrome115', 'safari14']
     */
    browser?: string | string[]
    /**
     * @example 'node22'
     */
    node?: string
  }

  /**
   * Public path of your app.
   * Use it when your public path is something else,
   * like _“<protocol>://<domain>/some/nested/folder”_ – in this case,
   * it means the distributables are in _“some/nested/folder”_ on your webserver.
   *
   * @default '/'
   */
  publicPath?: string

  /**
   * Sets [Vue Router mode](https://router.vuejs.org/guide/essentials/history-mode.html).
   * History mode requires configuration on your deployment web server too.
   * For Capacitor and Electron, it's always 'hash' for [compatibility reasons](https://github.com/quasarframework/quasar/issues/17322#issuecomment-2191987962).
   *
   * @default 'hash'
   */
  vueRouterMode?: 'hash' | 'history'

  /**
   * Sets Vue Router base.
   * Should not need to configure this, unless absolutely needed.
   */
  vueRouterBase?: string

  /**
   * Automatically open remote Vue Devtools when running in development mode.
   */
  vueDevtools?: boolean

  /**
   * Should the Vue Options API be available? If all your components only use Composition API
   * it would make sense performance-wise to disable Vue Options API for a compile speedup.
   *
   * @default false
   */
  vueOptionsAPI?: boolean

  /**
   * Folder where Quasar CLI should generate the distributables.
   * Relative path to project root directory.
   *
   * @default 'dist/{ctx.modeName}' For all modes except Cordova.
   * @default 'src-cordova/www' For Cordova mode.
   */
  distDir?: string

  /**
   * Extend the Vite config generated by Quasar CLI.
   *
   * Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   *
   * @example
   * // return overrides
   * extendViteConf: (config) => ({
   *   optimizeDeps: {
   *     include: ['some-package']
   *   }
   * })
   *
   * @example
   * // directly modify the config object
   * extendViteConf(config) {
   *   config.optimizeDeps ||= {}
   *   config.optimizeDeps.include ||= []
   *   config.optimizeDeps.include.push('some-package)
   * }
   */
  extendViteConf?: (
    config: ViteUserConfig,
    invokeParams: {
      readonly isClient: boolean
      readonly isServer: boolean
    }
  ) => ViteUserConfig | void | Promise<ViteUserConfig | void>

  /**
   * Should you want to use Vue Router's filename-based routing feature.
   * Set to `true` or an options object for vue-router/vite plugin (to override
   * or add to the default options).
   *
   * Restart the dev server and your IDE when toggling this option,
   * or run "quasar prepare" command.
   *
   * https://v2.quasar.dev/quasar-cli-vite/page-routing-with-vue-router#filename-based-routing
   *
   * https://router.vuejs.org/file-based-routing/configuration.html
   *
   * Default options supplied to vue-router/vite plugin when enabled:
   * @example
   * {
   *   // where are paths relative to:
   *   root: <root_project_dir>,
   *   // where to generate the types (if on Typescript projects):
   *   dts: './src/router/typed-router.d.ts',
   * }
   *
   * @default false
   */
  filenameBasedRouting?: boolean | VueRouterVitePluginOptions

  /**
   * Options to supply to @vitejs/plugin-vue
   *
   * @see https://v2.quasar.dev/quasar-cli-vite/handling-vite#vite-vue-plugin-options
   */
  viteVuePluginOptions?: VuePluginOptions

  /**
   * Vite plugins
   *
   * @see https://v2.quasar.dev/quasar-cli-vite/handling-vite#adding-vite-plugins
   *
   * @example
   * import { somePlugin } from 'some-plugin'
   * // ...
   * [
   *   [ 'some-plugin', { ...pluginOptions... } ],
   *
   *   // disable running on client or server threads (set server/client to false):
   *   [ 'some-plugin', { ...pluginOptions... }, { server: true, client: true } ],
   *
   *   [ somePlugin, { ...pluginOptions... } ],
   *
   *   // disable running on client or server threads (set server/client to false):
   *   [ somePlugin, { ...pluginOptions... }, { server: true, client: true } ],
   *
   *   somePlugin({ ...pluginOptions... })
   * ]
   */
  vitePlugins?: PluginEntry[]

  /**
   * @see https://v2.quasar.dev/quasar-cli-vite/handling-vite#folder-aliases
   *
   * Quasar CLI automatically injects the following aliases:
   *   - `#q-app` to the Quasar CLI itself
   *   - `@/` to the /src directory
   *
   * Use only absolute paths. You can use ctx.appPaths for it,
   * for example: `ctx.appPaths.srcDir` or `ctx.appPaths.resolve.app('src/locales')`.
   *
   * @example
   * {
   *   // import { ... } from 'locales/...'
   *   locales: ctx.appPaths.resolve.app('src/locales')
   * }
   *
   * @example
   * {
   *   // import { ... } from 'locales/...'
   *   locales: path.join(import.meta.dirname, 'src/locales')
   * }
   */
  alias?: { [key: string]: string }

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
    strict?: boolean

    /**
     * Extend the generated `.quasar/tsconfig.json` file.
     *
     * If you don't have dynamic logic, you can directly modify your `tsconfig.json` file instead.
     */
    extendTsConfig?: (tsConfig: {
      compilerOptions?: StripEnums<CompilerOptions>
      exclude?: string[]
      compileOnSave?: boolean
      extends?: string | string[]
      files?: string[]
      include?: string[]
      typeAcquisition?: TypeAcquisition
    }) => void

    /**
     * Generate a shim file for `*.vue` files to process them as plain Vue component instances.
     *
     * Vue Language Tools VS Code extension can analyze `*.vue` files in a better way, without the shim file.
     * So, you can disable the shim file generation and let the extension handle the types.
     *
     * However, some tools like ESLint can't work with `*.vue` files without the shim file.
     * So, if your tooling is not properly working, enable this option.
     */
    vueShim?: boolean
  }

  /**
   * Define global constant replacements. Entries will be defined as globals
   * during dev and statically replaced during build.
   *
   * This gets supplied to Vite's & Rolldown's own "define" option,
   * which in turn uses Oxc's "define" feature to perform replacements.
   *
   * All non-string values are automatically JSON.stringified by Quasar CLI.
   * This ensures consistency between Vite & Rolldown builds and avoids Rolldown to fail.
   *
   * @example { __APP_VERSION__: JSON.stringify('v1.0.0') }
   * @example { __API_URL__: 'window.__backend_api_url' }
   */
  define?: Record<
    string,
    string | number | boolean | undefined | null | any[] | Record<string, any>
  >

  /**
   * Sugar for `define` option. Define global constant replacements that will
   * be automatically transformed into "define" entries with the `import.meta.env` prefix
   * and already JSON-stringified.
   *
   * @example { SOME_DEFINE: 'my-string' } will be transformed into { 'import.meta.env.SOME_DEFINE': '"my-string"' }
   * @example { VERSION: 22 } will be transformed into { 'import.meta.env.VERSION': '22' }
   */
  defineEnv?: Record<
    string,
    string | number | boolean | undefined | null | any[] | Record<string, any>
  >

  /**
   * Configuration related to the environment variables loaded from
   * .env* files and Node.js process.env injections.
   */
  env?: {
    /**
     * For security reasons, only variables with this prefix from the env files
     * and Node.js process.env will be exposed to the code shipped to the client.
     * The client app code includes Electron main & preload scripts, as they get
     * shipped to the client side as well.
     *
     * Such variables exposed to the client app code should not contain sensitive
     * information such as API keys.
     *
     * Avoid setting it to 'QUASAR_' so it won't conflict with
     * Quasar's own environment variables.
     *
     * Setting it to an empty string will default to
     * the default value (QCLI_).
     *
     * @default 'QCLI_'
     */
    clientPrefix?: string | string[]
    /**
     * Setting this prefix will filter out env files variables and Node.js process.env
     * variables that are exposed to the backend code (like the SSR server-side).
     *
     * Avoid setting it to 'QUASAR_' so it won't conflict with
     * Quasar's own environment variables.
     *
     * @default ''
     */
    backendPrefix?: string | string[]
    /**
     * Folder where Quasar CLI should look for .env* files.
     * Can be an absolute path or a relative path to project root directory.
     *
     * @default appPaths.appDir
     */
    folder?: string | string[]
    /**
     * Additional .env* files to be loaded.
     * Each entry can be an absolute path or a relative path to
     * quasar.config > build > env > folder.
     *
     * @example ['.env.somefile', '../.env.someotherfile']
     */
    file?: string | string[]
    /**
     * Filter the env files variables & Node.js process.env variables
     * that are exposed to the app code. This does not affects props
     * assigned directly to the quasar.config > build > define prop.
     */
    filter?: (
      env: Record<string, string>,
      type: 'client' | 'backend'
    ) => Record<string, string>
  }

  /**
   * Build production assets with or without the hash part in filenames.
   * Example: "454d87bd" in "@/assets/index.454d87bd.js"
   *
   * When used, please be careful how you configure your web server cache strategy as
   * files will not change name so your client might get 304 (Not Modified) even when
   * it's not the case.
   *
   * Will not change anything if your Vite config already touches the
   * build.rolldownOptions.output.entryFileNames/chunkFileNames/assetFileNames props.
   *
   * Gets applied to production builds only.
   *
   * Useful especially for (but not restricted to) PWA. If set to false then updating the
   * PWA will force to re-download all assets again, regardless if they were changed or
   * not (due to how Rolldown works through Vite).
   *
   * @default true
   */
  useFilenameHashes?: boolean

  /**
   * Ignores the public folder.
   * @default false
   */
  ignorePublicFolder?: boolean

  /**
   * Prepare external services before `$ quasar dev` command runs
   * like starting some backend or any other service that the app relies on.
   * Can use async/await or directly return a Promise.
   */
  beforeDev?: (params: QuasarHookParams) => void
  /**
   * Run hook after Quasar dev server is started (`$ quasar dev`).
   * At this point, the dev server has been started and is available should you wish to do something with it.
   * Can use async/await or directly return a Promise.
   */
  afterDev?: (params: QuasarHookParams) => void
  /**
   * Run hook before Quasar builds app for production (`$ quasar build`).
   * At this point, the distributables folder hasn’t been created yet.
   * Can use async/await or directly return a Promise.
   */
  beforeBuild?: (params: QuasarHookParams) => void
  /**
   * Run hook after Quasar built app for production (`$ quasar build`).
   * At this point, the distributables folder has been created and is available
   *  should you wish to do something with it.
   * Can use async/await or directly return a Promise.
   */
  afterBuild?: (params: QuasarHookParams) => void
  /**
   * Run hook if publishing was requested (`$ quasar build -P`),
   *  after Quasar built app for production and the afterBuild hook (if specified) was executed.
   * Can use async/await or directly return a Promise.
   * `opts` is Object of form `{arg, distDir}`,
   * where “arg” is the argument supplied (if any) to -P parameter.
   */
  onPublish?: (ops: { arg: string; distDir: string }) => void
}

/**
 * Following properties of `build` are automatically configured by Quasar CLI
 *  depending on dev/build commands and Quasar mode.
 * You can override some, but make sure you know what you are doing.
 */
interface QuasarDynamicBuildConfiguration {
  /**
   * Set to `false` to disable minification, or specify the minifier to use.
   * Available options are 'oxc' (recommended) or 'terser'.
   * If set to anything but boolean false then it also applies to CSS.
   * For production only.
   * @default 'oxc'
   */
  minify?: boolean | 'oxc' | 'terser'
  /**
   * Minification options for html-minifier-terser.
   *
   * @see https://github.com/terser/html-minifier-terser?tab=readme-ov-file#options-quick-reference for complete list of options
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
  htmlMinifyOptions?: HtmlMinifierOptions
  /**
   * If `true`, a separate sourcemap file will be created. If 'inline', the
   * sourcemap will be appended to the resulting output file as data URI.
   * 'hidden' works like `true` except that the corresponding sourcemap
   * comments in the bundled files are suppressed.
   * @default false
   */
  sourcemap?: boolean | 'inline' | 'hidden'
}
```

See these references for more info:

- [Vite server options](https://vitejs.dev/config/#server-options)
- [Vite Vue Plugin options](/quasar-cli-vite/handling-vite#vite-vue-plugin-options)
- [Adding Vite plugins](/quasar-cli-vite/handling-vite#adding-vite-plugins)
- [Folder Aliases](/quasar-cli-vite/handling-vite#folder-aliases)
- [Handling import.meta.env](/quasar-cli-vite/handling-import-meta-env)
- [Filename-based Routing](/quasar-cli-vite/page-routing-with-vue-router#filename-based-routing)
- [html-minifier-terser options](https://github.com/terser/html-minifier-terser?tab=readme-ov-file#options-quick-reference)

### sourceFiles

```ts
/**
 * Use this property to change the default names of some files of your website/app if you have to.
 * All paths must be relative to the root folder of your project.
 *
 * @default
 * {
 *  rootComponent: 'src/App.vue',
 *  router: 'src/router/index',
 *  store: 'src/stores/index',
 *  pwaRegisterServiceWorker: 'src-pwa/register-sw',
 *  pwaServiceWorker: 'src-pwa/custom-sw',
 *  pwaManifestFile: 'src-pwa/manifest.json',
 *  electronMain: 'src-electron/electron-main',
 *  bexManifestFile: 'src-bex/manifest.json'
 * }
 */
interface QuasarSourceFilesConfiguration {
  rootComponent?: string
  router?: string
  store?: string
  pwaRegisterServiceWorker?: string
  pwaServiceWorker?: string
  pwaManifestFile?: string
  electronMain?: string
  bexManifestFile?: string
}
```

### htmlVariables

```ts
/** Add variables that you can use in /index.html. */
htmlVariables?: Record<string, any>;
```

You can define and then reference variables in `/index.html`, like this:

```js /quasar.config file
import { defineConfig } from '#q-app'

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

### Quasar Mode Specific

| Property  | Type   | Description                                                                                               |
| --------- | ------ | --------------------------------------------------------------------------------------------------------- |
| cordova   | Object | Cordova specific [config](/quasar-cli-vite/developing-cordova-apps/configuring-cordova).                  |
| capacitor | Object | Quasar CLI Capacitor specific [config](/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor). |
| pwa       | Object | PWA specific [config](/quasar-cli-vite/developing-pwa/configuring-pwa).                                   |
| ssr       | Object | SSR specific [config](/quasar-cli-vite/developing-ssr/configuring-ssr).                                   |
| electron  | Object | Electron specific [config](/quasar-cli-vite/developing-electron-apps/configuring-electron).               |
| bex       | Object | BEX specific [config](/quasar-cli-vite/developing-browser-extensions/configuring-bex).                    |

## Other Useful Links

- [Handling Vite](/quasar-cli-vite/handling-vite#adding-vite-plugins)
- [Handling import.meta.env](/quasar-cli-vite/handling-import-meta-env)
