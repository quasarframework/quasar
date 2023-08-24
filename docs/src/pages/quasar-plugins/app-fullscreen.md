---
title: Fullscreen Plugin
desc: A Quasar plugin to toggle the fullscreen state of your app through the Web Fullscreen API.
keys: AppFullScreen
examples: AppFullscreen
---
There are times when you want your website or App to run in fullscreen.
Quasar makes it easy by wrapping the [Web Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API).

::: warning
Please note that the behavior is different depending on the platform the code is running on, due to the fact that there isn't a fixed Web standard for Web Fullscreen API yet.
:::

<doc-api file="AppFullscreen" />

<doc-installation plugins="AppFullscreen" />

## Usage
::: tip
For an exhaustive list of properties and methods, please check out the API section.
:::

```js
// outside of a Vue file
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

```js
// inside of a Vue file

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

<doc-example title="Basic" file="Basic" />

<doc-example title="On custom element" file="Targeted" />

::: warning
On some phones this will have little effect:
* For example, on Samsung S4, when App goes into fullscreen, the top bar will slide up but still remain on screen.
* On Nexus phones, on the other hand, like Nexus 5, Android navigation buttons and top bar disappear completely.

It all depends on the Web Fullscreen API support of the platform the code is running on.
:::

## Watching for fullscreen changes

```vue
<template>...</template>

<script>
import { useQuasar } from 'quasar'
import { watch } from 'vue'

export default {
  setup () {
    const $q = useQuasar()

    watch(() => $q.fullscreen.isActive, val => {
      console.log(val ? 'In fullscreen now' : 'Exited fullscreen')
    })
  }
}
</script>
```
