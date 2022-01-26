---
title: What is Electron
desc: Introduction about the technology behind Quasar desktop apps.
---
[Electron](https://electronjs.org/) (formerly known as Atom Shell) is an open-source framework created by Cheng Zhao, and now developed by GitHub. **It allows for the development of desktop GUI applications** using front and back end components originally developed for web applications: Node.js runtime for the backend and Chromium for the frontend. Electron is the main GUI framework behind several notable open-source projects including GitHub's Atom and Microsoft's Visual Studio Code source code editors, the Tidal music streaming service desktop application and the Light Table IDE, in addition to the freeware desktop client for the Discord chat service.

Each Electron app has two threads: one is the main thread (dealing with the App window and bootup), and one is the renderer thread (which is basically your UI web code). There is also a preload script to bridge the two "worlds".

## Renderer Thread
Electron uses Chromium for displaying web pages in a separate process called the render process. This thread deals with your UI code in `/src` folder. You won't be able to use the Node.js power here, but the preload script will allow you to bridge the UI with Node.js.

## Main Thread
In Electron, the process that runs package.json’s main script is called the main process. This is the script that runs in the main process and can display a GUI by initializing the renderer thread. This thread deals with your code in `/src-electron/electron-main.js` folder.

## Preload Script
The [preload script](/quasar-cli/developing-electron-apps/electron-preload-script) (`/src-electron/electron-preload.[js|ts]`) is a way for you to inject Node.js stuff into the renderer thread by using a bridge between it and the UI. You can expose APIs that you can then call from your UI.
