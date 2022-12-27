---
title: Directive v-scroll
desc: Vue directive which triggers an event when user scrolls.
keys: scroll
related:
  - /vue-directives/scroll-fire
  - /vue-components/scroll-observer
---

This is a Vue directive which takes one parameter (a Function) and fires when user scrolls the page containing that DOM node.

::: tip TIPS
* One alternative to using this directive is to place a [QScrollObserver](/vue-components/scroll-observer) component on your page.
* There is one more scrolling-related directive available called [Scroll Fire](/vue-directives/scroll-fire).
:::

<doc-api file="Scroll" />

## Usage

```vue
<template>
  ...
  <div v-scroll="onScroll">...</div>
  ...
</template>

<script>
export default {
  setup () {
    function onScroll (position) {
      // when this method is invoked then it means user
      // has scrolled the page to `position`
      //
      // `position` is an Integer designating the current
      // scroll position in pixels.
    }

    return { onScroll }
  }
}
</script>
```

```js
import { debounce } from 'quasar'

export default {
  setup () {
    function onScroll (position) {
      // when this method is invoked then it means user
      // has scrolled the page to `position`
      //
      // `position` is an Integer designating the current
      // scroll position in pixels.
    }

    return {
      onScroll: debounce(onScroll, 200) // debounce for 200ms
    }
  }
}
```

### Determining Scrolling Container
Please read [here](/vue-components/scroll-observer#determining-scrolling-container) about how Quasar determines the container to attach scrolling events to.
