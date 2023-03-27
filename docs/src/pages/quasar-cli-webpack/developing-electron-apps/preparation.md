---
title: Preparation for Electron
desc: (@quasar/app-webpack) How to add Electron mode into a Quasar app.
scope:
  tree:
    l: src-electron
    c:
    - l: icons
      e: Icons of your app for all platforms
      c:
      - l: icon.icns
        e: Icon file for Darwin (MacOS) platform
      - l: icon.ico
        e: Icon file for win32 (Windows) platform
      - l: icon.png
        e: Tray icon file for all platforms (especially Linux)
    - l: electron-preload.js
      e: "(or .ts) Electron preload script (injects Node.js stuff into renderer thread)"
    - l: electron-main.js
      e: "(or .ts) Main thread code"
---
Before we dive in to the actual development, we need to do some preparation work.

## 1. Add Quasar Electron Mode
In order to develop/build a Quasar Electron app, we need to add the Electron mode to our Quasar project. What this does is that it yarn installs some Electron packages and creates `/src-electron` folder.

```bash
$ quasar mode add electron
```

Every Electron app has two threads: the main thread (deals with the window and initialization code -- from the newly created folder `/src-electron`) and the renderer thread (which deals with the actual content of your app from `/src`).

The new folder has the following structure:

<doc-tree :def="scope.tree" />

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
# when on Windows and using Powershell:
$ quasar dev -m electron '--' --no-sandbox --disable-setuid-sandbox
```

This will add Electron mode automatically, if it is missing.
It will open up an Electron window which will render your app along with Developer Tools opened side by side.
