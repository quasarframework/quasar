---
title: Infinite Scroll
desc: The QInfiniteScroll Vue component allows you to load new content as the user scrolls the page.
keys: QInfiniteScroll
examples: QInfiniteScroll
related:
  - /vue-components/spinners
  - /vue-components/pull-to-refresh
  - /vue-components/intersection
  - /vue-components/virtual-scroll
---

The QInfiniteScroll component allows you to load new content as the user scrolls the page.

<doc-api file="QInfiniteScroll" />

## Usage

::: tip
Infinite Scroll loads items in advance when less than `offset` (default = 500) pixels is left to be seen. If the content you fetch has height less than the scroll target container’s height on screen then Infinite Scroll will continue loading more content. So make sure you load enough content.
:::

::: tip
In your `@load` function, don't forget to call the passed in `done()` function when you have finished loading more data.
:::

Scroll to the bottom to see QInfiniteScroll in action.

<doc-example title="Basic" file="Basic" scrollable />

<doc-example title="Custom Scroll Target Container" file="Container" />

<doc-example title="Reverse (Messenger style)" file="Reverse" scrollable />

### Tips

::: tip Scrolling container
Please read [here](/vue-components/scroll-observer#determining-scrolling-container) about how Quasar determines the container to attach scrolling events to.
:::

* Works best when placed as direct child of the Vue component rendering your Page
* If you change the parent of this component, don't forget to call `updateScrollTarget()` on the QInfiniteScroll Vue reference.
* If you need to specify the scroll target inner element (because the auto detected one is not the desired one) pass a CSS selector (as string) or the DOM element in the `scroll-target` prop

::: warning
If you pass a custom scroll target container with `scroll-target` prop you must make sure that the element exists and that it can be overflowed (it must have a maximum height and an overflow that allows scrolling).

If the scroll target container cannot be overflowed you'll get a forever loading situation.
:::

<doc-example title="Usage in QMenu" file="Menu" />
