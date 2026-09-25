---
title: v-resize directive
desc: Vue directive that uses Resize Observer API to call a method whenever the DOM element it is applied to changes its width or height.
keys: resize,v-resize
badge: v2.34+
examples: Resize
related:
  - /vue-components/resize-observer
  - /vue-composables/use-element-resize
  - /vue-directives/mutation
---

"Resize" is a Quasar directive that calls a method whenever the DOM element (or component) that it is applied to changes its size (width and/or height). The reported size is the element's outer size (padding and border included), so a padding change on the element itself is reported too.

Under the hood, it uses the [Resize Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API), so no polling is involved.

It is the template-side form of the [QResizeObserver](/vue-components/resize-observer) component and of the [useElementResize](/vue-composables/use-element-resize) composable (both the component and the directive are built on it): unlike the component, it needs no extra node in your template and it can go on any element, including a component whose slot you would rather not touch.

<DocApi file="Resize" />

## Usage

The directive's value is the handler Function. It takes one parameter, an Object with the `width` and `height` of the element (in pixels). It gets called right away with the initial size, so you can rely on having it as soon as the element is rendered, then only when the size changes.

### Basic

<DocExample title="Basic" file="Basic" />

### Debouncing

The directive's argument is a debounce in milliseconds (ex: `v-resize:100`). With it, the element gets measured at most once per window of that many milliseconds: a continuous resize (dragging a handle, animating a width) reports periodically rather than on every frame, and the last change is never missed. Should the debounce need to change at runtime, use a dynamic argument (`v-resize:[debounce]`).

<DocExample title="Debounce" file="Debounce" />

### Trigger once

The directive can be used with the `once` modifier (ex: `v-resize.once`). The handler Function is called with the initial size of the element and the observing stops right there, which makes it a cheap way of reading an element's rendered size without a template ref.

### Disable

Passing in Boolean `false` (or `undefined`) instead of a Function disables the directive: the element stops being observed until a handler is supplied again, at which point the current size is reported if it changed meanwhile. The DOM element is untouched in the process, so whatever it wraps keeps its state.

<DocExample title="Disable" file="Disable" />
