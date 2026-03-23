---
title: Electron Accessing Files
desc: (@quasar/app-webpack) How to access files in a Quasar desktop app.
scope:
  tree:
    l: app.asar
    c:
      - l: dist
        c:
          - l: electron-*
            c:
              - l: js/...
              - l: icons/
              - l: node_modules/
              - l: index.html
              - l: package.json
              - l: electron-main.js
                e: (or .ts)
              - l: electron-preload.js
                e: (or .ts)
              - l: '...contents of /public'
---

## Using **dirname & **filename

Since the main process is bundled using Esbuild, the use of `__dirname` and `__filename` will not provide an expected value in production. Referring to the File Tree, you'll notice that in production the electron-main.js and electron-preload.js files are placed inside the `dist/electron-*` folder. Based on this knowledge, use `__dirname` & `__filename` accordingly.

<DocTree :def="scope.tree" />

## Read & Write Local Files

One great benefit of using Electron is the ability to access the user's file system. This enables you to read and write files on the local system. To help avoid Chromium restrictions and writing to your application's internal files, make sure to make use of electron's APIs, specifically the app.getPath(name) function. This helper method can get you file paths to system directories such as the user's desktop, system temporary files, etc.

We can use the userData directory, which is reserved specifically for our application, so we can have confidence other programs or other user interactions should not tamper with this file space.

### Prepping

You will need the `@electron/remote` dependency installed into your app:

```tabs
<<| bash Yarn |>>
$ yarn add @electron/remote
<<| bash NPM |>>
$ npm install --save @electron/remote
<<| bash PNPM |>>
$ pnpm add @electron/remote
<<| bash Bun |>>
$ bun add @electron/remote
```

Then, in your `src-electron/electron-main.js` file, make some edits to these lines:

```js /electron-main.js
import { app, BrowserWindow, nativeTheme } from 'electron'
import { initialize, enable } from '@electron/remote/main' // <-- add this
import path from 'path'

initialize() // <-- add this

// ...

mainWindow = new BrowserWindow({
  // ...
  webPreferences: {
    sandbox: false // <-- to be able to import @electron/remote in preload script
    // ...
  }
})

enable(mainWindow.webContents) // <-- add this

mainWindow.loadURL(process.env.APP_URL)

// ...
```

### Usage

Finally, here's an example of how to access files:

```js /electron-main or /electron-preload
import path from 'path'
import { app } from '@electron/remote'

const filePath = path.join(app.getPath('userData'), '/some.file')
```

If you import `@electron/remote` in your preload script, please remember that you need to set the following in your `electron-main.js` where you instantiate BrowserWindow:

```js /electron-main
mainWindow = new BrowserWindow({
  // ...
  webPreferences: {
    // ...
    sandbox: false // <-- to be able to import @electron/remote in preload script
  }
}
```

## Accessing the Public Folder

If for some reason, you have important files that you are storing in the /public folder, you can access those too by following the code below. To understand why you need to access them this way, please read the "Using **dirname & **filename" section above.

```js /electron-main or /electron-preload
import path from 'path'
import { fileURLToPath } from 'url'

const currentDir = fileURLToPath(new URL('.', import.meta.url))

const publicFolder = path.resolve(currentDir, process.env.QUASAR_PUBLIC_FOLDER)
```
