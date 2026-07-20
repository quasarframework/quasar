---
title: Preparation for Electron
description: (@quasar/app-vite) How to add Electron mode into a Quasar app.
canonical: https://quasar.dev/quasar-cli-vite/developing-electron-apps/preparation
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Add Quasar Electron mode

Add Electron mode to create `/src-electron` and install its workspace dependencies with your project's package manager:

```bash
quasar mode add electron
```

The main process and preload sources live in `/src-electron`; the renderer UI remains in `/src`.

The new folder has the following structure:

- src-electron
  - electron-assets — Assets that can be referenced from Electron files
    - icons — Icons of your app for all platforms
      - icon.icns — Icon file for macOS
      - icon.ico — Icon file for Windows
      - icon.png — PNG icon used by Linux and at runtime
  - electron-preload.js — (or .ts) Electron preload script (exposes a controlled API to the renderer)
  - electron-main.js — (or .ts) Main process code
  - package.json — Electron-specific dependencies

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
