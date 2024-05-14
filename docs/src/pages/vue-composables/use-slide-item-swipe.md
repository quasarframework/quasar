---
title: useSlideItemSwipe composable
desc: What is useSlideItemSwipe() composable and how you can use it
keys: useSlideItemSwipe
badge: Quasar v2.15+
---

The `useSlideItemSwipe()` is designed to simplify usage of the [Slide Item](https://quasar.dev/vue-components/slide-item) component. This composable encapsulates invoking user defined method on swipe,
setting timeout for reset, and resetting the `Slide Item` to initial state by the timer.

The `Slide Item` component requires to set up timer and invoke integrated `reset()` method to return component to initial state.
The `useSlideItemSwipe()` composable solves this problem and removes the timer in `onBeforeUnmount()` lifecycle hook.

## Syntax

```js
import { useSlideItemSwipe } from 'quasar'

const slideItemSwipeEventHandler1 = useSlideItemSwipe(
  (customParam) => {console.log(`Slide Item swipe: ${customParam}`),
  500}
)

const slideItemSwipeEventHandler2 = useSlideItemSwipe(() => {console.log('Slide Item swipe'), 700}
)
```

```js
export function useSlideItemSwipe({ resetFn, param }: { resetFn: () => void, param: any }) : void
```

## Example

```html
<template>
    <q-slide-item @left="onLeft({ resetFn: $event.reset, param: 1234 })">List Item</q-slide-item>
</template>
```
```js
import { useSlideItemSwipe } from 'quasar'

function doSomething(param?) {
  console.log(`Wow! You just swiped left and passed value: ${param}`)
  // will print out to console: "Wow! You just swiped left and passed value: 1234"
}
const onLeft = useSlideItemSwipe(doSomething, 300)
```
