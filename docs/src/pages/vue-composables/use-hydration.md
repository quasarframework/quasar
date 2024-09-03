---
title: useHydration composable
desc: What is useHydration() composable and how you can use it
keys: useHydration
badge: Quasar v2.15+
related:
  - /vue-components/no-ssr
---

The useHydration composable is useful when you build for SSR (but can be used for non SSR builds as well). It is a lower level util of the [QNoSsr](/vue-components/no-ssr) component.

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
    <div v-if="isHydrated">
      Gets rendered only after hydration.
    </div>
  </div>
</template>

<script>
import { useHydration } from 'quasar'

export default {
  setup () {
    const { isHydrated } = useHydration()

    return {
      isHydrated
    }
  }
}
</script>
```
