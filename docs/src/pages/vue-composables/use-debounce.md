---
title: useDebounce composable
desc: What is useDebounce() composable and how you can use it
keys: useDebounce
badge: v2.34+
examples: useDebounce
related:
  - /vue-composables/use-throttle
  - /vue-composables/use-timeout
  - /quasar-utils/other-utils
---

The `useDebounce()` composable is the [debounce](/quasar-utils/other-utils#debounce) util made aware of your component: it returns the same kind of debounced Function, drops the waiting call when the component gets destroyed or deactivated (keep-alive related), ignores the calls made while it is in that state, and tells you through a reactive Ref whether a call is waiting.

Debouncing runs your Function once, after the calls stop coming for `wait` milliseconds: typing into a search field, resizing, dragging. The last call's arguments are the ones your Function receives.

> [!NOTE]
> On the server-side of SSR or SSG modes, `debounceFn` does nothing and `isDebouncePending` stays `false`.

> [!NOTE]
> The composable is for `setup()` only. Outside of a component (a boot file, a store, a plain module) use the [debounce](/quasar-utils/other-utils#debounce) util directly: it is the same Function, and nothing there gets destroyed that could drop a waiting call for you.

> [!TIP]
> Form fields need no composable: [QInput](/vue-components/input) has a `debounce` prop and [QSelect](/vue-components/select) an `input-debounce` one, which debounce the model update and the filter input respectively.

## Syntax

```js
import { useDebounce } from 'quasar'

setup () {
  const {
    debounceFn,        // call it as you would call fn
                       //   debounceFn.cancel() drops the waiting call
                       //   debounceFn.flush() runs the waiting call right away
    isDebouncePending  // Ref<boolean>
  } = useDebounce(
    fn,
    300, // ms to wait after the last call (default: 250)
    true // immediate: run fn on the first call instead of the last one (default: false)
  )

  // ...
}
```

```ts
function useDebounce<F extends (...args: any[]) => any>(
  fn: F,
  wait?: number, // default: 250
  immediate?: boolean // default: false
): {
  debounceFn: ((this: ThisParameterType<F>, ...args: Parameters<F>) => void) & {
    cancel(): void
    flush(): void
  }
  isDebouncePending: Ref<boolean>
}
```

`debounceFn` takes the same arguments as `fn` and forwards `this` to it, so it can replace `fn` anywhere: an event handler, a watcher callback, an Options API method. Calling it while a call is already waiting replaces that call and restarts the wait. Like the util's, it carries `cancel()` (drops the waiting call) and `flush()` (runs the waiting call right away).

`isDebouncePending` is `true` while a call to `fn` is waiting to run. It turns `false` right before `fn` runs, when you call `debounceFn.cancel()` or `debounceFn.flush()`, and when the component gets destroyed or deactivated.

With `immediate` set to `true`, `fn` runs on the first call instead and the calls made during the following `wait` milliseconds are swallowed (each of them restarts the wait). No call ever waits in this mode, so `isDebouncePending` stays `false` and `debounceFn.flush()` has nothing to run; `debounceFn.cancel()` ends the wait period, so that the next call runs right away.

## Example

<DocExample title="Pointer tracking" file="Basic" />

Saving a draft while the user edits, with the last edit saved for sure before leaving the page:

```js
import { ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useDebounce } from 'quasar'

setup () {
  // <q-editor v-model="draft" />
  const draft = ref('')

  const { debounceFn: saveDraft } = useDebounce(value => {
    // send it to the server...
  }, 1000)

  watch(draft, saveDraft)

  onBeforeRouteLeave(() => {
    saveDraft.flush()
  })

  return { draft }
}
```

> [!TIP]
> To run `fn` at a steady rate while the calls keep coming, rather than once they stop, use [useThrottle](/vue-composables/use-throttle) instead.
