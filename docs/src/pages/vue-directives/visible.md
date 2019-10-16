---
title: Visible Directive
desc: Vue directive that triggers an event when user scrolls and brings a component into or out of view.
related:
  - /vue-directives/scroll-fire
  - /vue-directives/scroll
---
"Visible" is a directive that enables a method to be called when the user scrolls and the DOM element (or component) that it is applied to comes into or out of the viewport.

This work is based upon the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) which is available in most modern browsers. Other browsers, like IE 11 does not support this API. If you need to support older browsers, you can apply the [offical W3C polyfill](https://github.com/w3c/IntersectionObserver).

## Installation
<doc-installation directives="Visible" />

## Usage

The `v-visible` directive uses the [Intersection Observer Api](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). Please read this link to get an idea of how to use the `v-visible` directive.

The `v-visible` directive takes either a function as an argument or an object. The object looks like this:
```js
{
  callback: this.myCallback,
  root: rootElement,
  rootMargin: this.myRootMargin,
  threshold: this.myThreshold
}
```
When using the object, only the `callback` key is mandatory.

::: tip
Scroll the area until the observed object is in view. Then scroll it out of view.
:::

<doc-example title="Basic" file="Visible/Basic" scrollable />

The `v-directive` directive can be used with the `once` modifier (ex: `v-directive.once`). After the first time when `data.isIntersecting` is true, the observer will be disconnected and deleted. This allows you to control the processing overhead if all you need is to be notified when the observed object is visible one time.

<doc-example title="Once" file="Visible/Once" scrollable />

By passing in an object, instead of a function, you can control the **threshold** setting of the Intersection Observer.

<doc-example title="Percentage" file="Visible/Percentage" scrollable />

Below is just an example of how using the `v-visible` directive can be used in a more complex way.

<doc-example title="Advanced" file="Visible/Advanced" scrollable />

## API
<doc-api file="Visible" />
