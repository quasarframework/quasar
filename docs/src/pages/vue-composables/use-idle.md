---
title: useIdle composable
desc: What is useIdle() composable and how you can use it
keys: useIdle
badge: v2.34+
examples: useIdle
related:
  - /vue-composables/use-event-listener
  - /vue-composables/use-timeout
  - /quasar-plugins/app-visibility
---

The `useIdle()` composable tells you when the user stopped interacting with your app: no mouse movement, click, key press, touch or wheel for a given amount of time. The typical uses are pausing polling or animations while nobody watches, warning about an expiring session before logging the user out, or dimming a kiosk screen.

It listens to the activity events on `document`, so it works for the whole page regardless of where your component is rendered.

> [!NOTE]
> On the server-side of SSR or SSG modes, the composable never tracks anything and `isIdle` stays `false`.

> [!TIP]
> **Outside of a component**
>
> The composable can also be called outside of `setup()`: in a boot file, a store or a plain module. It then starts tracking right away and nothing stops it by itself: call `stopIdle()` when you are done.

## Syntax

```js
import { useIdle } from 'quasar'

setup () {
  const { isIdle, lastActive, resetIdle, stopIdle } = useIdle({
    // all optional:
    timeout: 60000,  // ms of inactivity before the user counts as idle
    events: [        // the events (on document) that count as an activity
      'mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'
    ],
    disabled: false, // pause tracking
    onIdle (isIdle) { // called on every transition
      // ...
    }
  })

  // ...
}
```

```ts
function useIdle(
  options?: MaybeRefOrGetter<{
    timeout?: number
    events?: string[]
    disabled?: boolean
    onIdle?: (isIdle: boolean) => void
  }>
): {
  isIdle: Ref<boolean>
  lastActive: Ref<number>
  resetIdle: () => void
  stopIdle: () => void
}
```

`isIdle` becomes `true` once `timeout` milliseconds pass without any of the `events` firing, and goes back to `false` at the very next activity. The `onIdle` callback gets called with the new value on each of these transitions (never for the initial active state), so you do not need to watch the ref. `lastActive` holds the timestamp (as `Date.now()` would give it) of the last activity, which lets you display "away since" information or compute how much time is left before the user goes idle.

The activity events are listened to in the capture phase, so an activity counts even when some handler stops its propagation, and the listeners are passive, so they never delay scrolling. An activity itself is cheap: it records a timestamp and nothing more. The internal timer is armed once per period and checks the elapsed time when it fires, so a stream of `mousemove` events does not re-arm anything.

Time spent with the page hidden (another tab, a minimized window) counts as inactivity. Browsers throttle the timers of a hidden page, so the composable settles the state as soon as the page becomes visible again.

`resetIdle()` counts as an activity of your own, for interactions the events cannot see (a message received over a websocket that you consider as keeping the session alive, a video that keeps playing). `stopIdle()` ends the tracking for good; you will rarely need it, as the composable stops by itself when the component gets destroyed.

## Changing the options while running

The options can be a plain object, a Ref or a getter Function. Plain values are read once. With a Ref or a getter, the composable tracks whatever reactive state it reads and re-applies it whenever that state changes:

- toggling `disabled` pauses the tracking (a paused user is never idle) and re-enabling it starts a fresh period from that moment
- changing `timeout` re-evaluates the state right away: a shorter one may turn the user idle on the spot, a longer one may make them active again
- changing `events` replaces the listeners

```js
import { ref } from 'vue'
import { useIdle } from 'quasar'

setup () {
  const loggedIn = ref(false)

  const { isIdle } = useIdle(() => ({
    timeout: 5 * 60 * 1000,
    disabled: !loggedIn.value
  }))

  // ...
}
```

## Example

<DocExample title="Basic" file="Basic" />

Warning the user about an expiring session, with the warning going away by itself as soon as they interact again:

```js
import { ref } from 'vue'
import { useIdle } from 'quasar'

setup () {
  const showWarning = ref(false)

  useIdle({
    timeout: 10 * 60 * 1000,
    onIdle (isIdle) {
      showWarning.value = isIdle
    }
  })

  // ...
}
```

> [!TIP]
> To react to the page itself being hidden or shown, regardless of the user's activity, use the [AppVisibility](/quasar-plugins/app-visibility) plugin.
