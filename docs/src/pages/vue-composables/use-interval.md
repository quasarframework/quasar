---
title: useInterval composable
desc: What is useInterval() composable and how you can use it
keys: useInterval
badge: v2.15.1+
---

The `useInterval()` composable is similar in scope with the native `setInterval()`, with some key differences. The composable takes care of "cancelling" the interval if your component gets destroyed or deactivated (keep-alive related) and you can also override the executing Function while it's running.

On an SSR server, registering an interval is a no-op. Start server-side work explicitly outside the component rendering lifecycle rather than creating a timer during `setup()`.

> [!TIP]
> **Outside of a component**
>
> The composable can also be called outside of `setup()`: in a boot file, a store or a plain module. Nothing stops the interval by itself there, as no component gets destroyed or deactivated: call `removeInterval()` when you are done.

## Syntax

```js
import { useInterval } from 'quasar'

setup () {
  const {
    registerInterval,
    removeInterval,
    isIntervalActive
  } = useInterval()

  // ...
}
```

```ts
function useInterval(): {
  registerInterval(fn: () => void, interval?: string | number): void
  removeInterval(): void
  isIntervalActive: Ref<boolean> // v2.34+
}
```

## Example

```js
import { useInterval } from 'quasar'

setup () {
  const { registerInterval } = useInterval()

  function onSomeEvent (param) {
    registerInterval(() => {
      console.log('param is', param)
    }, 2000) // every 2 seconds
  }

  // ...

  // You can call onSomeEvent() multiple
  // times in a row and only the last
  // registered Function will run when it
  // is time for it

  // Note that the interval is reset each
  // time you register/override it
}
```

Should you need more than one useInterval() per component, simply rename the properties of the returned object:

```js
const {
  registerInterval: registerFirstInterval,
  removeInterval: removeFirstInterval,
  isIntervalActive: isFirstIntervalActive
} = useInterval()

const {
  registerInterval: registerSecondInterval,
  removeInterval: removeSecondInterval,
  isIntervalActive: isSecondIntervalActive
} = useInterval()
```

## Running state <q-badge label="v2.34+" />

The returned `isIntervalActive` is a reactive boolean Ref which is `true` while an interval is registered. It turns `false` when you call `removeInterval()` and when the component gets destroyed or deactivated. On the server-side of SSR or SSG modes it is always `false`.

```html
<template>
  <q-btn
    :label="isIntervalActive ? 'Stop polling' : 'Start polling'"
    @click="isIntervalActive ? removeInterval() : registerInterval(poll, 5000)"
  />
</template>

<script setup>
  import { useInterval } from 'quasar'

  const { registerInterval, removeInterval, isIntervalActive } = useInterval()

  function poll() {
    // ...
  }
</script>
```
