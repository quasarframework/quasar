---
title: Slider
desc: The QSlider Vue component is a great way for the user to specify a number value between a minimum and maximum value, with optional steps between valid values.
keys: QSlider
related:
  - /vue-components/range
  - /vue-components/field
---
The QSlider is a great way for the user to specify a number value between a minimum and maximum value, with optional steps between valid values. The slider also has a focus indicator (highlighted slider button), which allows for keyboard adjustments of the slider.

Also check its “sibling”, the [QRange](/vue-components/range) component.

## QSlider API

<doc-api file="QSlider" />

## Usage

### Standard

<doc-example title="Standard" file="QSlider/Standard" />

### Vertical

<doc-example title="Vertical orientation" file="QSlider/Vertical" />

### With step

<doc-example title="With step" file="QSlider/Step" />

The `step` property can also be floating point number (or numeric `0` if you need infinite precision).

<doc-example title="Floating point" file="QSlider/FloatingPoint" />

<doc-example title="Snap to steps" file="QSlider/Snap" />

### With label

In the example below, move the slider to see the label.

<doc-example title="With label" file="QSlider/Label" />

<doc-example title="Always display label" file="QSlider/LabelAlways" />

<doc-example title="Custom label value" file="QSlider/LabelValue" />

The example below is better highlighting how QSlider handles label positioning so that it always stays inside the QSlider's box horizontally.

<doc-example title="Long label" file="QSlider/LabelLong" />

### Markers

<doc-example title="Markers" file="QSlider/Markers" />

### Lazy input

<doc-example title="Lazy input" file="QSlider/Lazy" />

### Null value

<doc-example title="Null value" file="QSlider/Null" />

### Reverse

<doc-example title="In reverse" file="QSlider/Reverse" />

### Dark, readonly, disable

<doc-example title="Dark" file="QSlider/Dark" dark />

<doc-example title="Readonly" file="QSlider/Readonly" />

<doc-example title="Disable" file="QSlider/Disable" />

### With QItem

<doc-example title="With QItem" file="QSlider/List" />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QSlider, otherwise formData will not contain it (if it should):

<doc-example title="Native form" file="QSlider/NativeForm" />
