---
title: Scroll Observer
desc: The QScrollObserver Vue component emits an event whenever the user scrolls the page or the parent scrollable container.
keys: QScrollObserver
examples: QScrollObserver
related:
  - /vue-components/resize-observer
---
QScrollObserver is a Quasar component that emits a `scroll` event whenever the user scrolls the page or overflowed container with `.scroll` CSS class applied to it.

<doc-api file="QScrollObserver" />

## Usage
Scroll this page to see the example below in action.

<doc-example title="Basic" file="Basic" />

## Determining Scrolling Container
All components or directives in Quasar have a simple algorithm to determine the container that supports the scroll:
- if a `scroll-target` property is available on the component then it tries to use it as scroll container
- then it searches for a parent DOM element which has the `scroll`, `scroll-y` or `overflow-auto` Quasar CSS helper classes attached to it,
- if none is found, then it considers that the scrolling takes place on the document itself.

Components like [QScrollArea](/vue-components/scroll-area), for example, respect this design and have the `scroll` class embedded into it, so that QScrollObservable (or any other scrolling component or directive) can successfully detect it and attach the necessary event handlers to it.

Please note that simply attaching `scroll` CSS class to a DOM element or on a Vue component will have no effect if the respective element is not overflowed (example, with: CSS `overflow: hidden` and a height smaller than its inner content height).

Example of good container:

```html
<!--
  Quasar CSS helper 'overflow-hidden' is
  equivalent to style="overflow: hidden"
-->
<div class="scroll overflow-hidden" style="height: 100px">
  ...content expanding over the 100px height from container...
  <q-scroll-observer @scroll="scrollHandler" />

  <!-- example with `v-scroll` directive -->
  <div v-scroll="scrollHandler">...</div>
</div>
```

One more example with QScrollArea:

```html
<q-scroll-area style="width: 400px; height: 500px;" class="bg-yellow">
  ...content expanding over the 500px height from container...
  <q-scroll-observer @scroll="scrollHandler" />
</q-scroll-area>
```

## Horizontal
For capturing horizontal scrolling, use the `axis="horizontal"` prop :

```html
<q-scroll-observer axis="horizontal" @scroll="scrollHandler" />
```

## Layout Scrolling
When scrolling on a Layout with a Page, rather than injecting a QScrollObservable (and by so doing registering additional scroll events) you can take advantage of [QLayout](/layout/layout)´s `@scroll` event directly on your component defining the Layout.

```html
<q-layout @scroll="scrollHandler">...</q-layout>
```
