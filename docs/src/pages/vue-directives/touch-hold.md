---
title: Touch Hold Directive
desc: Vue directive which triggers an event when the user touches and holds on a component or element for a specified amount of time.
keys: touch-hold
examples: TouchHold
related:
  - /vue-directives/touch-swipe
  - /vue-directives/touch-repeat
  - /vue-directives/touch-pan
---
Quasar offers full-featured Vue directives that can totally replace libraries like Hammerjs: `v-touch-pan`, `v-touch-swipe`, `v-touch-hold` and even `v-touch-repeat`.

> **These directives also work with mouse events, not only touch events**, so you are able to build cool functionality for your App on desktops too.

We will be describing `v-touch-hold` directive on the lines below.

<doc-api file="TouchHold" />

## Usage

<doc-example title="Basic" file="Basic" />

The default wait time is 600ms, but you can change it:

<doc-example title="Custom wait time" file="CustomTimer" />

::: tip
TouchHold also has a default sensitivity of 5px for touch events and 7px for mouse events, which means that it allows a slight movement of the finger or mouse without aborting, improving the user experience.
:::

However, you can change this sensitivity too (notice the directive argument below - `600:12:15` - 600ms wait time, 12px sensitivity for touch events, 15px sensitivity for mouse events):

<doc-example title="Custom sensitivity" file="CustomSensitivity" />

### Handling Mouse Events
When you want to also handle mouse events too, use the `mouse` modifier:

```html
<div v-touch-hold.mouse="userHasHold">...</div>
```

### Inhibiting TouchHold
When you want to inhibit TouchHold, you can do so by stopping propagation of the `touchstart` / `mousedown` events from the inner content:

```html
<div v-touch-hold.mouse="userHasHold">
  <!-- ...content -->
  <div @touchstart.stop @mousedown.stop>
    <!--
      TouchHold will not apply here because
      we are calling stopPropagation() on touchstart
      and mousedown events
    -->
  </div>
  <!-- ...content -->
</div>
```

However, if you are using `capture` or `mouseCapture` modifiers then events will first reach the TouchHold directive then the inner content, so TouchHold will still trigger.

## Note on HMR
Due to performance reasons, not all of the modifiers are reactive. Some require a window/page/component refresh to get updated. Please check the API card for the modifiers which are not marked as reactive.
