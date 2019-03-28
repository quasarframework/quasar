---
title: App Extension Install API
---

This page refers to `src/install.js` file which is executed on the installation of the App Extension only.

Example of basic structure of the file:

```js
module.exports = function (api) {
  // props and methods for "api" Object
  // are described below
}
```

## api.extId
Contains the `ext-id` (String) of this App Extension.

## api.quasarAppVersion
Contains the exact `@quasar/app` package version in String format.

## api.prompts
Is an Object which has the answers to the prompts when this App Extension gets installed. For more info on prompts, check out [Prompts API](/app-extensions/development-guide/prompts).

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

## api.extendPackageJson
Helper method to extend package.json with new props. If specifying existing props, **it will override** them.

```js
/**
 * @param {object|string} extPkg - Object to extend with or relative path to a JSON file
 */
api.extendPackageJson({
  scripts: {
    'electron': 'quasar dev -m electron'
  }
})
```

The above example adds an npm script to the app's package.json, so you can then execute `yarn electron` (or the equivalent `npm run electron`).

## api.extendJsonFile
Extend a JSON file with new props (deep merge). If specifying existing props, it will override them.

```js
/**
 * @param {string} file (relative path to app root folder)
 * @param {object} newData (Object to merge in)
 */
api.extendJsonFile('src/some.json', {
  newProp: 'some-value'
})
```

## api.render
Renders (copies) a folder from your App Extension templates (any folder you specify) into root of the app. Maintains the same folder structure that the template folder has.

If some of the files already exist in the app then it will ask the user if they should be overwritten or not.

Needs a relative path to the folder of the file calling render().

```js
/**
 * Render a folder from extension templates into devland.
 * Needs a relative path to the folder of the file calling render().
 *
 * @param {string} templatePath (relative path to folder to render in app)
 * @param {object} scope (optional; rendering scope variables)
 */
api.render('./path/to/a/template/folder')
```

### Using scope
You can also inject some decision-making code into the files to be rendered by interpolating with [lodash.template](https://www.npmjs.com/package/lodash.template) syntax.

Example:

```
// src/install.js
// (my-folder is located in same folder as
// the file in which following call takes place)
api.render('./my-folder', {
  prompts: api.prompts
})
```

Let's imagine we use a [Prompts API](/app-extensions/development-guide/prompts-api) file too. It asks the user if he/she wants "Feature X" and stores the answer in a variable called "featureX".

We can take some decisions on what the files that we render look like, during rendering them. This removes the need of creating two folders and deciding which to render, based on some decision.

```
// src/my-folder/some-file.js

<% if (prompts.featureX) { %>
const message = 'This is content when "Feature X" exists'
<% } else { %>
const message = 'This is content when we don\'t have "Feature X"'
<% } %>
```

Possibilities are limited only by your imagination.

## api.onExitLog
Adds a message to be printed after App CLI finishes up installing the App Extension and is about to exit.

```js
/**
 * @param {string} msg
 */
api.onExitLog('Thanks for installing my awesome extension')
```
