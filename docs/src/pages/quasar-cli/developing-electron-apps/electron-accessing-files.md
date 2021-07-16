---
title: Electron Accessing Files
desc: How to access files in a Quasar desktop app.
---

## Using __dirname & __filename
Since the main process is bundled using webpack, the use of `__dirname` and `__filename` will not provide an expected value in production. Referring to the File Tree, you'll notice that in production the electron-main.js and electron-preload.js files are placed inside the `dist/electron-*` folder. Based on this knowledge, use `__dirname` & `__filename` accordingly.

```bash
app.asar
└─ dist
   └─ electron-*
      ├─ js/...
      ├─ node_modules/
      ├─ index.html
      ├─ package.json
      ├─ electron-main.js
      ├─ electron-preload.js
      └─ ...contents of /public
```

## Read & Write Local Files
One great benefit of using Electron is the ability to access the user's file system. This enables you to read and write files on the local system. To help avoid Chromium restrictions and writing to your application's internal files, make sure to make use of electron's APIs, specifically the app.getPath(name) function. This helper method can get you file paths to system directories such as the user's desktop, system temporary files, etc.

We can use the userData directory, which is reserved specifically for our application, so we can have confidence other programs or other user interactions should not tamper with this file space.

```js
// electron-main or electron-preload

import path from 'path'
import { app } from '@electron/remote'

const filePath = path.join(app.getPath('userData'), '/some.file')
```

If for some reason, you have important files that you are storing in the /public folder, you can access those too by following the code below. To understand why you need to access them this way, please read the "Using __dirname & __filename" section above.

```js
// electron-main or electron-preload

import path from 'path'

const publicFolder = path.resolve(__dirname, process.env.QUASAR_PUBLIC_FOLDER)
```
