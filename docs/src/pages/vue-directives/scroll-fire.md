---
title: Scroll Fire Directive
desc: Vue directive that triggers an event when user scrolls and brings a component into view.
keys: scroll-fire
examples: ScrollFire
related:
  - /vue-directives/scroll
  - /vue-components/intersection
  - /vue-composables/use-intersection
---

"Scroll Fire" is a directive that enables a method to be called (once and only once) when the DOM element (or component) that it is applied to comes into view.

The element is watched through the same shared [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) that powers the [Intersection](/vue-directives/intersection) directive, so there is no scroll listener and no cost while nothing changes. "Into view" means the user can actually see it: scroll containers and the page are both accounted for, and the method also fires when the element becomes visible without a scroll (a layout change, a resize, content above it collapsing).

<DocApi file="ScrollFire" />

## Usage

<DocExample title="Basic" file="Basic" scrollable />

### Threshold <q-badge label="v2.30+" />

By default the method fires as soon as any part of the element becomes visible. Pass the fraction of the element (between 0 and 1) that must be visible as the directive's argument:

```html
<!-- fires once half of the element is visible -->
<div v-scroll-fire:0.5="handler" />

<!-- fires only once the element is fully visible -->
<div v-scroll-fire:1="handler" />
```

::: warning
An element taller than what can be displayed at once never becomes fully visible, so a threshold of 1 would never fire for it. Use a lower threshold for such elements.
:::

### Disabling and re-arming

Assign `undefined` to disable the directive. Since the method fires only once, assigning a new function after it fired does not fire again; disable it first (`undefined`), then assign the function to arm it again.
