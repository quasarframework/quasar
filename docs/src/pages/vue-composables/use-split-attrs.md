---
title: useSplitAttrs composable
desc: What is useSplitAttrs() composable and how you can use it
keys: useSplitAttrs
badge: Quasar v2.15+
---

Vue's `attrs` in a component can contain both listeners and real HTML attributes. The `useSplitAttrs()` composable breaks down this Vue attr object into the two categories and keeps them updated.

## Syntax

```js
import { useSplitAttrs } from 'quasar'

setup () {
  const {
    attributes,
    listeners
  } = useSplitAttrs()

  // ...
}
```

```js
import { Ref } from 'vue'

function useSplitAttrs(): {
  attributes: Ref<Record<string, string | null | undefined>>;
  listeners: Ref<Record<string, (...args: any[]) => any>>;
};
```

## Example

```js
import { useSplitAttrs } from 'quasar'

setup () {
  const {
    attributes, // is a Vue ref()
    listeners // is a Vue ref()
  } = useSplitAttrs()

  console.log(attributes.value)
  // prints out a key-value object

  console.log(listeners.value)
  // prints out a key-value object

  // ...
}
```
