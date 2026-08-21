---
title: Material Ripples
desc: Vue directive for easily adding material ripples to your components and DOM elements.
keys: material-ripple
examples: Ripple
---

Material Ripple effect can easily be added to any DOM element (or component) through the `v-ripple` Quasar directive.

::: danger
Do not use this directive on components that already have material ripples baked in (example: `QBtn`). Rather configure the internal ripples through those component's `ripple` property.
:::

<DocApi file="Ripple" />

<DocInstall title="Configuration" config="ripple" />

## Usage

::: warning
Make sure that your DOM element or component has CSS `position: relative` or Quasar CSS helper class `relative-position` attached to it.
:::

### Basic

<DocExample title="Basic" file="Basic" />

### Coloring

The Material Ripple takes the CSS color of text by default, but you can configure it:

<DocExample title="Colored" file="Colored" />

### Positioning

You can also configure if the ripple should always start from center or not, regardless of the touch point:

<DocExample title="Positioning" file="Positioning" />

### Triggering early

By default, the Ripple directive is triggered on click or keyup. However, you can change that and make it trigger earlier, on the first user interaction (pointerdown, keydown). In most situations there is no difference in user perception (the delay between the first and last event of the interaction is small), but on press-and-hold or slow taps the early feedback feels closer to native Material behavior.

Starting with v2.26, an early ripple knows when the interaction can no longer become a click and cancels itself: if the browser claims the gesture (the touchpoint moves and it becomes a scroll/pan) or the pressed pointer is dragged off the element, the ripple gracefully fades out. On touchscreens it also waits out the browser's tap-vs-scroll disambiguation for a few milliseconds before painting, so flick-scrolling across ripple-enabled elements does not flash ripples.

<DocExample title="Triggering immediately" file="Early" />

### Disable

If for some reason you have a scenario where the ripples need to be disabled, then you can assign a Boolean as value for the directive:

<DocExample title="Disable" file="Disable" />
