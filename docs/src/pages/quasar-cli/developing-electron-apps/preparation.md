---
title: Preparation for Electron
desc: How to add Electron mode into a Quasar app.
---
Before we dive in to the actual development, we need to do some preparation work.

## 1. Add Quasar Electron Mode
In order to develop/build a Quasar Electron app, we need to add the Electron mode to our Quasar project. What this does is that it yarn installs some Electron packages and creates `/src-electron` folder.
```bash
$ quasar mode add electron
```

Every Electron app has two threads: the main thread (deals with the window and initialization code -- from the newly created folder `/src-electron`) and the renderer thread (which deals with the actual content of your app from `/src`).

The new folder has the following structure:
```bash
.
└── src-electron/
    ├── icons/                 # Icons of your app for all platforms
    |   ├── icon.icns             # Icon file for Darwin (MacOS) platform
    |   ├── icon.ico              # Icon file for win32 (Windows) platform
    |   └── linux-512x512.png     # Icon file for Linux platform (when using electron-builder)
    └── main-process/          # Main thread source code
        ├── electron-main.dev.js  # Main thread code while developing; read below
        └── electron-main.js      # Main thread code for production
```

### Electron-main.dev.js
This file (`/src-electron/main-process/electron-main.dev.js`) is used specifically for development and is used to install dev-tools. Usually it should not have to be modified, but can be used to extend your development needs. After it sets up dev-tools it imports the `electron-main.js` which is the place you'll make most (if not all) of your changes.

### A note for Windows Users
If you run into errors during npm install about node-gyp, then you most likely do not have the proper build tools installed on your system. Build tools include items like Python and Visual Studio. Fortunately, there are a few packages to help simplify this process.

The first item we need to check is our npm version and ensure that it is not outdated. This is accomplished using [npm-windows-upgrade](https://github.com/felixrieseberg/npm-windows-upgrade). If you are using yarn, then you can skip this check.

Once that is complete, we can then continue to setup the needed build tools. Using [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools), most of the dirty work is done for us. Installing this globally will in turn setup Visual C++ packages, Python, and more.

::: warning Note: April 2019
In Powershell.exe (Run as Admin) `npm install --global windows-build-tools` seems to fail at the moment with errors pointing to python2 and vctools. You can get around this with Chocolatey. One-liner install:

**Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))**

and then run `choco upgrade python2 visualstudio2017-workload-vctools`.
:::

At this point things should successfully install, but if not then you will need a clean installation of Visual Studio. Please note that these are not problems with Quasar, but they are related to NPM and Windows.

## 2. Start Developing
If you want to jump right in and start developing, you can skip the previous step with "quasar mode" command and issue:

```bash
$ quasar dev -m electron

# passing extra parameters and/or options to
# underlying "electron" executable:
$ quasar dev -m electron -- --no-sandbox --disable-setuid-sandbox
```

This will add Electron mode automatically, if it is missing.
It will open up an Electron window which will render your app along with Developer Tools opened side by side.

