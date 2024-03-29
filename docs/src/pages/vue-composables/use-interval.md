---
title: useInterval composable
desc: What is useInterval() composable and how you can use it
keys: useInterval
badge: Quasar v2.15.1+
---

The `useInterval()` composable is similar in scope with the native `setInterval()`, with some key differences. The composable takes care of "cancelling" the interval if your component gets destroyed and you can also override the executing Function while it's running.

## Syntax

```js
import { useInterval } from 'quasar'

setup () {
  const {
    registerInterval,
    removeInterval
  } = useInterval()

  // ...
}
```

```js
function useInterval(): {
  registerInterval(fn: () => void, interval: string | number): void;
  removeInterval(): void;
};
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

Should you need more than one useInterval() per component, simply rename the functions of the returned object:

```js
const {
  registerInterval: registerFirstInterval,
  removeInterval: removeFirstInterval
} = useInterval()

const {
  registerInterval: registerSecondInterval,
  removeInterval: removeSecondInterval
} = useInterval()
```
