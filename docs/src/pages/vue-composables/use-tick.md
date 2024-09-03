---
title: useTick composable
desc: What is useTick() composable and how you can use it
keys: useTick
badge: Quasar v2.15+
---

The `useTick()` composable is similar in scope with the `nextTick()` from Vue, with some key differences. Once you trigger a nextTick() it will get executed in the next "tick" no matter what. The useTick() on the other hand, can be "cancelled". You can also override it.

In other words, if you want to schedule a function on the next Vue "tick" but you might want to override it or even cancel it, this is the composable for you.

The useTick composable also automatically cancels the next registered "tick" (if any was registered and still pending) when your component gets destroyed.

## Syntax

```js
import { useTick } from 'quasar'

setup () {
  const {
    registerTick,
    removeTick
  } = useTick()

  // ...
}
```

```js
function useTick(): {
  registerTick(fn: () => void): void;
  removeTick(): void;
};
```

## Example

```js
import { useTick } from 'quasar'

setup () {
  const { registerTick } = useTick()

  function onSomeEvent (param) {
    registerTick(() => {
      console.log('param is', param)
    })
  }

  // ...

  // You can call onSomeEvent() multiple
  // times in a row and only the last
  // registered "tick" will run when it
  // is time for it
}
```

Should you need more than one useTick() per component, simply rename the functions of the returned object:

```js
const {
  registerTick: registerFirstTick,
  removeTick: removeFirstTick
} = useTick()

const {
  registerTick: registerSecondTick,
  removeTick: removeSecondTick
} = useTick()
```
