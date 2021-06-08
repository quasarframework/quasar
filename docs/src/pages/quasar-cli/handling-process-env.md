---
title: Handling process.env
desc: How to differentiate the runtime procedure based on process.env in a Quasar app.
---

Accessing `process.env` can help you in many ways:
  * differentiating runtime procedure depending on Quasar Mode (SPA/PWA/Cordova/Electron)
  * differentiating runtime procedure depending if running a dev or production build
  * adding flags to it based on terminal environment variables at build time

## Values supplied by Quasar CLI

| Name | Type | Meaning |
| --- | --- | --- |
| `process.env.DEV` | Boolean | Code runs in development mode |
| `process.env.PROD` | Boolean | Code runs in production mode |
| `process.env.DEBUGGING` | Boolean | Code runs in development mode or `--debug` flag was set for production mode |
| `process.env.CLIENT` | Boolean | Code runs on client (not on server) |
| `process.env.SERVER` | Boolean | Code runs on server (not on client) |
| `process.env.MODE` | String | Quasar CLI mode (`spa`, `pwa`, ...) |
| `process.env.NODE_ENV` | String | Has two possible values: `production` or `development` |

## Example

```js
if (process.env.DEV) {
  console.log(`I'm on a development build`)
}

// process.env.MODE is the <mode> in
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

When compiling your website/app, `if ()` branches depending on process.env are evaluated and if the expression is `false` then they get stripped out of the file. Example:

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

You can add your own definitions to `process.env` through `/quasar.conf.js` file.

But first, there's two concepts that need to be understood here. The env variables from the terminal that are available in `/quasar.conf.js` file itself and the environment variables that you pass to your UI code.

```js
// quasar.conf.js

// Accessing terminal variables
console.log(process.env)

module.exports = function (ctx) {
  return {
    // ...

    build: {
      // passing down to UI code from quasar.conf.js
      env: {
        API: ctx.dev
          ? 'https://dev.api.com'
          : 'https://prod.api.com'
      }
    }
  }
}
```

Then in your website/app you can access `process.env.API` and it's gonna point to one of those two links above, based on dev or production build type.

You can even go one step further. Supply it with values taken from the `quasar dev/build` env variables:

```
# we set an env variable in terminal
$ MY_API=api.com quasar build

# then we pick it up in /quasar.conf.js
build: {
  env: {
    API: ctx.dev
      ? 'https://dev.' + process.env.MY_API
      : 'https://prod.' + process.env.MY_API
  }
}
```

#### Using dotenv

Should you wish to use `.env` file(s), you can even use [dotenv](https://www.npmjs.com/package/dotenv) package. The following is just an example that passes env variables from the terminal right down to your UI's app code:

```bash
$ yarn add --dev dotenv
```

Then in your `/quasar.conf.js`:

```
build: {
  env: require('dotenv').config().parsed
}
```

Be sure to read the [dotenv documentation](https://www.npmjs.com/package/dotenv) and create the necessary .env files in the root of your Quasar CLI project.
