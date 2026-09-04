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

<DocApi file="QInfiniteScroll" />

## Usage

::: tip
Infinite Scroll loads items in advance when the end of its content comes within `offset` (default = 500) pixels of the scroll target's visible area. If the content you fetch has height less than the scroll target container's height on screen then Infinite Scroll will continue loading more content. So make sure you load enough content.
:::

::: tip
In your `@load` function, don't forget to call the passed in `done()` function when you have finished loading more data.
:::

Scroll to the bottom to see QInfiniteScroll in action.

<DocExample title="Basic" file="Basic" scrollable />

<DocExample title="Custom Scroll Target Container" file="Container" />

<DocExample title="Reverse (Messenger style)" file="Reverse" scrollable />

## Tips

::: tip Scrolling container
Please read [here](/vue-components/scroll-observer#determining-scrolling-container) about how Quasar determines the container to attach scrolling events to.
:::

- Works best when placed as direct child of the Vue component rendering your Page
- If you change the parent of this component, don't forget to call `updateScrollTarget()` on the QInfiniteScroll Vue reference.
- If you need to specify the scroll target inner element (because the auto detected one is not the desired one) pass a CSS selector (as string) or the DOM element in the `scroll-target` prop
- The `offset` is measured against the scroll target's visible area, so a scrolling container that is not detected (nor specified) as the scroll target only reveals the end of the content as it actually scrolls into view; there, loading starts as if `offset` were 0

::: warning
If you pass a custom scroll target container with `scroll-target` prop you must make sure that the element exists and that it can be overflowed (it must have a maximum height and an overflow that allows scrolling).

If the scroll target container cannot be overflowed you'll get a forever loading situation.
:::

::: warning
Inside a QDialog or any other `position: fixed` container the page itself cannot act as the scroll target: content rendered there never changes the page's scroll size, so the component would have no way to decide when to load. Point the `scroll-target` prop to a scrollable element of the overlay (or wrap the content in one, e.g. with the `scroll` CSS class and a maximum height); without one, automatic loading stays off in such a placement (the `trigger()` method still works).
:::

<DocExample title="Usage in QMenu" file="Menu" />

## Accessibility <q-badge label="v2.25+" />

Loading is triggered by native scrolling, so keyboard users trigger it too — as long as the scroll target itself can be scrolled with the keyboard (when using a [QScrollArea](/vue-components/scroll-area#accessibility) as target, see its Accessibility section).

The loading indicator is not announced to screen readers. If the arrival of new content matters to your users, add text with `role="status"` inside the `loading` slot so assistive technology reports that more content is loading.
