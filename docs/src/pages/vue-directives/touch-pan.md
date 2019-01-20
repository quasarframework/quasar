---
title: Touch Pan Directive
---
Quasar offers full-featured Vue directives that can totally replace libraries like Hammerjs: `v-touch-pan`, `v-touch-swipe`, `v-touch-hold` and even `v-touch-repeat`.

> **These directives also work with mouse events, not only touch events**, so you are able to build cool functionality for your App on desktops too.

We will be describing `v-touch-pan` on the lines below.

## Installation
<doc-installation directives="TouchPan" />

## Usage
Click then pan in a direction with your mouse on the area below to see it in action.
Page scrolling is prevented, but you can opt out if you wish.
<doc-example title="All directions" file="TouchPan/Basic" />

Panning works both with a mouse or a native touch action.
You can also capture pan to certain directions (any) only as you'll see below.

Example on capturing only horizontal panning.
Notice that on touch capable devices the scrolling is automatically not blocked, since we are only capturing horizontally.
<doc-example title="Horizontally" file="TouchPan/Horizontal" />

Example on capturing only vertically panning. Page scrolling is prevented, but you can opt out if you wish.
<doc-example title="Vertically" file="TouchPan/Vertical" />

### Avoid Capturing Mouse Events
When you don't want to capture mouse actions too, use the `noMouse` modifier:
``` html
<!--
  directive won't be triggered by mouse actions;
  it's exclusively triggered by touch actions now:
-->
<div v-touch-pan.noMouse="userHasPanned">...</div>
```

### Preventing Scroll (on touch capable devices)
By default, the directive does not block page scrolling. If you want to prevent scrolling, then use the `prevent` modifier.
``` html
<div v-touch-pan.prevent="userHasPanned">...</div>
```

## API
<doc-api file="TouchPan" />
