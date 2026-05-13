---
title: App Extension Index API
desc: The API for the index script of a Quasar App Extension. Provides access to Quasar context, registers new CLI commands, extends Vite config and more.
---

This page refers to `src/index.js` (or `src/index.ts`) file, which is executed on `quasar dev` and `quasar build`. This is the main process where you can modify the build to suit the needs of your App Extension. For instance, registering a boot file, modifying the Vite configuration, registering CSS, registering a UI component, registering a Quasar CLI command, etc.

Example of basic structure of the file:

```tabs
<<| js src/index.js |>>
// can be async
export default function (api) {
  // props & methods for "api" Object described below
}
<<| ts src/index.ts |>>
import type { IndexAPI } from '@quasar/app-vite'

// can be async
export default function (api: IndexAPI) {
  // props & methods for "api" Object described below
}
```

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

### api.engine

Contains the Quasar CLI engine (as String) being used. Example: `@quasar/app-vite` (or legacy `@quasar/app-webpack`).

### api.hasVite

Boolean - is running on `@quasar/app-vite` or not.

### api.hasWebpack <q-badge label="legacy" />

Boolean - is running on `@quasar/app-webpack` or not.

### api.extId

Contains the `ext-id` (String) of this App Extension.

### api.prompts

Is an Object which has the answers to the prompts when this App Extension got installed. For more info on prompts, check out [Prompts API](/app-extensions/development-guide/prompts-api).

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

### api.hasTypescript

```js
/**
 * @return {Promise<boolean>} host project has Typescript active or not
 */
await api.hasTypescript()
```

### api.getStorePackageName

```js
/**
 * @return {Promise<string|undefined>} 'pinia' | 'vuex' | undefined
 */
await api.getStorePackageName()
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

If the semver condition is not met, then `@quasar/app-vite` (or `@quasar/app-webpack`) errors out and halts execution.

Example of semver condition: `'1.x || >=2.5.0 || 5.0.0 - 7.2.3'`.

```js
/**
 * @param {string} packageName
 * @param {string} semverCondition
 */
api.compatibleWith('@quasar/app-vite', '3.x')
```

```js A more complex example
if (api.hasVite) {
  api.compatibleWith('@quasar/app-vite', '^3.0.0')
} else {
  api.compatibleWith('@quasar/app-webpack', '^4.0.0')
}
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

```js A more complex example:
api.extendQuasarConf((conf, api) => {
  if (api.hasVite) {
    // do something with quasar.config file that is specific
    // to @quasar/app-vite
  } else {
    // api.hasWebpack is true (legacy)
    // do something with quasar.config file that is specific
    // to @quasar/app-webpack
  }
})
```

#### Registering boot and css files

```js
export default function (api, ctx) {
  api.extendQuasarConf((conf, api) => {
    return {
      // make sure my-ext boot file is registered
      boot: ['~quasar-app-extension-my-ext/src/boot/my-ext-bootfile.js'],
      // make sure my-ext css goes through Vite
      css: ['~quasar-app-extension-my-ext/src/component/my-ext.sass']
    }
  })

  // Alternatively, directly touch the "conf" param
  api.extendQuasarConf((conf, api) => {
    // make sure my-ext boot file is registered
    conf.boot.push('~quasar-app-extension-my-ext/src/boot/my-ext-bootfile.js')

    // make sure my-ext css goes through Vite
    conf.css.push('~quasar-app-extension-my-ext/src/component/my-ext.sass')
  })
}
```

::: tip
Notice the tidle (`~`) in front of the paths. This tells Quasar CLI that the path is a dependency from node_modules instead of a relative path to App Extension index script file.
:::

### api.registerCommand

Register a command that will become available as `quasar run <ext-id> <cmd> [args]` (or the short form: `quasar <ext-id> <cmd> [args]`).

```js
/**
 * @param {string} commandName
 * @param {function} fn
 *   ({ args: [ string, ... ], params: {object} }) => ?Promise
 */
api.registerCommand('start', ({ args, params }) => {
  // do something here
  // this registers the "start" command
  // and this handler is executed when running
  // $ quasar run <ext-id> start
})
```

### api.registerDescribeApi

Register an API file for `$ quasar describe` command.

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

The above will then respond to `$ quasar describe MyComponent`.

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

Prepare external services before `$ quasar dev` command runs, like starting some backend or any other service that the app relies on.

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

Run hook after Quasar dev server is started (`$ quasar build`). At this point, the dev server has been started and is available should you wish to do something with it.

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

Run hook before Quasar builds app for production (`$ quasar build`). At this point, the distributables folder hasn't been created yet.

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

Run hook after Quasar built app for production (`$ quasar build`). At this point, the distributables folder has been created and is available should you wish to do something with it.

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

Run hook if publishing was requested (`$ quasar build -P`), after Quasar built app for production and the afterBuild hook (if specified) was executed.

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

## @quasar/app-vite only

### api.extendViteConf

```ts
/**
 * Extend the Vite config generated by Quasar CLI.
 *
 * Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
api.extendViteConf: (
  config: ViteUserConfig,
  invokeParams: { isClient: boolean, isServer: boolean },
  api
) => ViteUserConfig | void | Promise<ViteUserConfig | void>;

// Example:
api.extendViteConf((viteConf, { isClient, isServer }, api) => {
  // add/remove/change Quasar CLI generated Vite config object
})
```

### api.extendSSRWebserverConf

```ts
/**
 * Extend the Rolldown config that is used for the SSR webserver
 * (which includes the SSR middlewares).
 *
 * Can directly modify the "rolldownConf" parameter or
 * return a new one that will be merged with the default one.
 */
api.extendSSRWebserverConf: (
  config: RolldownOptions,
  api
) => void | RolldownOptions | Promise<void | RolldownOptions>;

// Example:
api.extendSSRWebserverConf((rolldownConf, api) => {
  // add/remove/change Quasar CLI generated Rolldown config object
})
```

### api.extendSSRPackageJson <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Add/remove/change properties of SSR production generated package.json
 *
 * Can directly modify the "pkgJson" parameter or
 * return a new one that will be merged with the default one.
 */
api.extendSSRPackageJson: (
  pkgJson: { [index in string]: any },
  api: IndexAPI
) =>
  | void
  | { [index in string]: any }
  | Promise<void | { [index in string]: any }>;

// Example:
api.extendSSRPackageJson((pkgJson, api) => {
  // add/remove/change pkgJson
})
```

### api.extendSSRGenerateSWOptions <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Extend/configure the Workbox GenerateSW options
 * Specify Workbox options which will be applied on top of
 *  `pwa > extendPWAGenerateSWOptions()`.
 * More info: https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
 *
 * Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
api.extendSSRGenerateSWOptions: (
  config: GenerateSWOptions,
  api: IndexAPI
) => void | GenerateSWOptions | Promise<void | GenerateSWOptions>;

// Example:
api.extendSSRGenerateSWOptions((config, api) => {
  // add/remove/change config
})
```

### api.extendSSRInjectManifestOptions <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Extend/configure the Workbox InjectManifest options
 * Specify Workbox options which will be applied on top of
 *  `pwa > extendPWAInjectManifestOptions()`.
 * More info: https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
 *
 * Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
api.extendSSRInjectManifestOptions: (
  config: InjectManifestOptions,
  api: IndexAPI
) => void | InjectManifestOptions | Promise<void | InjectManifestOptions>;

// Example:
api.extendSSRInjectManifestOptions((config, api) => {
  // add/remove/change config
})
```

### api.extendElectronMainConf

```ts
/**
 * Extend the Rolldown config that is used for the electron-main thread.
 *
 * Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
api.extendElectronMainConf: (
  config: RolldownOptions,
  api
) => void | RolldownOptions | Promise<void | RolldownOptions>;

// Example:
api.extendElectronMainConf((rolldownConf, api) => {
  // add/remove/change Quasar CLI generated Rolldown config object
})
```

### api.extendElectronPreloadConf

```ts
/**
 * Extend the Rolldown config that is used for the electron-preload thread.
 *
 * Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
api.extendElectronPreloadConf: (
  config: RolldownOptions,
  api
) => void | RolldownOptions | Promise<void | RolldownOptions>;

// Example:
api.extendElectronPreloadConf((rolldownConf, api) => {
  // add/remove/change Quasar CLI generated Rolldown config object
})
```

### api.extendElectronPackageJson <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Add/remove/change properties of Electron production generated package.json
 *
 * Can directly modify the "pkgJson" parameter or
 * return a new one that will be merged with the default one.
 */
api.extendElectronPackageJson: (
  pkgJson: { [index in string]: any },
  api: IndexAPI
) =>
  | void
  | { [index in string]: any }
  | Promise<void | { [index in string]: any }>;

// Example:
api.extendElectronPackageJson((pkgJson, api) => {
  // add/remove/change pkgJson
})
```

### api.extendPWACustomSWConf

```ts
/**
 * Extend the Rolldown config that is used for the custom service worker
 * (if using it through workboxMode: 'InjectManifest').
 *
 * Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
api.extendPWACustomSWConf: (
  config: RolldownOptions,
  api
) => void | RolldownOptions | Promise<void | RolldownOptions>;

// Example:
api.extendPWACustomSWConf((rolldownConf, api) => {
  // add/remove/change Quasar CLI generated Rolldown config object
})
```

### api.extendPWAManifestJson <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Should you need some dynamic changes to the /src-pwa/manifest.json,
 * use this method to do it.
 *
 * Can directly modify the "json" parameter or
 * return a new one that will be merged with the default one.
 */
api.extendPWAManifestJson: (
  json: PwaManifestOptions,
  api: IndexAPI
) => void | PwaManifestOptions | Promise<void | PwaManifestOptions>;

// Example:
api.extendPWAManifestJson((json, api) => {
  // add/remove/change json
})
```

### api.extendPWAGenerateSWOptions <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Extend/configure the Workbox GenerateSW options.
 *
 * Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
api.extendPWAGenerateSWOptions: (
  config: GenerateSWOptions,
  api: IndexAPI
) => void | GenerateSWOptions | Promise<void | GenerateSWOptions>;

// Example:
api.extendPWAGenerateSWOptions((config, api) => {
  // add/remove/change config
})
```

### api.extendPWAInjectManifestOptions <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Extend/configure the Workbox InjectManifest options.
 *
 * Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
api.extendPWAInjectManifestOptions: (
  config: InjectManifestOptions,
  api: IndexAPI
) => void | InjectManifestOptions | Promise<void | InjectManifestOptions>;

// Example:
api.extendPWAInjectManifestOptions((config, api) => {
  // add/remove/change config
})
```

### api.extendBexScriptsConf

```ts
/**
 * Extend the Rolldown config that is used for the bex scripts
 * (background, content scripts, dom script).
 *
 * Can directly modify the "config" parameter or
 * return a new one that will be merged with the default one.
 */
api.extendBexScriptsConf: (
  config: RolldownOptions,
  api
) => void | RolldownOptions | Promise<void | RolldownOptions>;

// Example:
api.extendBexScriptsConf((rolldownConf, api) => {
  // add/remove/change Quasar CLI generated Rolldown config object
})
```

### api.extendBexManifestJson <q-badge label="@quasar/app-vite v3+" />

```ts
/**
 * Should you need some dynamic changes to the Browser Extension manifest file
 * (/src-bex/manifest.json) then use this method to do it.
 *
 * Can directly modify the "json" parameter or
 * return a new one that will be merged with the default one.
 */
api.extendBexManifestJson: (
  json: object,
  api: IndexAPI
) => void | object | Promise<void | object>;

// Example:
api.extendBexManifestJson((json, api) => {
  // add/remove/change json
})
```
