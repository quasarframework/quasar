---
title: Range
desc: The QRange Vue component offers a way for the user to select from a sub-range of values between a maximum and maximum value, with optional steps.
keys: QRange
related:
  - /vue-components/slider
  - /vue-components/field
---
The QRange component is a great way to offer the user the selection of a sub-range of values between a minimum and maximum value, with optional steps to select those values. An example use case for the Range component would be to offer a price range selection.

Also check out its “sibling”, the [QSlider](/vue-components/slider) component.

## QRange API

<doc-api file="QRange" />

## Usage

Notice we are using an object for the selection, which holds values for both the lower value of the selected range - `rangeValues.min` and the higher value - `rangeValues.max`.

### Standard

<doc-example title="Standard" file="QRange/Standard" />

### Vertical

<doc-example title="Vertical orientation" file="QRange/Vertical" />

### With step

<doc-example title="With Step" file="QRange/Step" />

The `step` property can also be a floating point number (or numeric `0` if you need infinite precision).

<doc-example title="Floating point" file="QRange/FloatingPoint" />

<doc-example title="Snaps to steps" file="QRange/Snap" />

### With label

In the example below, move the slider to see the label.

<doc-example title="With label" file="QRange/Label" />

<doc-example title="Always display label" file="QRange/LabelAlways" />

<doc-example title="Custom label values" file="QRange/LabelValue" />

The example below is better highlighting how QRange handles label positioning so that it always stays inside the QRange's box horizontally.

<doc-example title="Long label" file="QRange/LabelLong" />

### Markers

<doc-example title="Markers" file="QRange/Markers" />

### Dragging range

Use the `drag-range` or `drag-only-range` props to allow the user to move the selected range or only a predetermined range as a whole.

<doc-example title="Drag range" file="QRange/Drag" />

<doc-example title="Drag range + snap to step" file="QRange/DragSnap" />

<doc-example title="Drag only range (fixed interval)" file="QRange/DragOnly" />

### Lazy input

<doc-example title="Lazy input" file="QRange/Lazy" />

### Null values

<doc-example title="Null values" file="QRange/Null" />

### Reverse

<doc-example title="In reverse" file="QRange/Reverse" />

### Dark, readonly, disable

<doc-example title="Dark" file="QRange/Dark" dark />

<doc-example title="Readonly" file="QRange/Readonly" />

<doc-example title="Disable" file="QRange/Disable" />

### With QItem

<doc-example title="With QItem" file="QRange/List" />

### Getting creative

Using simple CSS you can get nice effects.

<doc-example title="Getting creative" file="QRange/GettingCreative" />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QRange, otherwise formData will not contain it (if it should):

<doc-example title="Native form" file="QRange/NativeForm" />
