---
title: useId composable
desc: What is useId() composable and how you can use it
keys: useId
badge: Quasar v2.15+
---

The `useId()` composable returns a Vue Ref holding a string that can be used as a unique identifier to apply to a DOM node attribute.

Should you supply a function (`getValue` from the typing below) to get the value that the id might have, it will make sure to keep it updated.

On SSR, it takes into account the process of hydration so that your component won't generate any such errors.

## Syntax

```js
import { useId } from 'quasar'

setup () {
  const id = useId()
  // ...
}
```

```js
function useId(
  opts?: {
    getValue?: () => string | null | undefined;
    required?: boolean; // default: true
  }
): Ref<string | null>;
```

## Example

```html
<template>
  <div :id="id">
    Some component
  </div>
</template>

<script>
import { useId } from 'quasar'

export default {
  props: {
    for: String
  },

  setup () {
    const id = useId({
      getValue: () => props.for,
      required: true
    })

    return { id }
  }
}
</script>
```
