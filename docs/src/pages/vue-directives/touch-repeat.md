---
title: Touch Repeat Directive
desc: Vue directive which triggers an event at specified intervals of time while the user touches and holds on a component or element.
keys: touch-repeat
examples: TouchRepeat
related:
  - /vue-directives/touch-swipe
  - /vue-directives/touch-pan
  - /vue-directives/touch-hold
---

Quasar offers full-featured Vue directives that can totally replace libraries like Hammerjs: `v-touch-pan`, `v-touch-swipe`, `v-touch-hold` and `v-touch-repeat`.

> **These directives also work with mouse events, not only touch events**, so you are able to build cool functionality for your App on desktops too.

We will be describing `v-touch-repeat` on the lines below.

<doc-api file="TouchRepeat" />

## Usage
Click and hold with your mouse on the area below to see it in action.
Notice that on touch capable devices the scrolling is not blocked.

> The default repeat pattern is 0:600:300 (ms).

<doc-example title="Basic" file="Basic" />

Below is an example configured to also react to `SPACE`, `ENTER` and `h` keys (**focus on it first**), with 0:300:200 (ms) repeat pattern. Hit & hold keys, or click/tap and hold.

<doc-example title="Custom keys" file="Keys" />

Below is an example of applying TouchRepeat to QBtn. Notice how we play with the directive arguments in order to make the blue buttons increment slower than the red ones.

<doc-example title="Applied to QBtn" file="Buttons" />

### Handling Mouse Events
When you want to handle mouse events too, use the `mouse` modifier:

```html
<div v-touch-repeat.mouse="myHandler">...</div>
```

### Handling Key Events
When you want to handle key events too, use [keycodes](https://keycode.info/) as modifiers:

```html
<div v-touch-repeat.65.70="myHandler">...</div>
```

There are some special modifiers that you do not require to write the equivalent keycode: `space`, `tab`, `enter`.

### Inhibiting TouchRepeat
When you want to inhibit TouchRepeat, you can do so by stopping propagation of the `touchstart` / `mousedown` / `keydown` events from the inner content:

```html
<div v-touch-repeat.mouse.enter="userHasHold">
  <!-- ...content -->
  <div @touchstart.stop @mousedown.stop @keydown.stop>
    <!--
      TouchRepeat will not apply here because
      we are calling stopPropagation() on touchstart,
      mousedown and keydown events
    -->
  </div>
  <!-- ...content -->
</div>
```

However, if you are using `capture`, `mouseCapture` or `keyCapture` modifiers then events will first reach the TouchRepeat directive then the inner content, so TouchRepeat will still trigger.

## Note on HMR
Due to performance reasons, not all of the modifiers are reactive. Some require a window/page/component refresh to get updated. Please check the API card for the modifiers which are not marked as reactive.
