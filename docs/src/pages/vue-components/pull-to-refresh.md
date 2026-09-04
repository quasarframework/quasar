---
title: Pull to refresh
desc: The QPullToRefresh Vue component allows the user to pull down in order to refresh or retrieve the newest content on a page.
keys: QPullToRefresh
examples: QPullToRefresh
related:
  - /vue-components/infinite-scroll
  - /vue-components/intersection
  - /vue-components/icon
---

The QPullToRefresh is a component that allows the user to pull down in order to refresh page content (or retrieve the newest content).

<DocApi file="QPullToRefresh" />

## Usage

### Basic

::: warning
In your `@refresh` function, don't forget to call the passed in `done()` function when you have finished loading more data.
:::

To refresh, pull down (with mouse or through finger touch) on the content below when the inner scroll position is the top.

<DocExample title="Basic" file="Basic" />

### Custom icon

<DocExample title="Custom icon" file="Icon" />

### Custom coloring

<DocExample title="Custom coloring" file="CustomColoring" />

### Side <q-badge label="v2.30+" />

The `side` prop picks the edge of the content the pull starts from (`top` by default): the refresh is triggered by pulling from that edge towards the inside of the content, while the inner scroll position sits at that edge, and the puller comes in from it. Use `bottom` for messenger-styled content, where the newest entries sit at the bottom, and `left` or `right` for horizontally scrolling content.

<DocExample title="Side" file="Side" />

## Tips

::: tip Scrolling container
Please read [here](/vue-components/scroll-observer#determining-scrolling-container) about how Quasar determines the container to attach scrolling events to.
:::

- If using a QLayout, then it's recommended that you put QPullToRefresh as direct child of QPage and wrap your page content with it.
- Quasar detects the scrolling container by its `scroll`, `scroll-y` or `overflow-auto` class; for a `left` or `right` side inside a container that only has the `scroll-x` class, point the `scroll-target` prop at it.
- If you change the parent of this component, don't forget to call `updateScrollTarget()` on the QPullToRefresh Vue reference.
- QPullToRefresh also allows text selection, so if your content also has images, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.

## Accessibility <q-badge label="v2.25+" />

The pull gesture is pointer-only — keyboard and assistive technology users cannot perform it. The component exposes a `trigger()` method on its ref for exactly this reason: wire it to a visible refresh button so everyone has a way to refresh. The refreshing spinner is not announced to screen readers either, so if completion matters to your users, announce it yourself (e.g. through a live region or a notification) when your `@refresh` handler finishes.
