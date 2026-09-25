---
title: useElementResize composable
desc: What is useElementResize() composable and how you can use it
keys: useElementResize
badge: v2.34+
examples: useElementResize
related:
  - /vue-components/resize-observer
  - /vue-directives/resize
---

The `useElementResize()` composable tracks the size of an element (or of a component) through two reactive Numbers, `width` and `height`. Under the hood it uses the [Resize Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API), so no polling is involved.

It is the setup-code counterpart of the [QResizeObserver](/vue-components/resize-observer) component, which is built on it, and of the [v-resize](/vue-directives/resize) directive. Use the composable when you want the size on your component or on any element or component ref, without adding an extra node to your template.

The reported size is the element's outer size (padding and border included), so a padding change on the element itself is reported too.

> [!NOTE]
> On the server-side of SSR or SSG modes, the composable never measures anything: `width` and `height` stay `0` until the client takes over.

> [!TIP]
> **Outside of a component**
>
> The composable can also be called outside of `setup()`: in a boot file, a store or a plain module. There is no component root to fall back on and no mount to wait for, so supply a `target` (an element, or a ref or getter of one); the observation starts right away and nothing stops it by itself: call `stop()` when you are done.

## Syntax

```js
import { useTemplateRef } from 'vue'
import { useElementResize } from 'quasar'

setup () {
  const target = useTemplateRef('target') // an Element or a component

  const { width, height, refresh, stop } = useElementResize({
    // all optional:
    target,           // omit it to measure the component's own root element
    debounce: 0,      // milliseconds; at most one measurement per window
    disabled: false,  // pause observing
    onResize (size) { // called with { width, height } on every change
      // ...
    }
  })

  // ...
}
```

```ts
function useElementResize(
  options?: MaybeRefOrGetter<{
    target?: MaybeRefOrGetter<
      Element | ComponentPublicInstance | null | undefined
    >
    debounce?: string | number
    disabled?: boolean
    onResize?: (size: { width: number; height: number }) => void
  }>
): {
  width: Ref<number>
  height: Ref<number>
  refresh: () => void
  stop: () => void
}
```

Without a `target`, the composable measures the root element of the component it is called in, as of the moment the component gets mounted. A component rendering a fragment (multiple root nodes) has no root element to measure, so supply a `target` there.

The first measurement happens as soon as the element is available, so `width` and `height` hold its size right after your component gets mounted; `onResize` is called for it as well, then only when the size changes.

With a `debounce`, the element gets measured at most once per window of that many milliseconds: a continuous resize (dragging a splitter, animating a width) reports periodically rather than on every frame, and the last change is never missed.

`refresh()` measures the element right away, skipping the debounce. You will rarely need it, since the browser reports every change on its own.

`stop()` ends the observation for good. You will rarely need it either, as the composable stops by itself when the component gets destroyed.

## Changing the options while running

The options can be a plain Object, a Ref or a getter Function. A plain Object is read once. With a Ref or a getter, the composable tracks whatever reactive state the options read and re-applies them whenever that state changes, so you never call anything to "update" it:

- toggling `disabled` pauses and resumes the observation (`width` and `height` keep their last values while paused, and resuming measures right away)
- pointing `target` to another element (or letting a template ref change through `v-if`) follows it and reports the new element's size
- changing `debounce` applies from the next change
- swapping `onResize` takes effect from the next change

```js
import { ref } from 'vue'
import { useElementResize } from 'quasar'

setup () {
  const paused = ref(false)

  const { width, height } = useElementResize(() => ({
    disabled: paused.value,
    debounce: paused.value ? 0 : 100
  }))

  function pause () { paused.value = true }
  function resume () { paused.value = false }

  // ...
}
```

## Example

The box below is measured through a template ref: `width` and `height` follow it, and the `onResize` hook counts how many times the size got reported:

<DocExample title="Measuring an element" file="Basic" />

To measure the component's own root element instead, omit the `target`:

```html
<template>
  <div class="chart">
    <svg :viewBox="`0 0 ${width} ${height}`" :width="width" :height="height">
      <!-- ... -->
    </svg>
  </div>
</template>

<script setup>
  import { useElementResize } from 'quasar'

  // measures this component's root element (the chart container)
  const { width, height } = useElementResize({ debounce: 100 })
</script>
```
