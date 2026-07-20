---
title: What is Electron
description: (@quasar/app-vite) Introduction about the technology behind Quasar desktop apps.
canonical: https://quasar.dev/quasar-cli-vite/developing-electron-apps/introduction
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

[Electron](https://www.electronjs.org/) is an open-source framework for building cross-platform desktop applications with JavaScript, HTML, and CSS. It embeds Chromium and Node.js, allowing a Quasar application to combine a web-based interface with native desktop capabilities.

An Electron application normally uses multiple operating-system processes. The main process manages the application lifecycle and native windows. Each window loads the Quasar UI in a renderer process. A preload script can expose a narrow, controlled API from Electron to the renderer.

## Renderer Process

Electron uses Chromium to display the UI code from `/src` in a renderer process. Quasar's default Electron template keeps Node.js integration disabled and context isolation enabled. Use a preload bridge and IPC when the UI needs a native capability.

## Main Process

The main process runs the package's `main` entry, manages the application lifecycle, and creates browser windows. In a Quasar project, its source is `/src-electron/electron-main.js` (or `.ts`).

## Preload Script

The [preload script](/quasar-cli-vite/developing-electron-apps/electron-preload-script) (`/src-electron/electron-preload.js` or `.ts`) runs before the renderer content. Use Electron's `contextBridge` to expose small, purpose-built APIs to the UI instead of exposing Node.js or Electron APIs directly.
