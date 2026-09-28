---
title: useThrottle composable
desc: What is useThrottle() composable and how you can use it
keys: useThrottle
badge: v2.34+
examples: useThrottle
related:
  - /vue-composables/use-debounce
  - /vue-composables/use-timeout
  - /quasar-utils/other-utils
---

The `useThrottle()` composable is the [throttle](/quasar-utils/other-utils#throttle) util made aware of your component: it returns the same kind of throttled Function, drops the waiting call when the component gets destroyed or deactivated (keep-alive related), ignores the calls made while it is in that state, and tells you through a reactive Ref whether a call is waiting.

Throttling runs your Function at most once every `limit` milliseconds while the calls keep coming: a scroll or mousemove handler that updates the UI, a progress report, a button that must not submit twice. The first call runs right away; the calls made during the following `limit` milliseconds are dropped, or, with the `trailing` option, the last of them runs at the end of the window.

> [!NOTE]
> On the server-side of SSR or SSG modes, `throttleFn` does nothing and `isThrottlePending` stays `false`.

> [!NOTE]
> The composable is for `setup()` only. Outside of a component (a boot file, a store, a plain module) use the [throttle](/quasar-utils/other-utils#throttle) util directly: it is the same Function, and nothing there gets destroyed that could drop a waiting call for you.

## Syntax

```js
import { useThrottle } from 'quasar'

setup () {
  const {
    throttleFn,        // call it as you would call fn
    cancelThrottle,    // drop the waiting call and close the window
    flushThrottle,     // run the waiting call right away, as if the window had just ended
    isThrottlePending  // Ref<boolean>
  } = useThrottle(fn, 100, {
    // all optional:
    trailing: true // also run the last call made during a window at its end (default: false)
  })

  // ...
}
```

```ts
function useThrottle<F extends (...args: any[]) => any>(
  fn: F,
  limit?: number, // default: 250
  options?: {
    trailing?: boolean
  }
): {
  throttleFn: F
  cancelThrottle: () => void
  flushThrottle: () => void
  isThrottlePending: Ref<boolean>
}
```

`throttleFn` takes the same arguments as `fn`, forwards `this` to it and returns the result of the last run, so it can replace `fn` anywhere: an event handler, a watcher callback, an Options API method.

Without `trailing`, only the calls that find no window open run, so a burst of calls ends with the state of its first call. With `trailing: true`, the last call made during a window runs at the end of it (with its own arguments), so the state of the last call always gets through; that run opens a window of its own. Leave `trailing` off when a late run would be harmful, like a submit handler.

`isThrottlePending` is `true` while a trailing call is waiting to run. It turns `false` right before `fn` runs, when you call `cancelThrottle()` or `flushThrottle()`, and when the component gets destroyed or deactivated. Without `trailing` no call ever waits, so it stays `false`.

`cancelThrottle()` drops the waiting call and closes the window, so that the next call runs right away. `flushThrottle()` runs the waiting call right away, as if the window had just ended: a fresh window opens from that moment, so the rate limit holds. Without a waiting call it does nothing.

Should you need more than one useThrottle() per component, simply rename the properties of the returned object:

```js
const { throttleFn: onScroll } = useThrottle(trackScroll, 100, {
  trailing: true
})
const { throttleFn: onSubmit } = useThrottle(submit, 1000)
```

## Example

<DocExample title="Pointer tracking" file="Basic" />

Protecting a button against double submissions:

```js
import { useThrottle } from 'quasar'

setup () {
  // <q-btn label="Submit" @click="onSubmit" />
  const { throttleFn: onSubmit } = useThrottle(() => {
    // the calls made during the next second are dropped
  }, 1000)

  return { onSubmit }
}
```

> [!TIP]
> To run `fn` once the calls stop coming, rather than at a steady rate while they do, use [useDebounce](/vue-composables/use-debounce) instead.
