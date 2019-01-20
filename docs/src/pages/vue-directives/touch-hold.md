---
title: Touch Hold Directive
---
Quasar offers full-featured Vue directives that can totally replace libraries like Hammerjs: `v-touch-pan`, `v-touch-swipe`, `v-touch-hold` and even `v-touch-repeat`.

> **These directives also work with mouse events, not only touch events**, so you are able to build cool functionality for your App on desktops too.

We will be describing `v-touch-hold` on the lines below.

## Installation
<doc-installation directives="TouchHold" />

## Usage
<doc-example title="Basic" file="TouchHold/Basic" />

<doc-example title="Custom wait time" file="TouchHold/CustomTimer" />

### Avoid Capturing Mouse Events
When you don't want to capture mouse actions too, use the `noMouse` modifier:
``` html
<!--
  directive won't be triggered by mouse actions;
  it's exclusively triggered by touch actions now:
-->
<div v-touch-hold.noMouse="userHasHold">...</div>
```

### Preventing Scroll (on touch capable devices)
By default, the directive does not block page scrolling. If you want to prevent scrolling, then use the `prevent` modifier.
``` html
<div v-touch-hold.prevent="userHasHold">...</div>
```

## API
<doc-api file="TouchHold" />
