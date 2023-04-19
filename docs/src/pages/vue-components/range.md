---
title: Range
desc: The QRange Vue component offers a way for the user to select from a sub-range of values between a maximum and maximum value, with optional steps.
keys: QRange
examples: QRange
related:
  - /vue-components/slider
  - /vue-components/field
---
The QRange component is a great way to offer the user the selection of a sub-range of values between a minimum and maximum value, with optional steps to select those values. An example use case for the Range component would be to offer a price range selection.

Also check out its “sibling”, the [QSlider](/vue-components/slider) component.

<doc-api file="QRange" />

## Usage

Notice we are using an object for the selection, which holds values for both the lower value of the selected range - `rangeValues.min` and the higher value - `rangeValues.max`.

### Standard

::: warning
You are responsible for accommodating the space around QRange so that the label and marker labels won't overlap the other content on your page. You can use CSS margin or padding for this purpose.
:::

<doc-example title="Standard" file="Standard" />

### Vertical

<doc-example title="Vertical orientation" file="Vertical" />

### With inner min/max <q-badge label="v2.4+" />

Sometimes you need to restrict the model value to an interval inside of the track's length. For this purpose, use `inner-min` and `inner-max` props. First prop needs to be higher or equal to `min` prop while the latter needs to be lower or equal to the `max` prop.

<doc-example title="Inner min/max" file="InnerMinMax" />

### With step

<doc-example title="With Step" file="Step" />

The `step` property can also be a floating point number (or numeric `0` if you need infinite precision).

<doc-example title="Floating point" file="FloatingPoint" />

<doc-example title="Snaps to steps" file="Snap" />

### With label

In the example below, move the slider to see the label.

<doc-example title="With label" file="Label" />

<doc-example title="Always display label" file="LabelAlways" />

<doc-example title="Custom label values" file="LabelValue" />

The example below is better highlighting how QRange handles label positioning so that it always stays inside the QRange's box horizontally.

<doc-example title="Long label" file="LabelLong" />

### Markers

<doc-example title="Markers" file="Markers" />

### Marker labels <q-badge label="v2.4+" />

<doc-example title="Marker labels" file="MarkerLabels" />

::: tip TIP on slots
In order to use the marker label slots (see below), you must enable them by using the `marker-labels` prop.
:::

<doc-example title="Marker label slots" file="MarkerLabelSlots" />

### Other customizations <q-badge label="v2.4+" />

<doc-example title="Color customizations" file="RangeColoring" />

<doc-example title="Hide selection bar" file="NoSelection" />

<doc-example title="Custom track images" file="TrackImages" />

<doc-example title="Track & thumb size" file="RangeSizes" />

### Dragging range

Use the `drag-range` or `drag-only-range` props to allow the user to move the selected range or only a predetermined range as a whole.

<doc-example title="Drag range" file="Drag" />

<doc-example title="Drag range + snap to step" file="DragSnap" />

<doc-example title="Drag only range (fixed interval)" file="DragOnly" />

### Lazy input

<doc-example title="Lazy input" file="Lazy" />

### Null values

<doc-example title="Null values" file="Null" />

### Reverse

<doc-example title="In reverse" file="Reverse" />

### Force dark mode

<doc-example title="Force dark mode" file="Dark" />

### Readonly and disable

<doc-example title="Readonly" file="Readonly" />

<doc-example title="Disable" file="Disable" />

### With QItem

<doc-example title="With QItem" file="List" />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QRange, otherwise formData will not contain it (if it should):

<doc-example title="Native form" file="NativeForm" />
