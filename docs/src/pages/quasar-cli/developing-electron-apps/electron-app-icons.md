---
title: Electron App Icons
desc: How to enable Electron app icons
---

As per [Electron Accessing Files](/quasar-cli/developing-electron-apps/electron-accessing-files), Electron app icons are stored in the following locations.

```bash
.
└── public/                   # Static Assets 
    └── icons-electron/          # Icons of your app for all platforms
        ├── icon.icns            # Icon file for Darwin (MacOS) platform
        ├── icon.ico             # Icon file for win32 (Windows) platform
        └── icon.png             # Icon file for Linux platform
```

## How to use them
```js
// file: /src-electron/electron-main.[js|ts]

import path from 'path'

// ...

function createWindow () {
  // ...
  mainWindow = new BrowserWindow({
    // ...
    icon: path.resolve(
      __dirname,
      process.env.QUASAR_PUBLIC_FOLDER,
      "icons-electron",
      process.platform === "win32" ? "icon.ico"
        : process.platform === "darwin" ? "icon.icns"
        : "icon.png"
    ),
    // ...
  })
```

The same means can be used for tray icons as well.