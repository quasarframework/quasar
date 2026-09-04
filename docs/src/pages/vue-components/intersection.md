---
title: Intersection
desc: The QIntersection vue component, the wrapper-element counterpart of Quasar's Intersection directive and useIntersection composable.
keys: QIntersection
examples: QIntersection
related:
  - /vue-directives/intersection
  - /vue-composables/use-intersection
  - /options/transitions
---

The QIntersection component handles the visibility state by itself (does not require you to add it and handle it manually) and can optionally have a show/hide transition as well. It is built on the same engine as the [Intersection directive](/vue-directives/intersection) and the [useIntersection composable](/vue-composables/use-intersection): all three share one Intersection Observer per configuration, so long lists of QIntersection stay cheap to scroll.

The main benefit of using QIntersection is, however, that the DOM tree is freed up of hidden nodes thus using the minimum possible RAM memory and making the page feel very snappy. As well, you can specify the `tag` property for the wrapper element to match your own needs, thus eliminating yet another DOM node.

Under the hood, it uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

<DocApi file="QIntersection" />

## Usage

::: warning
In most cases, it is required that you apply CSS to the QIntersection element so that it acts as a necessary filler when the inner content is not rendered. This will allow for a smooth scrolling experience, because otherwise the scroll will jump erratically.

An example of such needed CSS would be, for example, a fixed height or at least a min-height (and possibly even a fixed width, as in the examples below, where multiple QIntersections can be displayed on same row).
:::

::: danger
If using the `transition` prop, it is required that the content be wrapped in one and only one element.
:::

### Basic

<DocExample title="Basic" file="Basic" scrollable />

### With transition

In the example below we used a Quasar transition. For a full list, please head to [Transitions](/options/transitions) page.

<DocExample title="With transition" file="Transition" scrollable />

<DocExample title="A list with transition" file="List" scrollable />

### Only once

Triggering only once means, however, that you lose the benefit of freeing up the DOM tree. The content will remain in DOM regardless of visibility.

<DocExample title="Triggering only once" file="Once" scrollable />

### Custom root

By default, visibility is judged against the browser viewport. The `root` property makes an ancestor element the viewport instead, which is what you want when `margin` should be measured from that element's edges, or when the element is expected to be off-screen itself (like a scrolling panel that gets revealed later).

<DocExample title="Root viewport" file="Root" />

## Accessibility <q-badge label="v2.25+" />

Off-screen content is genuinely unmounted (not merely hidden), so it is correctly absent from the accessibility tree as well. Keep in mind that the wrapper element itself always renders, so if you give the `tag` prop a landmark or otherwise semantic element, those semantics apply even while the content inside is unmounted.
