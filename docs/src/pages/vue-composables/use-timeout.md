---
title: useTimeout composable
desc: What is useTimeout() composable and how you can use it
keys: useTimeout
badge: v2.15+
---

The `useTimeout()` composable is similar in scope with the native `setTimeout()`, with some key differences. The composable takes care of "cancelling" the timeout if your component gets destroyed or deactivated (keep-alive related) and you can also override the executing Function before the timeout expires.

In other words, if you want to schedule a function after a delay but you might want to override it or even cancel it before the delay happens, this is the composable for you.

> [!NOTE]
> On the server-side of SSR or SSG modes, registering a timeout is a no-op. Start server-side work explicitly outside the component rendering lifecycle rather than creating a timer during `setup()`.

## Syntax

```js
import { useTimeout } from 'quasar'

setup () {
  const {
    registerTimeout,
    removeTimeout,
    isTimeoutPending
  } = useTimeout()

  // ...
}
```

```ts
function useTimeout(): {
  registerTimeout(fn: () => void, delay?: string | number): void
  removeTimeout(): void
  isTimeoutPending: Ref<boolean> // v2.34+
}
```

## Example

```js
import { useTimeout } from 'quasar'

setup () {
  const { registerTimeout } = useTimeout()

  function onSomeEvent (param) {
    registerTimeout(() => {
      console.log('param is', param)
    }, 2000) // in 2 seconds
  }

  // ...

  // You can call onSomeEvent() multiple
  // times in a row and only the last
  // registered Function will run when it
  // is time for it

  // Note that the delay is reset each
  // time you register/override the timeout
}
```

Should you need more than one useTimeout() per component, simply rename the properties of the returned object:

```js
const {
  registerTimeout: registerFirstTimeout,
  removeTimeout: removeFirstTimeout,
  isTimeoutPending: isFirstTimeoutPending
} = useTimeout()

const {
  registerTimeout: registerSecondTimeout,
  removeTimeout: removeSecondTimeout,
  isTimeoutPending: isSecondTimeoutPending
} = useTimeout()
```

## Pending state <q-badge label="v2.34+" />

The returned `isTimeoutPending` is a reactive boolean Ref which is `true` while a registered Function is waiting to run. It turns `false` right before the Function executes, when you call `removeTimeout()`, and when the component gets destroyed or deactivated. On the server-side of SSR or SSG modes it is always `false`.

```html
<template>
  <q-btn label="Save" :loading="isTimeoutPending" @click="onSave" />
</template>

<script setup>
  import { useTimeout } from 'quasar'

  const { registerTimeout, isTimeoutPending } = useTimeout()

  function onSave() {
    // debounce: only the last click within 500ms saves
    registerTimeout(() => {
      // ...
    }, 500)
  }
</script>
```
