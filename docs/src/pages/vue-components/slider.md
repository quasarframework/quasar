---
title: Slider
desc: The QSlider Vue component is a great way for the user to specify a number value between a minimum and maximum value, with optional steps between valid values.
related:
  - /vue-components/range
  - /vue-components/field
---
The QSlider is a great way for the user to specify a number value between a minimum and maximum value, with optional steps between valid values. The slider also has a focus indicator (highlighted slider button), which allows for keyboard adjustments of the slider.

Also check its “sibling”, the [QRange](/vue-components/range) component.

## Installation
<doc-installation components="QSlider" />

## Usage
<doc-example title="Standard" file="QSlider/Standard" />

<doc-example title="With step" file="QSlider/Step" />

The `step` property can also be floating point number (or numeric `0` if you need infinite precision).

<doc-example title="Floating point" file="QSlider/FloatingPoint" />

In the example below, move the slider to see the label.

<doc-example title="With label" file="QSlider/Label" />

<doc-example title="Snaps to steps" file="QSlider/Snap" />

<doc-example title="Markers" file="QSlider/Markers" />

<doc-example title="Always display label" file="QSlider/LabelAlways" />

<doc-example title="Custom label value" file="QSlider/LabelValue" />

<doc-example title="Dark" file="QSlider/Dark" dark />

<doc-example title="Lazy input" file="QSlider/Lazy" />

<doc-example title="Readonly" file="QSlider/Readonly" />

<doc-example title="Disable" file="QSlider/Disable" />

<doc-example title="Null value" file="QSlider/Null" />

<doc-example title="Using with a list" file="QSlider/List" />

## QSlider API
<doc-api file="QSlider" />
