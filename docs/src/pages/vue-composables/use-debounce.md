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

The `useDebounce()` composable is the [debounce](/quasar-utils/other-utils#debounce) util made aware of your component: it returns the very same debounced Function, drops the waiting call when the component gets destroyed or deactivated (keep-alive related), and makes its `isPending` reactive, so your template can use it directly.

Debouncing runs your Function once, after the calls stop coming for `wait` milliseconds: typing into a search field, resizing, dragging. The last call's arguments are the ones your Function receives.

> [!NOTE]
> On the server-side of SSR or SSG modes, `debounceFn` does nothing and `debounceFn.isPending` stays `false`.

> [!NOTE]
> The composable is for `setup()` only. Outside of a component (a boot file, a store, a plain module) use the [debounce](/quasar-utils/other-utils#debounce) util directly: it is the same Function, and nothing there gets destroyed that could drop a waiting call for you.

> [!TIP]
> Form fields need no composable: [QInput](/vue-components/input) has a `debounce` prop and [QSelect](/vue-components/select) an `input-debounce` one, which debounce the model update and the filter input respectively.

## Syntax

```js
import { useDebounce } from 'quasar'

setup () {
  // call it as you would call fn
  //   debounceFn.cancel() drops the waiting call
  //   debounceFn.flush() runs the waiting call right away
  //   debounceFn.isPending is true while a call is waiting (reactive)
  const debounceFn = useDebounce(
    fn,
    300, // ms to wait after the last call (default: 250)
    { // options; true is shorthand for { leading: true, trailing: false }
      leading: false, // also run fn on the first call of a burst (default: false)
      trailing: true, // run fn once the calls stop (default: true)
      maxWait: 2000 // run fn at least this often while the calls keep coming (default: none)
    }
  )

  // ...
}
```

```ts
function useDebounce<F extends (...args: any[]) => any>(
  fn: F,
  wait?: number, // default: 250
  options?:
    // default: false
    // true is equivalent to { leading: true, trailing: false }
    | boolean
    // v2.34+
    | {
        leading?: boolean // default: false
        trailing?: boolean // default: true
        maxWait?: number // default: none
      }
): ((this: ThisParameterType<F>, ...args: Parameters<F>) => void) & {
  cancel(): void
  flush(): void
  readonly isPending: boolean // reactive
}
```

The returned Function takes the same arguments as `fn` and forwards `this` to it, so it can replace `fn` anywhere: an event handler, a watcher callback, an Options API method. Calling it while a call is already waiting replaces that call and restarts the wait. Like the util's, it carries `cancel()` (drops the waiting call) and `flush()` (runs the waiting call right away).

Its `isPending` is `true` while a call to `fn` is waiting to run. It turns `false` right before `fn` runs, when you call `cancel()` or `flush()`, and when the component gets destroyed or deactivated. Unlike the util's, it is reactive: read it in your template (`v-if="search.isPending"`), in a `computed()` or in a `watch(() => search.isPending, ...)` and it gets tracked. Do not destructure it out of the Function though (`const { isPending } = search` copies the current Boolean); when you need a Ref, use `computed(() => search.isPending)`.

The `options` are the [debounce](/quasar-utils/other-utils#debounce) util's. With `leading` on, `fn` also runs on the first call of a burst, right away, so nothing waits until a second call comes. With `maxWait`, `fn` runs at least once every `maxWait` milliseconds while the calls keep coming, so `isPending` turns `false` at each of these runs too.

Passing `true` (shorthand for `{ leading: true, trailing: false }`) runs `fn` on the first call only; the calls made during the following `wait` milliseconds are swallowed (each of them restarts the wait). No call ever waits in this mode, so `isPending` stays `false` and `flush()` has nothing to run; `cancel()` ends the wait period, so that the next call runs right away.

## Example

<DocExample title="Pointer tracking" file="PointerTracking" />

Saving a draft while the user edits, at least every five seconds of continuous editing, with the last edit saved for sure before leaving the page:

```js
import { ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useDebounce } from 'quasar'

setup () {
  // <q-editor v-model="draft" />
  const draft = ref('')

  const saveDraft = useDebounce(value => {
    // send it to the server...
  }, 1000, { maxWait: 5000 })

  watch(draft, saveDraft)

  onBeforeRouteLeave(() => {
    saveDraft.flush()
  })

  return { draft }
}
```

> [!TIP]
> To run `fn` at a steady rate while the calls keep coming, rather than once they stop, use [useThrottle](/vue-composables/use-throttle) instead.
