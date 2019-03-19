---
title: Touch Hold Directive
related:
  - /vue-directives/touch-pan
  - /vue-directives/touch-swipe
---
Quasar offers full-featured Vue directives that can totally replace libraries like Hammerjs: `v-touch-pan`, `v-touch-swipe`, `v-touch-hold` and even `v-touch-repeat`.

> **These directives also work with mouse events, not only touch events**, so you are able to build cool functionality for your App on desktops too.

We will be describing `v-touch-hold` on the lines below.

## Installation
<doc-installation directives="TouchHold" />

## Usage
<doc-example title="Basic" file="TouchHold/Basic" />

<doc-example title="Custom wait time" file="TouchHold/CustomTimer" />

### Capturing Mouse Events
When you want to capture mouse actions events too, use the `mouse` modifier:
``` html
<div v-touch-hold.mouse="userHasHold">...</div>
```

### Note on HMR
Due to performance reasons, when doing HMR updates, the argument and modifiers are not updated, so you will require a window refresh.

## API
<doc-api file="TouchHold" />
