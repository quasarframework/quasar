---
title: Slider
desc: The QSlider Vue component is a great way for the user to specify a number value between a minimum and maximum value, with optional steps between valid values.
keys: QSlider
examples: QSlider
related:
  - /vue-components/range
  - /vue-components/field
---

The QSlider is a great way for the user to specify a number value between a minimum and maximum value, with optional steps between valid values. The slider also has a focus indicator (highlighted slider button), which allows for keyboard adjustments of the slider.

Also check its “sibling”, the [QRange](/vue-components/range) component.

<DocApi file="QSlider" />

## Usage

::: warning
You are responsible for accommodating the space around QSlider so that the label and marker labels won't overlap the other content on your page. You can use CSS margin or padding for this purpose.
:::

### Standard

<DocExample title="Standard" file="Standard" />

### Vertical

<DocExample title="Vertical orientation" file="Vertical" />

### With inner min/max <q-badge label="v2.4+" />

Sometimes you need to restrict the model value to an interval inside of the track's length. For this purpose, use `inner-min` and `inner-max` props. First prop needs to be higher or equal to `min` prop while the latter needs to be lower or equal to the `max` prop.

<DocExample title="Inner min/max" file="InnerMinMax" />

### With step

<DocExample title="With step" file="Step" />

The `step` property can also be floating point number (or numeric `0` if you need infinite precision).

<DocExample title="Floating point" file="FloatingPoint" />

<DocExample title="Snap to steps" file="Snap" />

### With label

In the example below, move the slider to see the label.

<DocExample title="With label" file="Label" />

<DocExample title="Always display label" file="LabelAlways" />

<DocExample title="Custom label value" file="LabelValue" />

The example below is better highlighting how QSlider handles label positioning so that it always stays inside the QSlider's box horizontally.

<DocExample title="Long label" file="LabelLong" />

### Markers

<DocExample title="Markers" file="Markers" />

### Marker labels <q-badge label="v2.4+" />

<DocExample title="Marker labels" file="MarkerLabels" />

::: tip TIP on slots
In order to use the marker label slots (see below), you must enable them by using the `marker-labels` prop.
:::

<DocExample title="Marker label slots" file="MarkerLabelSlots" />

### Other customizations <q-badge label="v2.4+" />

<DocExample title="Color customizations" file="SliderColoring" />

<DocExample title="Hide selection bar" file="NoSelection" />

<DocExample title="Custom track images" file="TrackImages" />

<DocExample title="Track & thumb size" file="SliderSizes" />

### Lazy input

<DocExample title="Lazy input" file="Lazy" />

### Null value

<DocExample title="Null value" file="Null" />

### Reverse

<DocExample title="In reverse" file="Reverse" />

### Force dark mode

<DocExample title="Force dark mode" file="Dark" />

### Readonly and disable

<DocExample title="Readonly" file="Readonly" />

<DocExample title="Disable" file="Disable" />

### With QItem

<DocExample title="With QItem" file="List" />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QSlider, otherwise formData will not contain it (if it should):

<DocExample title="Native form" file="NativeForm" />
