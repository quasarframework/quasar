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

<DocApi file="Dark" />

<DocInstall title="Configuration" config="dark" />

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

On a **SSR/SSG build**, you may want to set this from your `/src/App.vue`:

```js
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()

    // calling here; equivalent to when component is created
    $q.dark.set(true)
  }
}
```

### Outside of a Vue file

```js
// Warning! This method will not
// work on SSR/SSG builds.

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

## Note about SSR/SSG

When on a SSR/SSG build:

- Import `Dark` from 'quasar' method of using Dark mode will not error out but it will not work (won't do anything). But, you can use the [Inside of a Vue file](/quasar-plugins/dark#inside-of-a-vue-file) approach or the [Configuration](/quasar-plugins/dark#configuration) (recommended) approach.
- The server cannot know the client's color scheme preference. With Dark mode set to `'auto'`, the page is rendered in light mode and the client resolves `'auto'` (and starts tracking the `prefers-color-scheme` media query) as soon as it takes over. Users preferring dark mode will see a quick light flash as a result. If you can know the preference server-side (e.g. from a cookie), prefer calling `$q.dark.set()` with it from `/src/App.vue` as shown above: the whole page then renders in the right mode from the start.

## Watching for status change

```html
<template>...</template>

<script setup>
  import { useQuasar } from 'quasar'
  import { watch } from 'vue'

  const $q = useQuasar()

  watch(
    () => $q.dark.isActive,
    val => {
      console.log(val ? 'On dark mode' : 'On light mode')
    }
  )
</script>
```
