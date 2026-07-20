---
title: useHydration composable
description: What is useHydration() composable and how you can use it
canonical: https://quasar.dev/vue-composables/use-hydration
kinds: composable
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

The useHydration composable is useful when you build for SSR or SSG (but can be used for non SSR/SSG builds as well). It is a lower level util of the [QNoSsr](/vue-components/no-ssr) component.

## Syntax

```js
import { useHydration } from 'quasar'

setup () {
  const { isHydrated } = useHydration()
}
```

```js
function useHydration(): {
  isHydrated: Ref<boolean>;
};
```

## Example

```html
<template>
  <div>
    <div v-if="isHydrated"> Gets rendered only after hydration. </div>
  </div>
</template>

<script setup>
  import { useHydration } from 'quasar'
  const { isHydrated } = useHydration()
</script>
```
