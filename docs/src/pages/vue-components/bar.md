---
title: Bar
desc: The QBar Vue component is used to create the top bar on different platforms.
keys: QBar
examples: QBar
related:
  - /quasar-cli-vite/developing-electron-apps/frameless-electron-window
  - /quasar-cli-webpack/developing-electron-apps/frameless-electron-window
---

The QBar is a small component for creating the top bar on different types of mobile or desktop websites/apps. For instance, in desktop apps QBar will have things like the close, minimize or maximize buttons and other menu controls for your application.

QBar is especially useful for frame-less Electron apps where you integrate it in the QHeader.

<doc-api file="QBar" />

## Usage

::: tip
For responsiveness, use [Visibility](/style/visibility#Window-Width-Related) Quasar CSS Classes. For finer tuning you can go write your own CSS media breakpoints or even go with [QResizeObserver](/vue-components/resize-observer).
:::

### Styling

<doc-example title="MacOS style" file="MacOS" no-edit />

<doc-example title="Windows style" file="Windows" />

<doc-example title="iOS style" file="iOS" no-edit />

<doc-example title="Android style" file="Android" />

### With other components

<doc-example title="QMenu" file="Menu" />

<doc-example title="QDialog" file="Dialog" />

<doc-example title="QHeader with QToolbar" file="Header" />

### Frameless Electron Window
QBar component can come in really handy when developing Electron apps, especially if you choose to use a frameless window.

Read more on [Frameless Electron Window](/quasar-cli/developing-electron-apps/frameless-electron-window) page.
