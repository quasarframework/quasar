---
title: useQuasar composable
desc: What is useQuasar() composable and how you can use it
keys: useQuasar
related:
  - /options/the-q-object
---

The useQuasar composable is used in order to get access to the [$q Object](/options/the-q-object).

> [!TIP]
> **Outside of a component**
>
> The composable can also be called outside of `setup()`, as long as it runs within the app's context: `app.runWithContext(() => useQuasar())`, with the `app` a boot file receives. It then returns the `$q` Object of that app.

## Syntax

```js
import { useQuasar } from 'quasar'

setup () {
  const $q = useQuasar()
}
```

## Example

```html
<template>
  <div>
    <div v-if="$q.platform.is.ios"> Gets rendered only on iOS platform. </div>
  </div>
</template>

<script setup>
  import { useQuasar } from 'quasar'

  const $q = useQuasar()

  console.log($q.platform.is.ios)

  // showing an example on a method, but
  // can be any part of Vue script
  function show() {
    // prints out Quasar version
    console.log($q.version)
  }
</script>
```
