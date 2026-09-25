---
title: useSoftFullscreen composable
desc: What is useSoftFullscreen() composable and how you can use it
keys: useSoftFullscreen
badge: v2.34+
examples: useSoftFullscreen
related:
  - /quasar-plugins/app-fullscreen
  - /vue-components/table
  - /vue-components/carousel
  - /vue-components/editor
---

The `useSoftFullscreen()` composable makes an element (or a component) take over the whole viewport, the way the `fullscreen` prop of [QTable](/vue-components/table), [QCarousel](/vue-components/carousel) and [QEditor](/vue-components/editor) does. Those components are built on it.

It is a "soft" fullscreen: the browser stays as it is and only the page changes, as opposed to the [AppFullscreen](/quasar-plugins/app-fullscreen) plugin which wraps the browser's Fullscreen API. The element gets moved to the end of `<body>` for the duration, leaving a placeholder at its original position, so that it escapes any ancestor with an overflow, a transform or a stacking context of its own. You style the element for the occasion, which the Quasar `fullscreen` CSS class does out of the box.

Any focus and caret held inside the element survive the move. On Capacitor and Cordova apps, the phone's back button leaves the fullscreen state (the same as it does for the components), and so does a route change unless you opt out.

> [!NOTE]
> On the server-side of SSR or SSG modes, the composable does nothing: `inFullscreen` stays `false` and the methods are no-ops.

> [!TIP]
> **Outside of a component**
>
> The composable can also be called outside of `setup()`: in a boot file, a store or a plain module. There is no component root to fall back on, so supply a `target`. A route change does not leave the fullscreen state there (nothing ties the call to the router) and nothing exits it by itself: call `exitFullscreen()` when you are done.

## Syntax

```js
import { useTemplateRef } from 'vue'
import { useSoftFullscreen } from 'quasar'

setup () {
  const target = useTemplateRef('target') // an Element or a component

  const {
    inFullscreen, setFullscreen, exitFullscreen, toggleFullscreen
  } = useSoftFullscreen({
    // all optional:
    target,             // omit it for the component's own root element
    fullscreen: false,  // the requested state (declarative form)
    noRouteExit: false  // keep the state across route changes
  })

  // ...
}
```

```ts
function useSoftFullscreen(
  options?: MaybeRefOrGetter<{
    target?: MaybeRefOrGetter<
      Element | ComponentPublicInstance | null | undefined
    >
    fullscreen?: boolean
    noRouteExit?: boolean
  }>
): {
  inFullscreen: Ref<boolean>
  setFullscreen: () => void
  exitFullscreen: () => void
  toggleFullscreen: () => void
}
```

Without a `target`, the composable drives the root element of the component it is called in. A component rendering a fragment (multiple root nodes) has no root element to move, so supply a `target` there.

`inFullscreen` is the current state. Bind the `fullscreen` CSS class (or your own) to it on the element:

```html
<template>
  <div ref="panel" :class="{ fullscreen: inFullscreen }">
    <q-btn
      flat
      :icon="inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
      @click="toggleFullscreen"
    />
    <!-- ... -->
  </div>
</template>

<script setup>
  import { useTemplateRef } from 'vue'
  import { useSoftFullscreen } from 'quasar'

  const panel = useTemplateRef('panel')
  const { inFullscreen, toggleFullscreen } = useSoftFullscreen({
    target: panel
  })
</script>
```

You can drive the state either way:

- imperatively, through `setFullscreen()`, `exitFullscreen()` and `toggleFullscreen()`
- declaratively, through the `fullscreen` option: the element enters or leaves the fullscreen state whenever the option changes (and starts in it when the option is `true` at mount; a request made while the target does not exist yet waits for it)

The declarative form is what a `fullscreen` prop of your own component maps to. Both forms mix freely; the composable only acts on the option when its value changes, so a state you set imperatively stays put until the option changes again. The same holds for the exits the composable performs on its own (the phone's back button, a route change): with the option still `true`, set it to `false` and back to `true` to re-enter, or keep the option in sync with `inFullscreen` (a `v-model`-style prop does exactly that).

## Changing the options while running

The options can be a plain Object, a Ref or a getter Function. A plain Object is read once. With a Ref or a getter, the composable tracks whatever reactive state the options read and re-applies them whenever that state changes:

- flipping `fullscreen` enters or leaves the fullscreen state
- pointing `target` to another element while in fullscreen puts the current element back in place and, if the state was requested through the `fullscreen` option, moves the new one to fullscreen; a target that goes away (through `v-if`) leaves the fullscreen state and, while the option still asks for it, gets back to fullscreen when it comes back
- `noRouteExit` applies to the next route change

A component kept alive by `<KeepAlive>` leaves the fullscreen state when it gets deactivated. When it gets activated again, it goes back to fullscreen only if the `fullscreen` option asks for it.

## Example

A photo viewer card through a template ref (a component, standing for its root element): its toolbar button toggles the soft fullscreen state and the photo grows to fill the viewport.

<DocExample title="Photo viewer" file="Basic" />
