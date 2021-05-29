---
title: Directive v-scroll
desc: Vue directive which triggers an event when user scrolls.
related:
  - /vue-directives/scroll-fire
  - /vue-components/scroll-observer
---

This is a Vue directive which takes one parameter (a Function) and fires when user scrolls the page containing that DOM node.

::: tip
One alternative to using this directive is to place a [QScrollObserver](/vue-components/scroll-observer) component on your page.
:::

::: tip
There is one more scrolling-related directive available called [Scroll Fire](/vue-directives/scroll-fire).
:::

## Scroll API
<doc-api file="Scroll" />

## Usage
``` vue
<template>
  ...
  <div v-scroll="scrolled">...</div>
  ...
</template>

<script>
export default {
  ...,
  methods: {
    ...,
    scrolled (position) {
      // when this method is invoked then it means user
      // has scrolled the page to `position`
      //
      // `position` is an Integer designating the current
      // scroll position in pixels.
    }
  }
}
</script>
```

Please note that by default the method called is not debounced. For that you have to do it yourself, by wrapping your method with Quasar's debounce util like below.
As per the example below, you need to use `function (position) {}` or `position => {}.bind(this)` to be able to access the Vue component inside the debounce function.

``` js
import { debounce } from 'quasar'

export default {
  ...,
  methods: {
    ...,
    scrolled: debounce(function (position) {
      // when this method is invoked then it means user
      // has scrolled the Page to 'position'
      //
      // 'position' is an Integer designating the current
      // scroll position in pixels.
    }, 200) // debounce for 200ms
  }
}
```

### Determining Scrolling Container
Please read [here](/vue-components/scroll-observer#determining-scrolling-container) about how Quasar determines the container to attach scrolling events to.
