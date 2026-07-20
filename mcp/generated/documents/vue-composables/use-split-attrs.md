---
title: useSplitAttrs composable
description: What is useSplitAttrs() composable and how you can use it
canonical: https://quasar.dev/vue-composables/use-split-attrs
kinds: composable
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

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
  attributes: Ref<Record<string, unknown>>;
  listeners: Ref<
    Record<
      string,
      ((...args: any[]) => any) | ((...args: any[]) => any)[]
    >
  >;
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
