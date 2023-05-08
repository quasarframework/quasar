---
title: Handling process.env
desc: (@quasar/app-vite) How to differentiate the runtime procedure based on process.env in a Quasar app.
---

Using `process.env` can help you in many ways:
  * differentiating runtime procedure depending on Quasar Mode (SPA/PWA/Cordova/Electron)
  * differentiating runtime procedure depending if running a dev or production build
  * adding flags to it based on terminal environment variables at build time

## Values provided by Quasar CLI

| `process.env.<name>` | Type | Meaning |
| --- | --- | --- |
| `DEV` | Boolean | Code runs in development mode |
| `PROD` | Boolean | Code runs in production mode |
| `DEBUGGING` | Boolean | Code runs in development mode or `--debug` flag was set for production mode |
| `CLIENT` | Boolean | Code runs on client (not on server) |
| `SERVER` | Boolean | Code runs on server (not on client) |
| `MODE` | String | Quasar CLI mode (`spa`, `pwa`, ...) |
| `NODE_ENV` | String | Has two possible values: `production` or `development` |

## Vite's built-in ".env"

More info [here](https://vitejs.dev/guide/env-and-mode.html).

## Example

```js
if (process.env.DEV) {
  console.log(`I'm on a development build`)
}

// process.env. MODE is the <mode> in
// "quasar dev/build -m <mode>"
// (defaults to 'spa' if -m parameter is not specified)

if (process.env.MODE === 'electron') {
  const { BrowserWindow } = require('@electron/remote')
  const win = BrowserWindow.getFocusedWindow()

  if (win.isMaximized()) {
    win.unmaximize()
  }
  else {
    win.maximize()
  }
}
```

## Stripping out code

When compiling your website/app, `if ()` branches depending on process.env are evaluated, and if the expression is `false`, they get stripped out of the file. Example:

```js
if (process.env.DEV) {
  console.log('dev')
}
else {
  console.log('build')
}

// running with "quasar dev" will result in:
console.log('dev')
// while running with "quasar build" will result in:
console.log('build')
```

Notice above that the `if`s are evaluated and also completely stripped out at compile-time, resulting in a smaller bundle.

## Import based on process.env

You can combine what you learned in the section above with dynamic imports:

```js
if (process.env.MODE === 'electron') {
  import('my-fancy-npm-package').then(package => {
    // notice "default" below, which is the prop with which
    // you can access what your npm imported package exports
    package.default.doSomething()
  })
}
```

## Adding to process.env

You can add your own definitions to `process.env` through the `/quasar.config.js` file.

It's important to understand the different types of environment variables.

* The env variables from the terminal that are defined in the `/quasar.config.js` file
* The environment variables that you pass to your UI code

```js
// quasar.config.js

// Accessing terminal variables
console.log(process.env)

module.exports = function (ctx) {
  return {
    // ...

    build: {
      // passing down to UI code from quasar.config.js
      env: {
        API: ctx.dev
          ? 'https://dev.api.com'
          : 'https://prod.api.com'
      }
    }
  }
}
```

Then, in your website/app, you can access `process.env. API`, and it will point to one of those two links above, depending on dev or production build type.

You can even combine it with values from the `quasar dev/build` env variables:

```bash
# we set an env variable in terminal
$ MY_API=api.com quasar build
```

```js
// then we pick it up in /quasar.config.js
build: {
  env: {
    API: ctx.dev
      ? 'https://dev.' + process.env.MY_API
      : 'https://prod.' + process.env.MY_API
  }
}
```

#### Using dotenv

Should you wish to use `.env` file(s), you can use the [dotenv](https://www.npmjs.com/package/dotenv) package. The following is an example that passes env variables from the `.env` file to your UI code:

```bash
$ yarn add --dev dotenv
```

Then, in your `/quasar.config.js`:

```js
build: {
  env: require('dotenv').config().parsed
}
```

Be sure to read the [dotenv documentation](https://www.npmjs.com/package/dotenv) and create the necessary `.env` file(s) in the root of your Quasar CLI project.

Note that the approach above will pass only what's defined in the `.env` file and nothing else. So, the ones defined in the terminal(_e.g. `MY_API=api.com quasar build`_) will not be passed nor used to override the `.env` file.

If you want to be able to override what's inside `.env` or want to make the `.env` file completely optional, you have to follow another approach. If you are using CI/CD, Docker, etc. you probably don't want to stay limited to the `.env` file. Here is an example:

```js
// quasar.config.js

// This will load from `.env` if it exists, but not override existing `process.env.*` values
require('dotenv').config()

// process.env now contains the terminal variables and the ones from the .env file
// Precedence:
//   1. Terminal variables (API_URL=https://api.com quasar build)
//   2. `.env` file
// If you want .env file to override the terminal variables,
// use `require('dotenv').config({ override: true })` instead

return {
// ...
  build: {
    env: {
      // You have to manually define all the variables you want to pass in
      API_URL: process.env.API_URL,
      // ...
    }
  }
// ...
```

## Troubleshooting

You might be getting `process is not defined` errors in the browser console if you are accessing the variables wrong or if you have a misconfiguration.

### Wrong usage

```js
// quasar.config.js > build
env: {
  FOO: 'hello',
}
```

```js
const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
process.env.FOO             // ✅ It can only replace direct usage like this

function getEnv(name) {
  return process.env[name] // ❌ It can't analyze dynamic usage
}

console.log(process)     // ❌
console.log(process.env) // ❌
// If you want to see a list of available env variables,
// you can log the object you are passing to `build > env` inside `quasar.config.js`

console.log(process.env.FOO) // ✅
console.log(process.env.foo) // ❌ Case sensitive
console.log(process.env.F0O) // ❌ Typo in the variable name (middle o is 0(zero))
```

### Misconfiguration

#### Manual definition

```js
// quasar.config.js > build
env: {
  FOO: 'hello',
}
```

```js
console.log(process.env.FOO) // ✅
console.log(process.env.BAR) // ❌ It's not defined in `build > env`
```

#### dotenv

```js
// quasar.config.js > build
env: require('dotenv').config(/* ... */).parsed
```

If the `.env` doesn't exist or there is a typo in the file name:

```js
console.log(process.env.FOO) // ❌ The .env file is not loaded, this will fail
```

If the `.env` file exists with the correct name, and has the following content:

```bash
FOO=hello
```

```js
console.log(process.env.FOO) // ✅ It's loaded correctly from the `.env` file
console.log(process.env.BAR) // ❌ It's not defined in the `.env` file
```
