---
title: useTimeout composable
desc: What is useTimeout() composable and how you can use it
keys: useTimeout
badge: Quasar v2.15+
---

The `useTimeout()` composable is similar in scope with the native `setTimeout()`, with some key differences. Once you trigger a setTimeout(fn, delay) it will get executed after the specified delay no matter what. The useTimeout() on the other hand, can be "cancelled". You can also override the executing Function before the timeout expires.

In other words, if you want to schedule a function after a delay but you might want to override it or even cancel it before the delay happens, this is the composable for you.

The useTimeout composable also automatically cancels (if it was registered and still pending) when your component gets destroyed.

## Syntax

```js
import { useTimeout } from 'quasar'

setup () {
  const {
    registerTimeout,
    removeTimeout
  } = useTimeout()

  // ...
}
```

```js
function useTimeout(): {
  registerTimeout(fn: () => void, delay?: string | number): void;
  removeTimeout(): void;
};
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

Should you need more than one useTimeout() per component, simply rename the functions of the returned object:

```js
const {
  registerTimeout: registerFirstTimeout,
  removeTimeout: removeFirstTimeout
} = useTimeout()

const {
  registerTimeout: registerSecondTimeout,
  removeTimeout: removeSecondTimeout
} = useTimeout()
```
