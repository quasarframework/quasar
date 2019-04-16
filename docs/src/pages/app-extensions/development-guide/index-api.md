---
title: App Extension Index API
---

This page refers to `src/index.js` file, which is executed on `quasar dev` and `quasar build`. This is the main process where you can modify the build to suit the needs of your App Extension. For instance, registering a boot file, modifying the webpack process, registering CSS, registering a UI component, registering a Quasar CLI command, etc.

Example of basic structure of the file:

```js
module.exports = function (api, ctx) {
  // props & methods for "api" Object described below;
  // ctx is same as that of /quasar.conf.js
}
```

## api.ctx
Same as the `ctx` from `/quasar.conf.js`. Helps you make decisions based on the context in which `quasar dev` or `quasar build` runs.

Example: You might want to use one of the api methods if running for electron mode only.

```js
if (api.ctx.dev === true && api.ctx.mode === 'electron') {
  api.beforeDev(() => {
    // do something when running quasar dev and
    // with Electron mode
  })
}
```

## api.extId
Contains the `ext-id` (String) of this App Extension.

## api.quasarAppVersion
Contains the exact `@quasar/app` package version in String format.

## api.prompts
Is an Object which has the answers to the prompts when this App Extension got installed. For more info on prompts, check out [Prompts API](/app-extensions/development-guide/prompts).

## api.resolve
Resolves paths within the app on which this App Extension is running. Eliminates the need to import `path` and resolve the paths yourself.

```js
// resolves to root of app
api.resolve.app('src/my-file.js')

// resolves to root/src of app
api.resolve.src('my-file.js')

// resolves to root/src-pwa of app
api.resolve.pwa('some-file.js')

// resolves to root/src-ssr of app
api.resolve.ssr('some-file.js')

// resolves to root/src-cordova of app
api.resolve.cordova('config.xml')

// resolves to root/src-electron of app
api.resolve.electron('some-file.js')
```

## api.appDir
Contains the full path (String) to the root of the app on which this App Extension is running.

## api.compatibleWithQuasarApp
Ensure the App Extension is compatible with locally installed @quasar/app through a semver condition.

If the semver condition is not met, then @quasar/app errors out and halts execution.

Example of semver condition: `'1.x || >=2.5.0 || 5.0.0 - 7.2.3'`.

```js
/**
 * @param {string} semverCondition
 */
api.compatibleWithQuasarApp('1.x')
```

## api.hasExtension
Check if another app extension is installed.

```js
/**
 * Check if another app extension is installed
 *
 * @param {string} extId
 * @return {boolean} has the extension installed.
 */
if (api.hasExtension(extId)) {
  // hey, we have it
}
```

## api.extendQuasarConf
Extends quasar.conf.js

```js
/**
 * @param {function} fn
 *   (cfg: Object, ctx: Object) => undefined
 */
api.extendQuasarConf ((cfg, ctx) => {
  // do something with quasar.conf.js:
  // add, change anything
})
```

### Registering boot and css files and a directive

```
module.exports = function (api, ctx) {
  api.extendQuasarConf((conf) => {
    // make sure directives needed are compiled into app project
    if (!conf.directives.includes('CloseMenu')) {
      conf.directives.push('CloseMenu')
    }

    // make sure my-ext boot file is registered
    conf.boot.push('~quasar-app-extension-my-ext/src/boot/qmarkdown.js')
    // make sure boot file transpiles
    conf.build.transpileDependencies.push(/quasar-app-extension-my-ext[\\/]src[\\/]boot/)

    // make sure my-ext css goes through webpack to avoid ssr issues
    conf.css.push('~quasar-app-extension-qmarkdown/src/component/my-ext.styl')
  })
}
```

::: tip
Notice the tidle (`~`) in front of the paths. This tells Quasar CLI that the path is a dependency from node_modules instead of a relative path to App Extension index script file.
:::

::: tip
Always check for the existence of anything you need added to the conf file before adding it (like directives). The developer might have added it already in his `/quasar.conf.js`.
:::

## api.chainWebpack
Chain webpack config

```js
/**
 * @param {function} fn
 *   (cfg: ChainObject, invoke: Object {isClient, isServer}) => undefined
 */
api.chainWebpack((cfg, { isClient, isServer }) => {
  // add/remove/change cfg (Webpack chain Object)
})
```

## api.extendWebpack
Extend webpack config

```js
/**
 * @param {function} fn
 *   (cfg: Object, invoke: Object {isClient, isServer}) => undefined
 */
api.extendWebpack((cfg, { isClient, isServer }) => {
  // add/remove/change cfg (Webpack configuration Object)
})
```

## api.chainWebpackMainElectronProcess
Chain webpack config of main electron process

```js
/**
 * @param {function} fn
 *   (cfg: ChainObject) => undefined
 */
api.chainWebpackMainElectronProcess((cfg, { isClient, isServer }) => {
  // add/remove/change cfg (Webpack chain Object)
})
```

## api.extendWebpackMainElectronProcess
Extend webpack config Object of main electron process

```js
/**
 * @param {function} fn
 *   (cfg: Object) => undefined
 */
api.extendWebpackMainElectronProcess((cfg, { isClient, isServer }) => {
  // add/remove/change cfg (Webpack configuration Object)
})
```

## api.registerCommand
Register a command that will become available as `quasar run <ext-id> <cmd> [args]`.

```js
/**
 * @param {string} commandName
 * @param {function} fn
 *   (args: { [ string ] }, params: {object} }) => ?Promise
 */
api.registerCommand('start', (args, params) => {
  // do something here

  // this registers the "start" command
  // and this handler is executed when running
  // "$ quasar ext run <ext-id> start
})
```

## api.registerDescribeApi
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

## api.beforeDevStart
Prepare external services before `$ quasar dev` command runs, like starting some backend or any other service that the app relies on.

```js
/**
 * @param {function} fn
 *   () => ?Promise
 */
api.beforeDevStart(() => {
  // do something
})
```

## api.beforeBuild

<q-badge label="@quasar/app v1.0.0-beta.16+" />

Run hook before Quasar builds app for production (`$ quasar build`). At this point, the distributables folder hasn't been created yet.

```js
/**
 * @param {function} fn
 *   () => ?Promise
 */
api.beforeBuild(() => {
  // do something
})
```

## api.afterBuild

<q-badge label="@quasar/app v1.0.0-beta.16+" />

Run hook after Quasar built app for production (`$ quasar build`). At this point, the distributables folder has been created and is available should you wish to do something with it.

```js
/**
 * @param {function} fn
 *   () => ?Promise
 */
api.afterBuild(() => {
  // do something
})
```
