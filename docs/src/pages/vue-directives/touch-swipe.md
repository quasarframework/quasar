---
title: Touch Swipe Directive
desc: Vue directive which triggers an event when the user swipes with the finger or mouse on a component or element.
related:
  - /vue-directives/touch-pan
  - /vue-directives/touch-hold
---
Quasar offers full-featured Vue directives that can totally replace libraries like Hammerjs: `v-touch-pan`, `v-touch-swipe`, `v-touch-hold` and even `v-touch-repeat`.

> **These directives also work with mouse events, not only touch events**, so you are able to build cool functionality for your App on desktops too.

We will be describing `v-touch-swipe` on the lines below.

## TouchSwipe API
<doc-api file="TouchSwipe" />

## Usage
Swipe with your mouse on the area below to see it in action. If using a mouse, you need to do it quick.

::: tip
If your content also has images, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.
:::

<doc-example title="All directions" file="TouchSwipe/Basic" />

<doc-example title="One direction only" file="TouchSwipe/Right" />

<doc-example title="Several directions" file="TouchSwipe/UpOrLeft" />

### Handling Mouse Events
When you want to handle mouse events too, use the `mouse` modifier:

``` html
<div v-touch-swipe.mouse="userHasSwiped">...</div>
```

### Inhibiting TouchSwipe
When you want to inhibit TouchSwipe, you can do so by stopping propagation of the `touchstart`/`mousedown` events from the inner content:

``` html
<div v-touch-swipe.mouse="userSwiped">
  <!-- ...content -->
  <div @touchstart.stop @mousedown.stop>
    <!--
      TouchSwipe will not apply here because
      we are calling stopPropagation() on touchstart
      and mousedown events
    -->
  </div>
  <!-- ...content -->
</div>
```

However, if you are using `capture` or `mouseCapture` modifiers then events will first reach the TouchHold directive then the inner content, so TouchSwipe will still trigger.

## Note on HMR
Due to performance reasons, not all of the modifiers are reactive. Some require a window/page/component refresh to get updated. Please check the API card for the modifiers which are not marked as reactive.
