---
title: Bar
---

The QBar is a small component for creating the top bar on different types of mobile or desktop websites/apps. For instance, in desktop apps QBar will have things like the close, minimize or maximize buttons and other menu controls for your application.

QBar is especially useful for frame-less Electron apps where you integrate it in the QHeader.

## Installation
<doc-installation components="QBar" />

## Usage

::: tip
For responsiveness, use [Visibility](/style/visibility#Window-Width-Related) Quasar CSS Classes. For finer tuning you can go write your own CSS media breakpoints or even go with [QResizeObserver](/vue-components/resize-observer).
:::

### Styling

<doc-example title="MacOS style" file="QBar/MacOS" />

<doc-example title="Windows style" file="QBar/Windows" />

<doc-example title="iOS style" file="QBar/iOS" />

<doc-example title="Android style" file="QBar/Android" />

### With other components

<doc-example title="QMenu" file="QBar/Menu" />

<doc-example title="QDialog" file="QBar/Dialog" />

<doc-example title="QHeader with QToolbar" file="QBar/Header" />

## QBar API
<doc-api file="QBar" />
