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

<DocApi file="TouchRepeat" />

## Usage

Click and hold with your mouse on the area below to see it in action.
Notice that on touch capable devices the scrolling is not blocked.

> The default repeat pattern is 0:600:300 (ms).

<DocExample title="Basic" file="Basic" />

Below is an example configured to also react to `SPACE`, `ENTER` and `h` keys (**focus on it first**), with 0:300:200 (ms) repeat pattern. Hit & hold keys, or click/tap and hold.

<DocExample title="Custom keys" file="Keys" />

Below is an example of applying TouchRepeat to QBtn. Notice how we play with the directive arguments in order to make the blue buttons increment slower than the red ones.

<DocExample title="Applied to QBtn" file="Buttons" />

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

For common keys, you can use the named modifiers `esc`, `tab`, `enter`, `space`, `up`, `left`, `right`, `down`, and `delete` instead of writing their keycodes. The `delete` modifier handles both Backspace and Delete.

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

### Events after TouchRepeat triggers

Once at least one repetition has fired, the directive consumes the event that ends the gesture, so that a press and hold does not also count as a tap, as a click or as a key press, be it on the element itself or on any of its parents. For touch events this is `touchend`, for mouse events it is `click` and for key events it is `keyup`.

This means that a `@touchend` listener on the element will not be called after TouchRepeat has started repeating. It is still called when the user lifts the finger before the first repetition. Should you need it in both cases, listen for it in the capture phase:

```html
<div v-touch-repeat="myHandler" @touchend.capture="userHasLifted">
  <!-- ...content -->
</div>
```

The `click` and `keyup` events are stopped at the document level, before they can reach your element, so the capture phase does not help there. Mouse events are otherwise unaffected: `@mousedown` and `@mouseup` are always called, only the subsequent `@click` is suppressed.
