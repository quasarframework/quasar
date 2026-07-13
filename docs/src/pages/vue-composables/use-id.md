---
title: useId composable
desc: What is useId() composable and how you can use it
keys: useId
badge: Quasar v2.15+
---

The `useId()` composable returns a Vue Ref holding a string that can be used as a unique identifier to apply to a DOM node attribute.

Should you supply a function (`getValue` from the typing below) to get the value that the id might have, it will make sure to keep it updated.

On SSR/SSG, it takes into account the process of hydration so that your component won't generate any such errors.

## Syntax

```js
import { useId } from 'quasar'

setup () {
  const id = useId()
  // ...
}
```

```ts
function useId(opts?: {
  getValue?: () => string | null | undefined
  required?: boolean // default: true
}): Ref<string | null>
```

## Example

```html
<template>
  <div :id="id"> Some component </div>
</template>

<script setup>
  import { useId } from 'quasar'

  const props = defineProps({
    for: String
  })

  const id = useId({
    getValue: () => props.for,
    required: true
  })
</script>
```
