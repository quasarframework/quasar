---
title: useAnimationFrame composable
desc: What is useAnimationFrame() composable and how you can use it
keys: useAnimationFrame
badge: Quasar v2.23+
---

The `useAnimationFrame()` composable is similar in scope with the native `requestAnimationFrame()`, with some key differences. The composable takes care of "cancelling" the animation frame if your component gets destroyed or deactivated (keep-alive related) and you can also override the executing Function before the next animation frame arrives.

In other words, if you want to schedule a function on the next animation frame but you might want to override it or even cancel it before the timeout happens, this is the composable for you.

::: tip
On the server-side of SSR or SSG modes, registering an animation frame is a no-op. Start server-side work explicitly outside the component rendering lifecycle rather than creating a timer during `setup()`.
:::

## Syntax

```js
import { useAnimationFrame } from 'quasar'

setup () {
  const {
    registerAnimationFrame,
    removeAnimationFrame
  } = useAnimationFrame()

  // ...
}
```

```ts
function useAnimationFrame(): {
  registerAnimationFrame(fn: () => void): void
  removeAnimationFrame(): void
}
```

## Example

```js
import { useAnimationFrame } from 'quasar'

setup () {
  const { registerAnimationFrame } = useAnimationFrame()

  function onSomeEvent (param) {
    registerAnimationFrame(() => {
      console.log('param is', param)
    })
  }

  // ...

  // You can call onSomeEvent() multiple
  // times in a row and only the last
  // registered Function will run when it
  // is time for it
}
```

Should you need more than one useAnimationFrame() per component, simply rename the functions of the returned object:

```js
const {
  registerAnimationFrame: registerFirstAnimationFrame,
  removeAnimationFrame: removeFirstAnimationFrame
} = useAnimationFrame()

const {
  registerAnimationFrame: registerSecondAnimationFrame,
  removeAnimationFrame: removeSecondAnimationFrame
} = useAnimationFrame()
```
