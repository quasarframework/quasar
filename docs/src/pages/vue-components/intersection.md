---
title: Intersection
desc: The QIntersection vue component, a wrapper over Quasar's Intersection directive.
keys: QIntersection
examples: QIntersection
related:
  - /vue-directives/intersection
  - /options/transitions
---

The QIntersection component is essentially a wrapper over the [Intersection directive](/vue-directives/intersection) with the added benefit that it handles the state by itself (does not require you to add it and handle it manually) and can optionally have a show/hide transition as well.

The main benefit of using QIntersection is, however, that the DOM tree is freed up of hidden nodes thus using the minimum possible RAM memory and making the page feel very snappy. As well, you can specify the `tag` property for the wrapper element to match your own needs, thus eliminating yet another DOM node.

Under the hood, it uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

::: warning
Not all browsers support the Intersection Observer API. Most [modern browsers](https://caniuse.com/#search=intersection) do, but other browsers do not. If you need to support older browsers, you can install and import (into a boot file) the official W3C [polyfill](https://github.com/w3c/IntersectionObserver).
:::

<doc-api file="QIntersection" />

## Usage

::: warning
In most cases, it is required that you apply CSS to the QIntersection element so that it acts as a necessary filler when the inner content is not rendered. This will allow for a smooth scrolling experience, because otherwise the scroll will jump erratically.

An example of such needed CSS would be, for example, a fixed height or at least a min-height (and possibly even a fixed width, as in the examples below, where multiple QIntersections can be displayed on same row).
:::

::: danger
If using the `transition` prop, it is required that the content be wrapped in one and only one element.
:::

::: tip
There are edge cases where the default viewport won't work. For instance, when your code is hosted in an iframe (like Codepen). This is where you need to use the `root` property. It allows you to define an alternative to the viewport as your root (through its DOM element). It is important to keep in mind that root needs to be an ancestor of the observed element.
:::

### Basic

<doc-example title="Basic" file="Basic" scrollable no-edit />

### With transition

In the example below we used a Quasar transition. For a full list, please head to [Transitions](/options/transitions) page.

<doc-example title="With transition" file="Transition" scrollable no-edit />

<doc-example title="A list with transition" file="List" scrollable no-edit />

### Only once

Triggering only once means, however, that you lose the benefit of freeing up the DOM tree. The content will remain in DOM regardless of visibility.

<doc-example title="Triggering only once" file="Once" scrollable no-edit />

The example below uses the `root` property and therefore can be seen in a Codepen (which hosts in an iframe).

<doc-example title="Root viewport" file="Root" scrollable />
