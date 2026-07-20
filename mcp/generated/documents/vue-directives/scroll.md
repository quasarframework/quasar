---
title: Directive v-scroll
description: Vue directive which triggers an event when user scrolls.
canonical: https://quasar.dev/vue-directives/scroll
kinds: directive
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [Scroll](../../api/Scroll.md)

This is a Vue directive which takes one parameter (a Function) and fires when user scrolls the page containing that DOM node.

::: tip TIPS

- One alternative to using this directive is to place a [QScrollObserver](/vue-components/scroll-observer) component on your page.
- There is one more scrolling-related directive available called [Scroll Fire](/vue-directives/scroll-fire).

:::

**API reference:** [Scroll](../../api/Scroll.md)

## Usage

```html
<template>
  ...
  <div v-scroll="onScroll">...</div>
  ...
</template>

<script setup>
  function onScroll(position) {
    // when this method is invoked then it means user
    // has scrolled the page to `position`
    //
    // `position` is an Integer designating the current
    // scroll position in pixels.
  }
</script>
```

```html
<template>
  ...
  <div v-scroll="onScroll">...</div>
  ...
</template>

<script setup>
  import { debounce } from 'quasar'

  const onScroll = debounce(position => {
    // when this method is invoked then it means user
    // has scrolled the page to `position`
    //
    // `position` is an Integer designating the current
    // scroll position in pixels.
  }, 200) // debounce for 200ms
</script>
```

### Determining Scrolling Container

Please read [here](/vue-components/scroll-observer#determining-scrolling-container) about how Quasar determines the container to attach scrolling events to.
