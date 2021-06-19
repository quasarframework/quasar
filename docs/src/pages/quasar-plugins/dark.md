---
title: Dark Plugin
desc: A Quasar plugin to toggle or configure the Dark Mode state of your app.
keys: Dark
related:
  - /style/dark-mode
  - /style/theme-builder
---

::: tip
For a better understanding of this Quasar plugin, please head to the Style & Identity [Dark Mode](/style/dark-mode) page.
:::

## Dark API

<doc-api file="Dark" />

## Installation
This plugin is automatically installed. No need to do anything but directly use it.

## Usage

::: warning
Do not manually assign a value to `isActive` or `mode` from below. Instead, use the `set(val)` method.
:::

### Inside of a Vue file

```js
import { useQuasar } from 'quasar'
setup () {
  const $q = useQuasar()

  // get status
  console.log($q.dark.isActive) // true, false

  // get configured status
  console.log($q.dark.mode) // "auto", true, false

  // set status
  $q.dark.set(true) // or false or "auto"

  // toggle
  $q.dark.toggle()
}
```

On a **SSR build**, you may want to set this from your `/src/App.vue`:

```js
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()

    // calling here; equivalent to when component is created
    $q.dark.set(true)
  }
}
```

### Outside of a Vue file

```js
// Warning! This method will not
// work on SSR builds.

import { Dark } from 'quasar'

// get status
console.log(Dark.isActive)

// get configured status
console.log(Dark.mode) // "auto", true, false

// set status
Dark.set(true) // or false or "auto"

// toggle
Dark.toggle()
```

### Through quasar.conf.js

You can also use `/quasar.conf.js` to set the Dark mode status:

```js
framework: {
  config: {
    dark: 'auto' // or Boolean true/false
  }
}
```

## Note about SSR

When on a SSR build:

* `import { Dark } from 'quasar'` method of using Dark mode will not error out but it will not work (won't do anything). But you can use the other two ways (see previous section). We recommend through quasar.conf.js.
* It's preferred to avoid setting Dark mode to 'auto' for SSR builds. It's because the client dark mode preference cannot be inferred, so SSR will always render in light mode then when the client takes over, it will switch to Dark (if it will be the case). As a result, a quick flicker of the screen will occur.

## Watching for status change

```vue
<template>...</template>

<script>
import { useQuasar } from 'quasar'
import { watch } from 'vue'

export default {
  setup () {
    const $q = useQuasar()

    watch(() => $q.dark.isActive, val => {
      console.log(val ? 'On dark mode' : 'On light mode')
    })
  }
}
</script>
```
