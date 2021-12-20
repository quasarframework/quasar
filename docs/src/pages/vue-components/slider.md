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

::: warning
You are responsible for accommodating the space around QSlider so that the label and marker labels won't overlap the other content on your page. You can use CSS margin or padding for this purpose.
:::

### Standard

<doc-example title="Standard" file="QSlider/Standard" />

### Vertical

<doc-example title="Vertical orientation" file="QSlider/Vertical" />

### With inner min/max <q-badge align="top" color="brand-primary" label="v2.4+" />

Sometimes you need to restrict the model value to an interval inside of the track's length. For this purpose, use `inner-min` and `inner-max` props. First prop needs to be higher or equal to `min` prop while the latter needs to be lower or equal to the `max` prop.

<doc-example title="Inner min/max" file="QSlider/InnerMinMax" />

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

### Marker labels <q-badge align="top" color="brand-primary" label="v2.4+" />

<doc-example title="Marker labels" file="QSlider/MarkerLabels" />

::: tip TIP on slots
In order to use the marker label slots (see below), you must enable them by using the `marker-labels` prop.
:::

<doc-example title="Marker label slots" file="QSlider/MarkerLabelSlots" />

### Other customizations <q-badge align="top" color="brand-primary" label="v2.4+" />

<doc-example title="Color customizations" file="QSlider/SliderColoring" />

<doc-example title="Hide selection bar" file="QSlider/NoSelection" />

<doc-example title="Custom track images" file="QSlider/TrackImages" />

<doc-example title="Track & thumb size" file="QSlider/SliderSizes" />

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
