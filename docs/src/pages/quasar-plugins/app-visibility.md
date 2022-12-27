---
title: App Visibility
desc: A Quasar plugin that wraps the Page Visibility API, letting you know when your app is visible or in focus.
keys: AppVisibility
examples: AppVisibility
---

Quasar makes use of the Web [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) which lets you know when a website/app is visible or in focus.

<doc-api file="AppVisibility" />

<doc-installation plugins="AppVisibility" scrollable />

## Usage

```js
// outside of a Vue file
import { AppVisibility } from 'quasar'
AppVisibility.appVisible // Boolean

// inside of a Vue file
import { useQuasar } from 'quasar'
setup () {
  const $q = useQuasar()
  // now use $q.appVisible (Boolean)
}
```

<doc-example title="AppVisibility" file="Basic" />

## Watching for status change

```vue
<template>...</template>

<script>
import { useQuasar } from 'quasar'
import { watch } from 'vue'

export default {
  setup () {
    const $q = useQuasar()

    watch(() => $q.appVisible, val => {
      console.log(val ? 'App became visible' : 'App went in the background')
    })
  }
}
</script>
```
