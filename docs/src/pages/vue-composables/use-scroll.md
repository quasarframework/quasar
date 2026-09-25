---
title: useScroll composable
desc: What is useScroll() composable and how you can use it
keys: useScroll
badge: v2.34+
examples: useScroll
related:
  - /vue-components/scroll-observer
  - /vue-directives/scroll
  - /vue-directives/scroll-fire
---

The `useScroll()` composable tracks the scrolling of the page (or of a scrollable container) through reactive state: the scroll `position`, the `direction` of the last scroll, the `delta` since the previous report and the `inflectionPoint` where the direction last changed.

It is the setup-code counterpart of the [QScrollObserver](/vue-components/scroll-observer) component, which is built on it, and of the [v-scroll](/vue-directives/scroll) directive. Use the composable when you want the scroll details on your component, or on any scrollable container, without adding an extra node to your template.

> [!NOTE]
> On the server-side of SSR or SSG modes, the composable never listens to anything: the state keeps its initial values until the client takes over.

> [!TIP]
> **Outside of a component**
>
> The composable can also be called outside of `setup()`: in a boot file, a store or a plain module. There is no component root to start the detection from and no mount to wait for, so supply a `scrollTarget` (or a `target` element); the tracking starts right away and nothing stops it by itself: call `stop()` when you are done.

## Syntax

```js
import { useTemplateRef } from 'vue'
import { useScroll } from 'quasar'

setup () {
  const scrollTarget = useTemplateRef('scrollTarget') // an Element or a component

  const {
    position, direction, directionChanged, delta, inflectionPoint,
    refresh, stop
  } = useScroll({
    // all optional:
    scrollTarget,        // the scroll container; omit it for auto detection
    axis: 'vertical',    // 'vertical', 'horizontal' or 'both'
    debounce: 0,         // milliseconds; at most one report per window
    disabled: false,     // pause listening
    onScroll (details) { // called with the scroll details on every change
      // ...
    }
  })

  // ...
}
```

```ts
function useScroll(
  options?: MaybeRefOrGetter<{
    target?: MaybeRefOrGetter<
      Element | ComponentPublicInstance | null | undefined
    >
    scrollTarget?: MaybeRefOrGetter<
      Element | Window | string | ComponentPublicInstance | null | undefined
    >
    axis?: 'vertical' | 'horizontal' | 'both'
    debounce?: string | number
    disabled?: boolean
    onScroll?: (details: {
      position: { top: number; left: number }
      direction: 'up' | 'down' | 'left' | 'right'
      directionChanged: boolean
      delta: { top: number; left: number }
      inflectionPoint: { top: number; left: number }
    }) => void
  }>
): {
  position: Ref<{ top: number; left: number }>
  direction: Ref<'up' | 'down' | 'left' | 'right'>
  directionChanged: Ref<boolean>
  delta: Ref<{ top: number; left: number }>
  inflectionPoint: Ref<{ top: number; left: number }>
  refresh: () => void
  stop: () => void
}
```

The reactive state mirrors the details that QScrollObserver emits: `position`, `delta` and `inflectionPoint` are Objects with `top` and `left` offsets (in pixels), `direction` is the direction of the last scroll and `directionChanged` tells whether that last scroll reversed the direction.

## Which container gets tracked

Without options, the composable follows the [same algorithm](/vue-components/scroll-observer#determining-scrolling-container) as every scrolling component and directive of Quasar: starting from the root element of the component it is called in (as of the moment the component gets mounted), it looks for the closest parent with the `scroll`, `scroll-y` or `overflow-auto` CSS class and, if none is found, it listens to the page itself.

- `scrollTarget` names the container directly: an Element (or `window`), a CSS selector, or a component instance (standing for its root element), the same as the `scroll-target` prop of the scrolling components.
- `target` changes where the auto detection starts from: an element or component ref whose closest scrollable parent is the container you are after. This is what you need in a component rendering a fragment (multiple root nodes), which has no root element to start from.

The first report happens as soon as the container is available, should it be scrolled already; `onScroll` is called for it as well, then only when the position changes on the watched `axis`.

Without a `debounce`, the composable reports at most once per animation frame, no matter how many scroll events the browser fires in between. With `debounce: 0` it reports on every scroll event. With a `debounce` of some milliseconds, it reports at most once per window of that many milliseconds; the last change is never missed.

`refresh()` reads the position right away, skipping the debounce. You will rarely need it, since the browser reports every scroll on its own.

`stop()` ends the tracking for good. You will rarely need it either, as the composable stops by itself when the component gets destroyed.

## Changing the options while running

The options can be a plain Object, a Ref or a getter Function. A plain Object is read once. With a Ref or a getter, the composable tracks whatever reactive state the options read and re-applies them whenever that state changes, so you never call anything to "update" it:

- toggling `disabled` pauses and resumes the tracking (the state keeps its last values while paused, and resuming reports right away if the position moved meanwhile)
- pointing `scrollTarget` (or `target`) to another container follows it, starting from scratch
- changing `axis` or `debounce` applies from the next scroll
- swapping `onScroll` takes effect from the next scroll

```js
import { ref } from 'vue'
import { useScroll } from 'quasar'

setup () {
  const paused = ref(false)

  const { position } = useScroll(() => ({
    disabled: paused.value
  }))

  function pause () { paused.value = true }
  function resume () { paused.value = false }

  // ...
}
```

## Example

Tracking a scrollable container through a template ref, with every detail the composable reports:

<DocExample title="Scrolling container" file="Container" />

Without options, the auto detection starts from the component's root element and, on a standard layout, ends up on the page itself. Scroll this page down past the example below and back up a bit: the "back to top" button gets enabled once the page has been scrolled down and the user is scrolling up again:

<DocExample title="Page scroll" file="Page" />
