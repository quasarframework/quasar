---
title: Scroll Fire Directive
desc: Vue directive that triggers an event when user scrolls and brings a component into view.
keys: scroll-fire
related:
  - /vue-directives/scroll
  - /vue-directives/intersection
---

"Scroll Fire" is a directive that enables a method to be called (once and only once) when the user scrolls current page and the DOM element (or component) that it is applied to comes into the viewport.

::: tip
There is also a [Scroll](/vue-directives/scroll) directive which fires whenever user scrolls the page.
:::

## ScrollFire API

<doc-api file="ScrollFire" />

## Usage

<doc-example title="Basic" file="ScrollFire/Basic" scrollable />

::: warning IMPORTANT
For performance purposes, the scroll listener function injected is by default debounced by 50ms.
:::

### Determining Scrolling Container
Please read [here](/vue-components/scroll-observer#determining-scrolling-container) about how Quasar determines the container to attach scrolling events to.
