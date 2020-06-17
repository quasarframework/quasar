---
title: Electron Static Assets
desc: Handling the static assets in a Quasar desktop app.
---
Please read about [Handling Assets](/quasar-cli/handling-assets) first, which applies to the renderer process. However, when we deal with Electron then Quasar CLI offers a handy `__static` variable in addition. Statics can be consumed by both the main process and renderer process, but since the paths change when building for production (due to packaging), then usage with `fs` and other modules that need a full path can be a little tricky. So `__statics` can come into play.

::: warning
These features require that you don't disable the [Node Integration](/quasar-cli/developing-electron-apps/node-integration).
:::

## On the subject of using __dirname & __filename
Since the main process is bundled using webpack, the use of `__dirname` and `__filename` will not provide an expected value in production. Referring to the File Tree, you'll notice that in production the electron-main.js is placed inside the `dist/electron-*` folder. Based on this knowledge, use `__dirname` & `__filename` accordingly.

```bash
app.asar
└─ dist
   └─ electron-*
      ├─ js/...
      ├─ node_modules/
      ├─ index.html
      ├─ package.json
      ├─ electron-main.js
      └─ ...contents of /public
```

## Static assets with fs, path and __statics
Let's say we have a static asset that we need to read into our application using `fs`, but how do we get a reliable path, in both development and production, to the statics/ folder? Quasar provides a global variable named `__statics` that will yield a proper path to it. Here's how we can use it to read a simple text file in both development and production.

Let's assume we have a file called `someFile.txt` in `/public`. Now, in main or renderer process, we can access it like this:
```bash
// main or renderer process

import fs from 'fs'
import path from 'path'

let fileContents = fs.readFileSync(
  path.join(__statics, '/someFile.txt'),
  'utf8'
)
```
