---
title: Touch Swipe Directive
related:
  - /vue-directives/touch-pan
  - /vue-directives/touch-hold
---
Quasar offers full-featured Vue directives that can totally replace libraries like Hammerjs: `v-touch-pan`, `v-touch-swipe`, `v-touch-hold` and even `v-touch-repeat`.

> **These directives also work with mouse events, not only touch events**, so you are able to build cool functionality for your App on desktops too.

We will be describing `v-touch-swipe` on the lines below.

## Installation
<doc-installation directives="TouchSwipe" />

## Usage
Swipe with your mouse on the area below to see it in action. If using a mouse, you need to do it quick.

<doc-example title="All directions" file="TouchSwipe/Basic" />

<doc-example title="One direction only" file="TouchSwipe/Right" />

<doc-example title="Several directions" file="TouchSwipe/UpOrLeft" />

### Capturing Mouse Events
When you want to capture mouse actions too, use the `mouse` modifier:
``` html
<div v-touch-swipe.mouse="userHasSwiped">...</div>
```

### Note on HMR
Due to performance reasons, when doing HMR updates, the argument and modifiers are not updated, so you will require a window refresh.

## API
<doc-api file="TouchSwipe" />
