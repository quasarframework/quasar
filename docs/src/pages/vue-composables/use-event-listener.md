---
title: useEventListener composable
desc: What is useEventListener() composable and how you can use it
keys: useEventListener
badge: v2.34+
examples: useEventListener
related:
  - /vue-composables/use-scroll
  - /vue-composables/use-element-resize
---

The `useEventListener()` composable attaches an event listener to an element, to `window`, to `document` or to a component, and takes care of everything around it: it waits for the target to exist, follows a target that changes, removes the listener when your component gets destroyed and re-attaches it when the event name or the listener options change.

Use it wherever a template listener cannot reach: `window` and `document` events, an element outside of your template, or an event that must be listened to with `capture`, `passive` or `once` options driven by your own state.

> [!WARNING]
> **SSR and SSG**
>
> On the server-side, the composable never listens to anything, but the arguments you pass are still evaluated there. Reference `window` or `document` through a getter Function (`() => window`), which only ever runs on the client, instead of passing them directly.

> [!TIP]
> **Outside of a component**
>
> The composable can also be called outside of `setup()`: in a boot file, a store or a plain module. There is no mount to wait for there, so it starts listening right away (give it an element, `window` or `document` rather than a template ref) and nothing stops it by itself: call `stop()` when you are done.

## Syntax

```js
import { useTemplateRef } from 'vue'
import { useEventListener } from 'quasar'

setup () {
  const target = useTemplateRef('target') // an Element or a component

  const { stop } = useEventListener(
    target,            // or () => window, () => document, any EventTarget
    'keydown',         // or an Array of event names
    (evt) => {         // called with the Event
      // ...
    },
    {                  // all optional:
      capture: false,  // addEventListener() options
      passive: false,
      once: false,
      disabled: false  // pause listening
    }
  )

  // ...
}
```

```ts
function useEventListener<E extends Event = Event>(
  target: MaybeRefOrGetter<
    EventTarget | ComponentPublicInstance | null | undefined
  >,
  event: MaybeRefOrGetter<string | string[]>,
  handler: (evt: E) => void,
  options?: MaybeRefOrGetter<{
    capture?: boolean
    passive?: boolean
    once?: boolean
    disabled?: boolean
  }>
): {
  stop: () => void
}
```

The `target` can be any EventTarget (`window`, `document`, an element) or a component instance (standing for its root element), given directly or through a Ref or a getter Function. A template ref is the usual case: the composable starts listening as soon as your component gets mounted and the ref is populated, and a `null` or `undefined` target simply means there is nothing to listen to yet. A component rendering a fragment (multiple root nodes) has no root element to listen on.

The `event` is a single event name or an Array of names (the same handler serves all of them). It can be a Ref or a getter too, in which case the listener follows it.

Unless you set `passive`, the browser's own default applies, so a `touchstart` or `wheel` listener on `window` or `document` stays passive as the browser intends it to be.

`stop()` removes the listener for good. You will rarely need it, as the composable stops by itself when the component gets destroyed.

## Changing the options while running

The target, the event and the options can be plain values, Refs or getter Functions. Plain values are read once. With Refs or getters, the composable tracks whatever reactive state they read and re-applies them whenever that state changes, so you never call anything to "update" it:

- toggling `disabled` removes and re-attaches the listener
- pointing the target to another element (or letting a template ref change through `v-if`) moves the listener along
- changing the event name or the `capture`, `passive` or `once` options re-attaches the listener with the new ones

```js
import { ref } from 'vue'
import { useEventListener } from 'quasar'

setup () {
  const listening = ref(true)

  useEventListener(() => window, 'keydown', onKeydown, () => ({
    disabled: !listening.value
  }))

  function onKeydown (evt) { /* ... */ }

  // ...
}
```

## Example

Listening to `keydown` on the whole document, with the listener paused through a reactive option:

<DocExample title="Document keydown" file="Basic" />

Listening to `window` events from setup code, without any node in the template (a `beforeunload` guard for unsaved changes here):

```js
import { ref } from 'vue'
import { useEventListener } from 'quasar'

setup () {
  const dirty = ref(false)

  useEventListener(() => window, 'beforeunload', evt => {
    if (dirty.value) evt.preventDefault()
  })

  return { dirty }
}
```

> [!TIP]
> For the state that Quasar already tracks for you, reach for the plugins instead: [AppVisibility](/quasar-plugins/app-visibility) for the page visibility, [AppNetwork](/quasar-plugins/app-network) for the online state, [Screen](/options/screen-plugin) for the viewport size and breakpoints.
