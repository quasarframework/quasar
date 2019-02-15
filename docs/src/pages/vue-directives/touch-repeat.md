---
title: Touch Repeat Directive
---
Quasar offers full-featured Vue directives that can totally replace libraries like Hammerjs: `v-touch-pan`, `v-touch-swipe`, `v-touch-hold` and `v-touch-repeat`.

> **These directives also work with mouse events, not only touch events**, so you are able to build cool functionality for your App on desktops too.

We will be describing `v-touch-repeat` on the lines below.

## Installation
<doc-installation directives="TouchRepeat" />

## Usage
Click and hold with your mouse on the area below to see it in action.
Notice that on touch capable devices the scrolling is not blocked.

> The default repeat pattern is 0:600:300 (ms).

<doc-example title="Basic" file="TouchRepeat/Basic" />

Below is an example configured to also react to `SPACE`, `ENTER` and `h` keys (**focus on it first**), with 0:300:200 (ms) repeat pattern. Hit & hold keys, or click/tap and hold.

<doc-example title="Custom keys" file="TouchRepeat/Keys" />

### Avoid selecting text on mobile
When you change the default repeat pattern and you set the first timer to a value other than 0 (example: `200:300`), it's recommended that you also assign `non-selectable` CSS class to the target (equivalent for `user-select: none`). Since the first timer will kick in with 200ms delay (for pattern 200:300) then the mobile browser might first select the text in your target (if any). To avoid it:
``` html
<div class="non-selectable" v-touch-repeat:200:300="handleRepeat">...</div>
```

### Note on HMR
Due to performance reasons, when doing HMR updates, the argument and modifiers are not updated, so you will require a window refresh.

## API
<doc-api file="TouchRepeat" />
