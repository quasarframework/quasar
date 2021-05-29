---
title: Bar
desc: The QBar Vue component is used to create the top bar on different platforms.
related:
  - /quasar-cli/developing-electron-apps/frameless-electron-window
---

The QBar is a small component for creating the top bar on different types of mobile or desktop websites/apps. For instance, in desktop apps QBar will have things like the close, minimize or maximize buttons and other menu controls for your application.

QBar is especially useful for frame-less Electron apps where you integrate it in the QHeader.

## QBar API
<doc-api file="QBar" />

## Usage

::: tip
For responsiveness, use [Visibility](/style/visibility#window-width-related) Quasar CSS Classes. For finer tuning you can go write your own CSS media breakpoints or even go with [QResizeObserver](/vue-components/resize-observer).
:::

### Styling

<doc-example title="MacOS style" file="QBar/MacOS" no-edit />

<doc-example title="Windows style" file="QBar/Windows" />

<doc-example title="iOS style" file="QBar/iOS" no-edit />

<doc-example title="Android style" file="QBar/Android" />

### With other components

<doc-example title="QMenu" file="QBar/Menu" />

<doc-example title="QDialog" file="QBar/Dialog" />

<doc-example title="QHeader with QToolbar" file="QBar/Header" />

### Frameless Electron Window
QBar component can come in really handy when developing Electron apps, especially if you choose to use a frameless window.

Read more on [Frameless Electron Window](/quasar-cli/developing-electron-apps/frameless-electron-window) page.
