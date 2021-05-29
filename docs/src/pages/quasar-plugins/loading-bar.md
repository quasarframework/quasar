---
title: LoadingBar
desc: A Quasar plugin that wraps the QAjaxBar component for the easiest way of showing such a loading indicator in an app.
related:
  - /vue-components/ajax-bar
  - /vue-components/linear-progress
  - /vue-components/skeleton
---
The Quasar LoadingBar plugin offers an easy way to set up your app with a [QAjaxBar](/vue-components/ajax-bar) in case you don't want to handle a QAjaxBar component yourself.

For a demo, please visit the QAjaxBar documentation page.

## LoadingBar API
<doc-api file="LoadingBar" />

## Installation

<doc-installation plugins="LoadingBar" config="loadingBar" />

LoadingBar options are same as when configuring a [QAjaxBar](/vue-components/ajax-bar).

::: warning
When using the UMD version of Quasar, all components, directives and plugins are installed by default. This includes LoadingBar. Should you wish to disable it, specify `loadingBar: { skipHijack: true }` (which turns off listening to Ajax traffic).
:::

## Usage
Inside Vue components:

```js
this.$q.loadingBar.start()
this.$q.loadingBar.stop()
this.$q.loadingBar.increment(value)
```

Outside of Vue components:
```js
import { LoadingBar } from 'quasar'

LoadingBar.start()
LoadingBar.stop()
LoadingBar.increment(value)
```

### Setting Up Defaults

Should you wish to set up some defaults, rather than specifying them each time, you can do so by using quasar.conf.js > framework > config > loadingBar: {...} or by calling `LoadingBar.setDefaults({...})` or `this.$q.loadingBar.setDefaults({...})`. Supports all [QAjaxBar](/vue-components/ajax-bar) properties.

Inside Vue components:

```js
this.$q.loadingBar.setDefaults({
  color: 'purple',
  size: '15px',
  position: 'bottom'
})
```

Outside of Vue components:

```js
import { LoadingBar } from 'quasar'

LoadingBar.setDefaults({
  color: 'purple',
  size: '15px',
  position: 'bottom'
})
```
