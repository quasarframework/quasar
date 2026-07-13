---
title: App Extension Prompts API
desc: Syntax of the questions that the user is going to be asked in order to configure the Quasar App Extension.
---

This page refers to `/ae/src/prompts.js|ts` file which handles the prompts when installing the App Extension. Not all App Extensions will need prompts -- this is an optional step.

The user's answers are stored into `/quasar.extensions.json` (root of project folder), which should not be tampered with unless you really know what you are doing.

Example of basic structure of the file:

```js /ae/src/prompts.js (or .ts)
import { definePromptsScript } from '#q-app'

export default definePromptsScript(async (/* api */) => {
  /**
   * Use @clack/prompts, inquirer or whatever you want
   * (and make sure to PNPM install the package in /ae)
   * to prompt the user, then return the answers object
   */

  const answers = /* ...prompt user... */

  // type PromptsScriptAnswers<Key extends string = string> = Record<Key, any>
  return answers
})
```

You will have access to `api.prompts` (which holds your App Extension's answers) in [Install](/app-extensions/development-guide/install-api), [Index](/app-extensions/development-guide/index-api) and [Uninstall](/app-extensions/development-guide/uninstall-api).

## The API param

### api.ctx

Same as the `ctx` from the `/quasar.config` file.

```js api.ctx example:
{
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

If the semver condition is not met, then Quasar CLI errors out and halts execution.

Example of semver condition: `'1.x || >=2.5.0 || 5.0.0 - 7.2.3'`.

```js
/**
 * @param {string} packageName
 * @param {string} semverCondition
 */
api.compatibleWith(packageName, '3.x')
```

```js A more complex example:
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
