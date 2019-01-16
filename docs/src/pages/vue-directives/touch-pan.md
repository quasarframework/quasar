---
title: Touch Pan Directive
---
Quasar offers full-featured Vue directives that can totally replace libraries like Hammerjs: `v-touch-pan`, `v-touch-swipe`, `v-touch-hold` and even `v-touch-repeat`.

> **These directives also work with mouse events, not only touch events**, so you are able to build cool functionality for your App on desktops too.

We will be describing `v-touch-pan` on the lines below.

## Installation
<doc-installation directives="TouchPan" />

## Usage
``` html
<div v-touch-pan="handler">...</div>
// "handler" is a Function which receives an Object as parameter
```

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
