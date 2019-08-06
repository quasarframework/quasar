---
title: Scroll Fire Directive
desc: Vue directive that triggers an event when user scrolls and brings a component into view.
related:
  - /vue-directives/scroll
---
"Scroll Fire" is a directive that enables a method to be called (once and only once) when user scrolls current page and the DOM element (or component) that it is applied to comes into the viewport.

::: tip
There is also a [Scroll](/vue-directives/scroll) directive which fires whenever user scrolls the page.
:::

## Installation
<doc-installation directives="ScrollFire" />

## Usage

<doc-example title="Basic" file="ScrollFire/Basic" scrollable />

::: warning IMPORTANT
For performance purposes, the scroll listener function injected is by default debounced by 50ms.
:::

### Determining Scrolling Container
Please read [here](/vue-components/scroll-observer#Determining-Scrolling-Container) about how Quasar determines the container to attach scrolling events to.

## API
<doc-api file="ScrollFire" />

