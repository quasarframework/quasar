---
title: Fullscreen Plugin
description: A Quasar plugin to toggle the fullscreen state of your app through the Web Fullscreen API.
canonical: https://quasar.dev/quasar-plugins/app-fullscreen
kinds: plugin
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [AppFullscreen](../../api/AppFullscreen.md)

There are times when you want your website or App to run in fullscreen.
Quasar makes it easy by wrapping the [Web Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API).

::: warning
Please note that the behavior is different depending on the platform the code is running on, due to the fact that there isn't a fixed Web standard for Web Fullscreen API yet.
:::

**API reference:** [AppFullscreen](../../api/AppFullscreen.md)

<DocInstall plugins="AppFullscreen" />

## Usage

::: tip
For an exhaustive list of properties and methods, please check out the API section.
:::

```js Outside of a Vue file
import { AppFullscreen } from 'quasar'

// Requesting fullscreen mode:
AppFullscreen.request()
  .then(() => {
    // success!
  })
  .catch(err => {
    // oh, no!!!
  })

// Exiting fullscreen mode:
AppFullscreen.exit()
  .then(() => {
    // success!
  })
  .catch(err => {
    // oh, no!!!
  })
```

```js Inside of a Vue file
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()

  // Requesting fullscreen mode:
  $q.fullscreen.request()
    .then(() => {
      // success!
    })
    .catch(err => {
      // oh, no!!!
    })

  // Exiting fullscreen mode:
  $q.fullscreen.exit()
    .then(() => {
      // success!
    })
    .catch(err => {
      // oh, no!!!
    })
}
```

**Example: Basic**

Source: [Basic.vue](../../examples/AppFullscreen/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn
      color="secondary"
      @click="$q.fullscreen.toggle()"
      :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
      :label="$q.fullscreen.isActive ? 'Exit Fullscreen' : 'Go Fullscreen'"
    />
  </div>
</template>
````

**Example: On custom element**

Source: [Targeted.vue](../../examples/AppFullscreen/Targeted.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn
      color="secondary"
      @click="toggle"
      :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
      :label="$q.fullscreen.isActive ? 'Exit Fullscreen' : 'Go Fullscreen'"
    />
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function toggle(e) {
  const target = e.target.parentNode.parentNode.parentNode

  $q.fullscreen
    .toggle(target)
    .then(() => {
      // success!
    })
    .catch(err => {
      // uh, oh, error!!
      alert(err)
      console.error(err)
    })
}
</script>
````

::: warning
On some phones this will have little effect:

- For example, on Samsung S4, when App goes into fullscreen, the top bar will slide up but still remain on screen.
- On Nexus phones, on the other hand, like Nexus 5, Android navigation buttons and top bar disappear completely.

It all depends on the Web Fullscreen API support of the platform the code is running on.
:::

## Watching for fullscreen changes

```html
<template>...</template>

<script setup>
  import { useQuasar } from 'quasar'
  import { watch } from 'vue'

  const $q = useQuasar()

  watch(
    () => $q.fullscreen.isActive,
    val => {
      console.log(val ? 'In fullscreen now' : 'Exited fullscreen')
    }
  )
</script>
```
