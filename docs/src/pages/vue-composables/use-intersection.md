---
title: useIntersection composable
desc: What is useIntersection() composable and how you can use it
keys: useIntersection
badge: Quasar v2.30+
related:
  - /vue-components/intersection
  - /vue-directives/intersection
---

The `useIntersection()` composable tells you whether an element is visible on screen (or inside a scrolling parent), through a reactive Boolean. Under the hood it uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

It is the setup-code counterpart of the [Intersection directive](/vue-directives/intersection) and of the [QIntersection](/vue-components/intersection) component: all three share one Intersection Observer per configuration, so observing many elements stays cheap to scroll. Use the composable when you want the state on your component or on any element or component ref, without wrapping it in an extra DOM element.

::: tip
On the server-side of SSR or SSG modes, the composable never observes anything: `isIntersecting` stays `false` until the client takes over.
:::

## Syntax

```js
import { useTemplateRef } from 'vue'
import { useIntersection } from 'quasar'

setup () {
  const target = useTemplateRef('target') // an Element or a component

  const { isIntersecting, refresh, stop } = useIntersection({
    // all optional:
    target,               // omit it to observe the component's own root element
    root: null,           // Element used as viewport; null for the browser viewport
    rootMargin: '0px',    // CSS-like margin around the root
    threshold: 0,         // Number or Array of Numbers (0 to 1)
    once: false,          // stop observing after the first time the target is visible
    disabled: false,      // pause observing
    onIntersect (entry) { // called with every IntersectionObserverEntry
      // return false to stop observing
    }
  })

  // ...
}
```

```ts
function useIntersection(
  options?: MaybeRefOrGetter<{
    target?: MaybeRefOrGetter<
      Element | ComponentPublicInstance | null | undefined
    >
    root?: Element | Document | null
    rootMargin?: string
    threshold?: number | number[]
    once?: boolean
    disabled?: boolean
    onIntersect?: (entry: IntersectionObserverEntry) => boolean | void
  }>
): {
  isIntersecting: Ref<boolean>
  refresh: () => void
  stop: () => void
}
```

Without a `target`, the composable observes the root element of the component it is called in, as of the moment the component gets mounted. A component rendering a fragment (multiple root nodes) has no root element to observe, so supply a `target` there.

`refresh()` makes the observer report the current state again, whether it changed or not. An observer only reports changes on its own, so this is for the cases where your code needs a fresh verdict after doing something to the layout, such as knowing whether a target that was in view still is after the content around it grew.

`stop()` ends the observation for good. You will rarely need it, as the composable stops by itself when the component gets destroyed.

## Changing the options while running

The options can be a plain Object, a Ref or a getter Function. A plain Object is read once. With a Ref or a getter, the composable tracks whatever reactive state the options read and re-applies them whenever that state changes, so you never call anything to "update" it:

- toggling `disabled` pauses and resumes the observation (`isIntersecting` keeps its last value while paused)
- changing `root`, `rootMargin` or `threshold` moves the target to an observer with the new configuration
- pointing `target` to another element (or letting a template ref change through `v-if`) follows it
- swapping `onIntersect` takes effect from the next entry

Options that resolve to the same values are a no-op, so a getter that rebuilds the Object on every run costs nothing extra.

```js
import { ref } from 'vue'
import { useIntersection } from 'quasar'

setup () {
  const paused = ref(false)
  const threshold = ref(0)

  const { isIntersecting } = useIntersection(() => ({
    disabled: paused.value,
    threshold: threshold.value
  }))

  function pause () { paused.value = true }
  function resume () { paused.value = false }

  // from now on the handler fires only when at least
  // half of the element is visible
  function requireHalf () { threshold.value = 0.5 }

  // ...
}
```

The same works with a Ref holding the whole options Object:

```js
const options = ref({ rootMargin: '0px' })

const { isIntersecting } = useIntersection(options)

// later on
options.value = { rootMargin: '200px' }
```

A `once` observation that has already fired is over: toggling `disabled` or changing any other option afterwards does not start observing again. Call `useIntersection()` anew if you need a fresh one.

## Example

```html
<template>
  <div class="card">
    <img v-if="isIntersecting" :src="src" />
  </div>
</template>

<script setup>
  import { useIntersection } from 'quasar'

  defineProps({ src: String })

  // observes this component's root element (the card)
  const { isIntersecting } = useIntersection({
    rootMargin: '200px',
    once: true
  })
</script>
```

The image above starts loading a bit before the card enters the viewport and, thanks to `once`, the card is not observed anymore after that.

To observe a specific element or child component instead, hand over a template ref, and use the `onIntersect` hook should you need the raw entry (intersection ratio, bounding rects):

```html
<template>
  <div>
    <div ref="chartRef" class="chart" />
  </div>
</template>

<script setup>
  import { useTemplateRef } from 'vue'
  import { useIntersection } from 'quasar'

  const chartRef = useTemplateRef('chartRef')

  const { isIntersecting } = useIntersection({
    target: chartRef,
    threshold: [0, 0.5, 1],
    onIntersect(entry) {
      console.log('ratio', entry.intersectionRatio)
    }
  })
</script>
```
