---
title: Slider
---
Quasar Slider is a great way to make the user specify a number value between a minimum and maximum value, with optional steps between valid values. The slider also has a focus indicator (highlighted slider button), which allows for keyboard adjustments of the slider.

Also check its “sibling”, the [Range](/vue-components/range) component.

## Installation
<doc-installation components="QSlider" />

## Usage
<doc-example title="Standard" file="QSlider/Standard" />

You can define step to enforce

<doc-example title="With Step" file="QSlider/Step" />

::: warning IMPORTANT
Make sure you choose the `min`, `max` and `step` value correctly. `step` must be a divisor of `max - min`, otherwise the component won’t work right. This is because all valid steps must be able to hold an equal position within the `min` and `max` values.
:::

`step` can also be floating point number or 0 if you need infinite precision.

<doc-example title="Floating Point" file="QSlider/FloatingPoint" />

Move the slider to see the label

<doc-example title="With Label" file="QSlider/Label" />

<doc-example title="Snaps to Steps" file="QSlider/Snap" />

<doc-example title="Markers" file="QSlider/Markers" />

<doc-example title="Display Label Always" file="QSlider/LabelAlways" />

<doc-example title="Dark" file="QSlider/Dark" dark />

<doc-example title="Lazy Input" file="QSlider/Lazy" />

<doc-example title="Readonly" file="QSlider/Readonly" />

<doc-example title="Disable" file="QSlider/Disable" />

<doc-example title="In a List" file="QSlider/List" />

## API
<doc-api file="QSlider" />
