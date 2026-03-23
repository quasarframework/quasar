---
title: App Extension Prompts API
desc: Syntax of the questions that the user is going to be asked in order to configure the Quasar App Extension.
---

This page refers to `src/prompts.js` file which handles the prompts when installing the App Extension. Not all App Extensions will need prompts -- this is an optional step.

The user's answers are stored into `/quasar.extensions.json` (root of project folder), which should not be tampered with unless you really know what you are doing.

Example of basic structure of the file:

```js
// For @quasar/app-vite 1.6+ and @quasar/app-webpack v3.11+
//   1. It can be async
//   2. It receives the "api" param
export default function (api) {
  return [
    // questions
  ]
}
```

You will have access to `api.prompts` (which holds your App Extension's answers) in [Install](/app-extensions/development-guide/install-api), [Index](/app-extensions/development-guide/index-api) and [Uninstall](/app-extensions/development-guide/uninstall-api).

Let's now focus on the structure of the returned Array which defines the questions. The sections below offer examples for the most used types of questions.

## Questions format

::: warning
The following is not an exhaustive list of possible types of questions and by no means it describes the full API available. Check out [Inquirer.js](https://github.com/SBoudrias/Inquirer.js#readme) for that (which is used by Quasar CLI under the hood).
:::

### String

```js
{
  // "description" will be the variable
  // storing the answer
  name: 'description'
  type: 'input',
  required: false, // optional
  message: 'Project description',
  default: 'A Quasar Framework app', // optional
}
```

```js
{
  name: 'source_build',
  type: 'input',
  required: true, // optional
  message:
    'If you want a separate file to be the source image during production, please specify it here: ',
  validate: (input) => {
    // ...do something ...
  },
  default: (answers) => {
    return answers.source_dev || defaultImg
  }
}
```

### Confirm

```js
{
  // "featureX" will be the variable
  // storing the answer
  name: 'featureX',
  type: 'confirm',
  message: 'Use Feature X?',
  default: true // optional
}
```

### List of choices

```js
{
  // "iconSet" will be the variable
  // storing the answer
  name: 'iconSet',
  type: 'list',
  message: 'Choose Icon Set',
  choices: [
    {
      name: 'Material Icons (recommended)',
      value: 'material-icons', // value of the answer variable
      short: 'Material Icons' // Short name displayed after user picks this
    },
    {
      name: 'Fontawesome v6',
      value: 'fontawesome-v6', // value of the answer variable
      short: 'Fontawesome v6' // Short name displayed after user picks this
    }
    // ... all other choices
  ]
}
```

## The API param <q-badge label="@quasar/app-vite 1.6+" /> <q-badge label="@quasar/app-webpack 3.11+" />

::: warning COMPATIBILITY WARNING
The `api` param has been introduced in @quasar/app-vite v1.6+ and @quasar/app-webpack v3.11+.

Older versions of these CLIs will not supply any param.
:::

### api.engine

Contains the Quasar CLI engine (as String) being used. Examples: `@quasar/app-vite` or `@quasar/app-webpack`.

### api.hasVite

Boolean - is running on `@quasar/app-vite` or not.

### api.hasWebpack

Boolean - is running on `@quasar/app-webpack` or not.

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
// (@quasar/app-webpack v3.4+ or @quasar/app-vite v1+)
api.resolve.public('my-image.png')

// resolves to root/src-pwa of app
api.resolve.pwa('some-file.js')

// resolves to root/src-ssr of app
api.resolve.ssr('some-file.js')

// resolves to root/src-cordova of app
api.resolve.cordova('config.xml')

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

### api.hasLint

```js
/**
 * @return {Promise<boolean>} host project has ESLint or not
 */
await api.hasLint()
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
api.compatibleWith(packageName, '1.x')
```

```js A more complex example:
if (api.hasVite === true) {
  api.compatibleWith('@quasar/app-vite', '^2.0.0')
} else {
  api.compatbileWith('@quasar/app-webpack', '^4.0.0')
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
