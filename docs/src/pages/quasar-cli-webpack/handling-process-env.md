---
title: Handling process.env
desc: (@quasar/app-webpack) How to differentiate the runtime procedure based on process.env in a Quasar app.
---

Accessing `process.env` can help you in many ways:

- differentiating runtime procedure depending on Quasar Mode (SPA/PWA/Cordova/Electron)
- differentiating runtime procedure depending if running a dev or production build
- adding flags to it based on terminal environment variables at build time

## Values supplied by Quasar CLI

| `process∙env∙<name>` | Type    | Meaning                                                                                      |
| -------------------- | ------- | -------------------------------------------------------------------------------------------- |
| `DEV`                | Boolean | Code runs in development mode                                                                |
| `PROD`               | Boolean | Code runs in production mode                                                                 |
| `DEBUGGING`          | Boolean | Code runs in development mode or `--debug` flag was set for production mode                  |
| `CLIENT`             | Boolean | Code runs on client (not on server)                                                          |
| `SERVER`             | Boolean | Code runs on server (not on client)                                                          |
| `MODE`               | String  | Quasar CLI mode (`spa`, `pwa`, ...)                                                          |
| `NODE_ENV`           | String  | Has two possible values: `production` or `development`                                       |
| `TARGET`             | String  | Can be `ios` or `android` for Cordova/Capacitor modes and `chrome` or `firefox` for BEX mode |

## Example

```js
if (process.env.DEV) {
  console.log(`I'm on a development build`)
}

// process∙env∙MODE is the <mode> in
// "quasar dev/build -m <mode>"
// (defaults to 'spa' if -m parameter is not specified)

if (process.env.MODE === 'electron') {
  const { BrowserWindow } = require('@electron/remote')
  const win = BrowserWindow.getFocusedWindow()

  if (win.isMaximized()) {
    win.unmaximize()
  } else {
    win.maximize()
  }
}
```

## Stripping out code

When compiling your website/app, `if ()` branches depending on process.env are evaluated and if the expression is `false` then they get stripped out of the file. Example:

```js
if (process.env.DEV) {
  console.log('dev')
} else {
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

You can add your own definitions to `process.env` through the `/quasar.config` file.

But first, there's two concepts that need to be understood here. The env variables from the terminal that are available in the `/quasar.config` file itself and the environment variables that you pass to your UI code.

```js /quasar.config file
// Accessing terminal variables
console.log(process.env)

export default defineConfig(ctx => {
  return {
    // ...

    build: {
      // passing down to UI code from the quasar.config file
      env: {
        API: ctx.dev ? 'https://dev.api.com' : 'https://prod.api.com'
      }
    }
  }
})
```

Then in your website/app you can access `process∙env∙API` and it's gonna point to one of those two links above, based on dev or production build type.

You can even go one step further. Supply it with values taken from the `quasar dev/build` env variables:

```bash
# we set an env variable in terminal
$ MY_API=api.com quasar build
```

```js
// then we pick it up in the /quasar.config file
build: {
  env: {
    API: ctx.dev
      ? 'https://dev.' + process.env.MY_API
      : 'https://prod.' + process.env.MY_API
  }
}
```

#### The env dotfiles support

Expanding a bit on the env dotfiles support. These files will be detected and used (the order matters):

```
.env                                # loaded in all cases
.env.local                          # loaded in all cases, ignored by git
.env.[dev|prod]                     # loaded for dev or prod only
.env.local.[dev|prod]               # loaded for dev or prod only, ignored by git
.env.[quasarMode]                   # loaded for specific Quasar CLI mode only
.env.local.[quasarMode]             # loaded for specific Quasar CLI mode only, ignored by git
.env.[dev|prod].[quasarMode]        # loaded for specific Quasar CLI mode and dev|prod only
.env.local.[dev|prod].[quasarMode]  # loaded for specific Quasar CLI mode and dev|prod only, ignored by git
```

...where "ignored by git" assumes a default project folder created after releasing this package, otherwise add `.env.local*` to your `/.gitignore` file.

You can also configure the files above to be picked up from a different folder or even add more files to the list:

```js /quasar.config file
build: {
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
   * Filter the env variables that are exposed to the client
   * through the env files. This does not account also for the definitions
   * assigned directly to quasar.config > build > env prop.
   *
   * Requires @quasar/app-webpack v4.0.3+
   */
  envFilter?:
    (env: { [index: string]: string | boolean | undefined | null })
      => { [index: string]: string | boolean | undefined | null };
}
```

Remember that you can filter out unwanted keys, or even change values for keys by using `build > envFilter`:

```js /quasar.config file
build: {
  // @quasar/app-webpack v4.0.3+
  envFilter (originalEnv) {
    const newEnv = {}
    for (const key in originalEnv) {
      if (/* ...decide if it goes in or not... */) {
        newEnv[ key ] = originalEnv[ key ]
      }
    }

    // remember to return your processed env
    return newEnv
  }
}
```

## Troubleshooting

You might be getting `process is not defined` errors in the browser console if you are accessing the variables wrong or if you have a misconfiguration.

### Wrong usage

```js /quasar.config file > build
env: {
  FOO: 'hello',
}
```

```js
const { FOO } = process.env // ❌ It doesn't allow destructuring or similar
process.env.FOO // ✅ It can only replace direct usage like this

function getEnv(name) {
  return process.env[name] // ❌ It can't analyze dynamic usage
}

console.log(process) // ❌
console.log(process.env) // ❌
// If you want to see a list of available env variables,
// you can log the object you are passing to `build > env` inside the `/quasar.config` file

console.log(process.env.FOO) // ✅
console.log(process.env.foo) // ❌ Case sensitive
console.log(process.env.F0O) // ❌ Typo in the variable name (middle o is 0(zero))
```

### Misconfiguration

#### Manual definition

```js /quasar.config file
build: {
  env: {
    FOO: 'hello',
  }
}
```

```js
console.log(process.env.FOO) // ✅
console.log(process.env.BAR) // ❌ It's not defined in `build > env`
```

#### The env dotfiles

```
# order matters!
.env                                # loaded in all cases
.env.local                          # loaded in all cases, ignored by git
.env.[dev|prod]                     # loaded for dev or prod only
.env.local.[dev|prod]               # loaded for dev or prod only, ignored by git
.env.[quasarMode]                   # loaded for specific Quasar CLI mode only
.env.local.[quasarMode]             # loaded for specific Quasar CLI mode only, ignored by git
.env.[dev|prod].[quasarMode]        # loaded for specific Quasar CLI mode and dev|prod only
.env.local.[dev|prod].[quasarMode]  # loaded for specific Quasar CLI mode and dev|prod only, ignored by git
```

If the `/.env` doesn't exist or there is a typo in the file name:

```js
console.log(process.env.FOO) // ❌ The .env file is not loaded, this will fail
```

If the `/.env` file exists with the correct name, and has the following content:

```bash /.env
FOO=hello
```

```js
console.log(process.env.FOO) // ✅ It's loaded correctly from the `.env` file
console.log(process.env.BAR) // ❌ It's not defined in the `.env` file
```
