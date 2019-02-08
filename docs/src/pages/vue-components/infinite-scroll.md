---
title: Infinite Scroll
related:
  - /vue-components/spinners
  - /vue-components/pull-to-refresh
---

The QInfiteScroll component allows you to load new content as the user scrolls down the page.

## Installation
<doc-installation components="QInfiniteScroll" />

## Usage

::: tip
Infinite Scroll loads items in advance when less than `offset` (default = 500) pixels is left to be seen. If the content you fetch has height less than the container’s height on screen then Infinite Scroll will continue loading more content. So make sure you load enough content.
:::

::: tip
In your `@load` function, don't forget to call the passed in `done()` function when you have finsihed loading more data.
:::

Scroll to the bottom to see QInfiniteScroll in action.

<doc-example title="Basic" file="QInfiniteScroll/Basic" scrollable />

### Tips
* Works best when placed as direct child of the Vue component rendering your Page
* If you change the parent of this component, don't forget to call `updateScrollTarget()` on the QInfiniteScroll Vue reference.

## QInfiniteScroll API
<doc-api file="QInfiniteScroll" />
