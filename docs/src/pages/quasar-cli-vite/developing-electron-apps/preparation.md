---
title: Preparation for Electron
desc: (@quasar/app-vite) How to add Electron mode into a Quasar app.
scope:
  tree:
    l: src-electron
    c:
      - l: electron-assets
        e: Assets that can be referenced from Electron files
        c:
          - l: icons
            e: Icons of your app for all platforms
            c:
              - l: icon.icns
                e: Icon file for macOS
              - l: icon.ico
                e: Icon file for Windows
              - l: icon.png
                e: PNG icon used by Linux and at runtime
      - l: electron-preload.js
        e: '(or .ts) Electron preload script (exposes a controlled API to the renderer)'
      - l: electron-main.js
        e: '(or .ts) Main process code'
      - l: package.json
        e: 'Electron-specific dependencies'
---

## Add Quasar Electron mode

Add Electron mode to create `/src-electron` and install its workspace dependencies with your project's package manager:

```bash
quasar mode add electron
```

The main process and preload sources live in `/src-electron`; the renderer UI remains in `/src`.

The new folder has the following structure:

<DocTree :def="scope.tree" />

### Native dependencies

Most Electron packages use prebuilt binaries and require no local compiler. A dependency containing a native Node.js addon may need to be rebuilt for Electron's ABI.

On Windows, install Python 3 and Visual Studio's **Desktop development with C++** workload if a native dependency must compile. The Node.js installer can install the **Tools for Native Modules** for you. On macOS, install the Xcode Command Line Tools; on Linux, install Python, `make`, and a supported C/C++ compiler. See Electron's [native modules guide](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules/) for rebuilding and troubleshooting native dependencies.

## Start developing

Run:

```bash
quasar dev -m electron

# passing extra parameters and/or options to
# underlying "electron" executable:
quasar dev -m electron -- --force-device-scale-factor=1
# when on Windows and using Powershell:
quasar dev -m electron '--' --force-device-scale-factor=1
```

This also adds Electron mode automatically when it is missing. It opens the application window and, with the default template, the renderer DevTools.

Arguments after `--` are forwarded to the Electron executable. Avoid disabling Chromium's sandbox as a general workaround; doing so removes an important security boundary.
