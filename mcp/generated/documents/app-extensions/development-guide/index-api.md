---
title: App Extension Index API
description: The API for the index script of a Quasar App Extension. Provides access to Quasar context, registers new CLI commands, extends Vite config and more.
canonical: https://quasar.dev/app-extensions/development-guide/index-api
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

This page refers to `/ae/src/index.js|ts` file, which is executed on `quasar dev` and `quasar build`. This is the main process where you can modify the build to suit the needs of your App Extension. For instance, registering a boot file, modifying the Vite configuration, registering CSS, registering a UI component, registering a Quasar CLI command, etc.

Example of basic structure of the file:

```js /ae/src/index.js (or .ts)
import { defineIndexScript } from '#q-app'

// can be async
export default defineIndexScript(api => {})
```

## The API param

### api.ctx

Same as the `ctx` from the `/quasar.config` file. Helps you make decisions based on the context in which `quasar dev` or `quasar build` runs.

Example: You might want to use one of the api methods if running for electron mode only.

```js
if (api.ctx.dev && api.ctx.mode.electron) {
  api.beforeDev(api => {
    // do something when running quasar dev and
    // with Electron mode
  })
}
```

```js api.ctx example:
{
  dev: true,
  prod: false,
  mode: { spa: true },
  modeName: 'spa',
  target: {},
  targetName: undefined,
  arch: {},
  archName: undefined,
  bundler: {},
  bundlerName: undefined,
  debug: false,
  publish: undefined,
  vueDevtools: false,
  appPaths: {
    cliDir: '...absolute path of it',
    appDir: '...absolute path of it',
    srcDir: '...absolute path of it',
    publicDir: '...absolute path of it',
    pwaDir: '...absolute path of it',
    ssrDir: '...absolute path of it',
    ssgDir: '...absolute path of it',
    cordovaDir: '...absolute path of it',
    capacitorDir: '...absolute path of it',
    electronDir: '...absolute path of it',
    bexDir: '...absolute path of it',
    quasarConfigFilename: '...absolute path of the quasar.config file',
    quasarConfigInputFormat: 'js', // or 'ts'
    resolve: {
      cli: (...paths) => theAbsolutePathToCliDir,
      app: (...paths) => theAbsolutePathToAppDir,
      src: (...paths) => theAbsolutePathToAppSrcDir,
      public: (...paths) => theAbsolutePathToPublicDir,
      pwa: (...paths) => theAbsolutePathToAppSrcPwaDir,
      ssr: (...paths) => theAbsolutePathToAppSrcSsrDir,
      ssg: (...paths) => theAbsolutePathToAppSrcSsgDir,
      cordova: (...paths) => theAbsolutePathToAppSrcCordovaDir,
      capacitor: (...paths) => theAbsolutePathToAppSrcCapacitorDir,
      electron: (...paths) => theAbsolutePathToAppSrcElectronDir,
      bex: (...paths) => theAbsolutePathToAppSrcBexDir
    }
  }
}
```

### api.extId

Contains the `ext-id` (String) of this App Extension.

### api.prompts

An object containing the answers returned by the prompts script when this App Extension was installed. For more information, see the [Prompts API](/app-extensions/development-guide/prompts-api).

### api.resolve

Resolves paths within the app on which this App Extension is running. Eliminates the need to import `path` and resolve the paths yourself.

```js
// resolves to root of app
api.resolve.app('src/my-file.js')

// resolves to root/src of app
api.resolve.src('my-file.js')

// resolves to root/public of app
api.resolve.public('my-image.png')

// resolves to root/src-pwa of app
api.resolve.pwa('some-file.js')

// resolves to root/src-ssr of app
api.resolve.ssr('some-file.js')

// resolves to root/src-ssg of app
api.resolve.ssg('some-file.js')

// resolves to root/src-cordova of app
api.resolve.cordova('config.xml')

// resolves to root/src-electron of app
api.resolve.electron('some-file.js')

// resolves to root/src-electron of app
api.resolve.electron('some-file.js')

// resolves to root/src-bex of app
api.resolve.bex('some-file.js')
```

### api.appDir

Contains the full path (String) to the root of the app on which this App Extension is running.

### api.logger

A logger scoped to this App Extension. Every method tags its output with `AE (<extId>)`, so users can see which extension printed which line.

```js
api.logger.log('hello') // green-bannered line
api.logger.warn('careful') // yellow-bannered warning
api.logger.fatal('boom') // red-bannered error; exits with code 1
api.logger.tip('try foo') // TIP-pilled tip line
api.logger.info('synced') // INFO-pilled line
api.logger.info('synced', 'SYNC') // custom pill text instead of INFO
api.logger.success('built')
api.logger.error('oh no')
api.logger.warning('hmm')

const finish = api.logger.progress({
  tool: 'ssg',
  waitAction: 'building',
  doneAction: 'built'
})
// ...later
finish() // prints the DONE line with elapsed time

api.logger.dot // the bullet character the helpers print
```

### api.hasTypescript

```js
/**
 * @return {Promise<boolean>} host project has TypeScript active or not
 */
await api.hasTypescript()
```

### api.getStorePackageName

```js
/**
 * @return {'pinia'|undefined}
 */
api.getStorePackageName()
```

### api.getNodePackagerName

```js
/**
 * @return {Promise<'npm' | 'yarn' | 'pnpm' | 'bun'>}
 */
await api.getNodePackagerName()
```

### api.compatibleWith

Ensure the App Extension is compatible with a package installed in the host app through a semver condition.

If the semver condition is not met, then `@quasar/app-vite` reports an error and halts execution.

Example of semver condition: `'1.x || >=2.5.0 || 5.0.0 - 7.2.3'`.

```js
/**
 * @param {string} packageName
 * @param {string} semverCondition
 */
api.compatibleWith('@quasar/app-vite', '3.x')
```

```js A more complex example
api.compatibleWith('@quasar/app-vite', '^3.0.0')
```

### api.hasPackage

Determine if some package is installed in the host app through a semver condition.

Example of semver condition: `'1.x || >=2.5.0 || 5.0.0 - 7.2.3'`.

```js
/**
 * @param {string} packageName
 * @param {string} (optional) semverCondition
 * @return {boolean} package is installed and meets optional semver condition
 */
if (api.hasPackage('vuelidate')) {
  // hey, this app has it (any version of it)
}
if (api.hasPackage('quasar', '^2.0.0')) {
  // hey, this app has Quasar UI v2 installed
}
```

### api.hasExtension

Check if another app extension is npm installed and Quasar CLI has invoked it.

```js
/**
 * Check if another app extension is installed
 *
 * @param {string} extId
 * @return {boolean} has the extension installed & invoked
 */
if (api.hasExtension(extId)) {
  // hey, we have it
}
```

### api.getPackageVersion

Get the version of a host app package.

```js
/**
 * @param {string} packageName
 * @return {string|undefined} version of app's package
 */
console.log(api.getPackageVersion(packageName))
// output examples:
//   1.1.3
//   undefined (when package not found)
```

### api.extendQuasarConf

Extends quasar.config file

```ts
extendQuasarConf: Callback<
  (
    cfg: QuasarConf,
    api: IndexAPI
  ) => QuasarConf | void | Promise<QuasarConf | void>
>

// Example:
api.extendQuasarConf((conf, api) => {
  // Do something with quasar.config file.
  // Optionally, return a config that will be merged
  // with the default one
})
```

#### Registering boot and css files

```js
import { defineIndexScript } from '#q-app'

export default defineIndexScript(api => {
  api.extendQuasarConf((conf, api) => {
    return {
      // make sure my-ext boot file is registered
      boot: ['~quasar-app-extension-my-ext/src/runtime/boot.register.js'],
      // make sure my global my-ext css goes through Vite
      css: ['~quasar-app-extension-my-ext/src/runtime/style.sass']
    }
  })

  // Alternatively, directly touch the "conf" param
  api.extendQuasarConf((conf, api) => {
    // make sure my-ext boot file is registered
    conf.boot.push('~quasar-app-extension-my-ext/src/runtime/boot.register.js')
    // make sure my global my-ext css goes through Vite
    conf.css.push('~quasar-app-extension-my-ext/src/runtime/style.sass')
  })
})
```

::: tip
Notice the tidle (`~`) in front of the paths. This tells Quasar CLI that the path is a dependency from node_modules instead of a relative path to App Extension index script file.
:::

### api.registerCommand

Register a command that will become available as `quasar run <ext-id> <cmd> [...args]`.

```js
/**
 * @param {string} commandName
 * @param {function} fn
 *   (processArgv: string[]) => ?Promise
 */
api.registerCommand('start', processArgv => {
  // do something here
  // this registers the "start" command
  // and this handler is executed when running
  // quasar run <ext-id> start
})
```

Example with defining and parsing arguments:

```js
// import { parseArgs } from 'node:util'

api.registerCommand('fun', () => {
  try {
    const { values, positionals } = parseArgs({
      options: {
        name: { type: 'string', short: 'n' },
        debug: { type: 'boolean' }
      },
      strict: true,
      allowPositionals: true
    })

    console.log(values, positionals)
  } catch (err) {
    console.error(err.message)
  }
})
```

### api.registerDescribeApi

Register an API file for `quasar describe` command.

```js
/**
 * @param {string} name
 * @param {string} relativePath
 *   (relative path starting from the file where you have this call)
 */
api.registerDescribeApi(
  'MyComponent',
  './relative/path/to/my/component/file.json'
)
```

The above will then respond to `quasar describe MyComponent`.

For syntax of such a JSON file, look into `/node_modules/quasar/dist/api` (in your project folder). Be aware that your JSON must contain a `type` property ("component", "directive", "plugin"). For instance:

```json
{
  "type": "component",
  "props": {
  },
  ...
}
```

::: tip
You might also want to take a look at [Quasar JSON API Schema](/app-extensions/common-formulas-and-patterns/json-api) page.
:::

::: tip
Always test with the `quasar describe` command to ensure you got the syntax right and there are no errors.
:::

### api.getPersistentConf

Get the internal persistent config of this extension. Returns empty object if it has none.

```js
/**
 * @return {object} cfg
 */
api.getPersistentConf()
```

### api.setPersistentConf

Set the internal persistent config of this extension. If it already exists, it is overwritten.

```js
/**
 * @param {object} cfg
 */
api.setPersistentConf({
  // ....
})
```

### api.mergePersistentConf

Deep merge into the internal persistent config of this extension. If extension does not have any config already set, this is essentially equivalent to setting it for the first time.

```js
/**
 * @param {object} cfg
 */
api.mergePersistentConf({
  // ....
})
```

### api.beforeDev

Prepare external services before `quasar dev` command runs, like starting some backend or any other service that the app relies on.

Can use async/await or directly return a Promise.

```js
/**
 * @param {function} fn
 *   (api, { quasarConf }) => ?Promise
 */
api.beforeDev((api, { quasarConf }) => {
  // do something
})
```

### api.afterDev

Run hook after the Quasar dev server is started (`quasar dev`). At this point, the dev server is available should you wish to do something with it.

Can use async/await or directly return a Promise.

```js
/**
 * @param {function} fn
 *   (api, { quasarConf }) => ?Promise
 */
api.afterDev((api, { quasarConf }) => {
  // do something
})
```

### api.beforeBuild

Run hook before Quasar builds app for production (`quasar build`). At this point, the distributables folder hasn't been created yet.

Can use async/await or directly return a Promise.

```js
/**
 * @param {function} fn
 *   (api, { quasarConf }) => ?Promise
 */
api.beforeBuild((api, { quasarConf }) => {
  // do something
})
```

### api.afterBuild

Run hook after Quasar built app for production (`quasar build`). At this point, the distributables folder has been created and is available should you wish to do something with it.

Can use async/await or directly return a Promise.

```js
/**
 * @param {function} fn
 *   (api, { quasarConf }) => ?Promise
 */
api.afterBuild((api, { quasarConf }) => {
  // do something
})
```

### api.onPublish

Run hook if publishing was requested (`quasar build -P`), after Quasar built app for production and the afterBuild hook (if specified) was executed.

Can use async/await or directly return a Promise.

```js
/**
 * @param {function} fn
 *   () => ?Promise
 * @param {object} opts
 *   * arg - argument supplied to "--publish"/"-P" parameter
 *   * distDir - folder where distributables were built
 */
api.onPublish((api, opts) => {
  // do something
})
```

### api.extendViteConf

```ts
/**
 * Extend the Vite config generated by Quasar CLI.
 *
 * Can be async. Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  config: ViteUserConfig,
  invokeParams: { isClient: boolean; isServer: boolean },
  api: IndexAPI
) => ViteUserConfig | void | Promise<ViteUserConfig | void>

// Example:
api.extendViteConf((viteConf, { isClient, isServer }, api) => {
  // add/remove/change Quasar CLI generated Vite config object;
  // similar in use to /quasar.config > build > extendViteConf
})
```

### api.extendSSRWebserverConf

```ts
/**
 * Extend the Rolldown config that is used for the SSR webserver
 * (which includes the SSR middlewares).
 *
 * Can be async. Can directly modify the "rolldownConf" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  config: RolldownOptions,
  api: IndexAPI
) => void | RolldownOptions | Promise<void | RolldownOptions>

// Example:
api.extendSSRWebserverConf((rolldownConf, api) => {
  // add/remove/change Quasar CLI generated Rolldown config object;
  // similar in use to /quasar.config > ssr > extendSSRWebserverConf
})
```

### api.extendSSRPackageJson <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Add/remove/change properties of SSR production generated package.json
 *
 * Can be async. Can directly modify the "pkgJson" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  pkgJson: { [index in string]: any },
  api: IndexAPI
) =>
  void | { [index in string]: any } | Promise<void | { [index in string]: any }>

// Example:
api.extendSSRPackageJson((pkgJson, api) => {
  // add/remove/change pkgJson;
  // similar in use to /quasar.config > ssr > extendSSRPackageJson
})
```

### api.extendSSRManifestJson <q-badge label="@quasar/app-vite v3.1+" />

```ts
/**
 * Extend the underlying SSR manifest file generated by Vite,
 * which is used by the server-side renderer to know which files to preload.
 *
 * Can be async. Can directly modify the "ssrManifest" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  ssrManifest: QuasarSsrManifest,
  api: IndexAPI
) => void | QuasarSsrManifest | Promise<void | QuasarSsrManifest>

// Example:
api.extendSSRManifestJson((ssrManifest, api) => {
  // add/remove/change ssrManifest;
  // similar in use to /quasar.config > ssr > extendSSRManifestJson
})
```

### api.extendSSRGenerateSWOptions <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Extend/configure the Workbox GenerateSW options
 * Specify Workbox options which will be applied on top of
 *  `pwa > extendPWAGenerateSWOptions()`.
 *
 * https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
 *
 * Can be async. Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  config: GenerateSWOptions,
  api: IndexAPI
) => void | GenerateSWOptions | Promise<void | GenerateSWOptions>

// Example:
api.extendSSRGenerateSWOptions((config, api) => {
  // add/remove/change config;
  // similar in use to /quasar.config > ssr > extendSSRGenerateSWOptions
})
```

### api.extendSSRInjectManifestOptions <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Extend/configure the Workbox InjectManifest options
 * Specify Workbox options which will be applied on top of
 *  `pwa > extendPWAInjectManifestOptions()`.
 *
 * https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
 *
 * Can be async. Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  config: InjectManifestOptions,
  api: IndexAPI
) => void | InjectManifestOptions | Promise<void | InjectManifestOptions>

// Example:
api.extendSSRInjectManifestOptions((config, api) => {
  // add/remove/change config;
  // similar in use to /quasar.config > ssr > extendSSRInjectManifestOptions
})
```

### api.extendSSGRendererConf <q-badge label="@quasar/app-vite v3.1+" />

```ts
/**
 * Extend the Rolldown config that is used for the SSG renderer,
 * which is your /src-ssg/ssg-renderer file.
 *
 * Can be async. Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  config: RolldownOptions,
  api: IndexAPI
) => void | RolldownOptions | Promise<void | RolldownOptions>

// Example:
api.extendSSGRendererConf((rolldownConf, api) => {
  // add/remove/change Quasar CLI generated Rolldown config object;
  // similar in use to /quasar.config > ssg > extendSSGRendererConf
})
```

### api.extendSSGManifestJson <q-badge label="@quasar/app-vite v3.1+" />

```ts
/**
 * Extend the underlying SSR manifest file generated by Vite,
 * which is used by the server-side renderer to know which files to preload.
 *
 * Can be async. Can directly modify the "ssrManifest" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  ssrManifest: QuasarSsrManifest,
  api: IndexAPI
) => void | QuasarSsrManifest | Promise<void | QuasarSsrManifest>

// Example:
api.extendSSGManifestJson((ssrManifest, api) => {
  // add/remove/change ssrManifest;
  // similar in use to /quasar.config > ssg > extendSSGManifestJson
})
```

### api.extendSSGGenerateSWOptions <q-badge label="@quasar/app-vite v3.1+" />

```ts
/**
 * Extend/configure the Workbox GenerateSW options
 * Specify Workbox options which will be applied on top of
 *  `pwa > extendPWAGenerateSWOptions()`.
 *
 * https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
 *
 * Can be async. Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  config: GenerateSWOptions,
  api: IndexAPI
) => void | GenerateSWOptions | Promise<void | GenerateSWOptions>

// Example:
api.extendSSGGenerateSWOptions((config, api) => {
  // add/remove/change config;
  // similar in use to /quasar.config > ssg > extendSSGGenerateSWOptions
})
```

### api.extendSSGInjectManifestOptions <q-badge label="@quasar/app-vite v3.1+" />

```ts
/**
 * Extend/configure the Workbox InjectManifest options
 * Specify Workbox options which will be applied on top of
 *  `pwa > extendPWAInjectManifestOptions()`.
 *
 * https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
 *
 * Can be async. Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  config: InjectManifestOptions,
  api: IndexAPI
) => void | InjectManifestOptions | Promise<void | InjectManifestOptions>

// Example:
api.extendSSGInjectManifestOptions((config, api) => {
  // add/remove/change config;
  // similar in use to /quasar.config > ssg > extendSSGInjectManifestOptions
})
```

### api.extendElectronMainConf

```ts
/**
 * Extend the Rolldown config that is used for the electron-main thread.
 *
 * Can be async. Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  config: RolldownOptions,
  api: IndexAPI
) => void | RolldownOptions | Promise<void | RolldownOptions>

// Example:
api.extendElectronMainConf((rolldownConf, api) => {
  // add/remove/change Quasar CLI generated Rolldown config object;
  // similar in use to /quasar.config > electron > extendElectronMainConf
})
```

### api.extendElectronPreloadConf

```ts
/**
 * Extend the Rolldown config that is used for the electron-preload thread.
 *
 * Can be async. Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  config: RolldownOptions,
  api: IndexAPI
) => void | RolldownOptions | Promise<void | RolldownOptions>

// Example:
api.extendElectronPreloadConf((rolldownConf, api) => {
  // add/remove/change Quasar CLI generated Rolldown config object;
  // similar in use to /quasar.config > electron > extendElectronPreloadConf
})
```

### api.extendElectronPackageJson <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Add/remove/change properties of Electron production generated package.json
 *
 * Can be async. Can directly modify the "pkgJson" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  pkgJson: { [index in string]: any },
  api: IndexAPI
) =>
  void | { [index in string]: any } | Promise<void | { [index in string]: any }>

// Example:
api.extendElectronPackageJson((pkgJson, api) => {
  // add/remove/change pkgJson;
  // similar in use to /quasar.config > electron > extendElectronPackageJson
})
```

### api.extendPWACustomSWConf

```ts
/**
 * Extend the Rolldown config that is used for the custom service worker
 * (if using it through workboxMode: 'InjectManifest').
 *
 * Can be async. Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  config: RolldownOptions,
  api: IndexAPI
) => void | RolldownOptions | Promise<void | RolldownOptions>

// Example:
api.extendPWACustomSWConf((rolldownConf, api) => {
  // add/remove/change Quasar CLI generated Rolldown config object;
  // similar in use to /quasar.config > pwa > extendPWACustomSWConf
})
```

### api.extendPWAManifestJson <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Should you need some dynamic changes to the /src-pwa/manifest.json,
 * use this method to do it.
 *
 * Can be async. Can directly modify the "json" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  json: PwaManifestOptions,
  api: IndexAPI
) => void | PwaManifestOptions | Promise<void | PwaManifestOptions>

// Example:
api.extendPWAManifestJson((json, api) => {
  // add/remove/change json;
  // similar in use to /quasar.config > pwa > extendPWAManifestJson
})
```

### api.extendPWAGenerateSWOptions <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Extend/configure the Workbox GenerateSW options.
 *
 * Can be async. Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  config: GenerateSWOptions,
  api: IndexAPI
) => void | GenerateSWOptions | Promise<void | GenerateSWOptions>

// Example:
api.extendPWAGenerateSWOptions((config, api) => {
  // add/remove/change config;
  // similar in use to /quasar.config > pwa > extendPWAGenerateSWOptions
})
```

### api.extendPWAInjectManifestOptions <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Extend/configure the Workbox InjectManifest options.
 *
 * Can be async. Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  config: InjectManifestOptions,
  api: IndexAPI
) => void | InjectManifestOptions | Promise<void | InjectManifestOptions>

// Example:
api.extendPWAInjectManifestOptions((config, api) => {
  // add/remove/change config;
  // similar in use to /quasar.config > pwa > extendPWAInjectManifestOptions
})
```

### api.extendBexScriptsConf

```ts
/**
 * Extend the Rolldown config that is used for the bex scripts
 * (background, content scripts, dom script).
 *
 * Can be async. Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  config: RolldownOptions,
  api: IndexAPI
) => void | RolldownOptions | Promise<void | RolldownOptions>

// Example:
api.extendBexScriptsConf((rolldownConf, api) => {
  // add/remove/change Quasar CLI generated Rolldown config object;
  // similar in use to /quasar.config > bex > extendBexScriptsConf
})
```

### api.extendBexManifestJson <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Should you need some dynamic changes to the Browser Extension manifest file
 * (/src-bex/manifest.json) then use this method to do it.
 *
 * Can be async. Can directly modify the "json" parameter or
 * return a new one that will be merged with the default one.
 */
type Callback = (
  json: object,
  api: IndexAPI
) => void | object | Promise<void | object>

// Example:
api.extendBexManifestJson((json, api) => {
  // add/remove/change json;
  // similar in use to /quasar.config > bex > extendBexManifestJson
})
```
