---
title: Range
desc: The QRange Vue component offers a way for the user to select from a sub-range of values between a maximum and maximum value, with optional steps.
related:
  - /vue-components/slider
  - /vue-components/field
---
The QRange component is a great way to offer the user the selection of a sub-range of values between a minimum and maximum value, with optional steps to select those values. An example use case for the Range component would be to offer a price range selection.

Also check out its “sibling”, the [QSlider](/vue-components/slider) component.

## Installation
<doc-installation components="QRange" />

## Usage
Notice we are using an object for the selection, which holds values for both the lower value of the selected range - `rangeValues.min` and the higher value - `rangeValues.max`.

<doc-example title="Standard" file="QRange/Standard" />

<doc-example title="With Step" file="QRange/Step" />

The `step` property can also be a floating point number (or numeric `0` if you need infinite precision).

<doc-example title="Floating point" file="QRange/FloatingPoint" />

In the example below, move the slider to see the label.

<doc-example title="With label" file="QRange/Label" />

<doc-example title="Snaps to steps" file="QRange/Snap" />

<doc-example title="Markers" file="QRange/Markers" />

<doc-example title="Always display label" file="QRange/LabelAlways" />

<doc-example title="Custom label values" file="QRange/LabelValue" />

Use the `drag-range` or `drag-only-range` props to allow the user to move the selected range or only a predetermined range as a whole.

<doc-example title="Drag range" file="QRange/Drag" />

<doc-example title="Drag range + snap to step" file="QRange/DragSnap" />

<doc-example title="Drag only range (fixed interval)" file="QRange/DragOnly" />

<doc-example title="Dark" file="QRange/Dark" dark />

<doc-example title="Lazy input" file="QRange/Lazy" />

<doc-example title="Readonly" file="QRange/Readonly" />

<doc-example title="Disable" file="QRange/Disable" />

<doc-example title="Null values" file="QRange/Null" />

<doc-example title="Usage with a list" file="QRange/List" />

## QRange API
<doc-api file="QRange" />
