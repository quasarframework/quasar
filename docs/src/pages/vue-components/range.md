---
title: Range
---
The Quasar Range component is a great way to offer the user the selection of a sub-range of values between a minimum and maximum value, with optional steps to select those values. An example use case for the Range component would be to offer a price range selection.

Also check out its “sibling”, the [Slider](/vue-components/slider) component.

## Installation
<doc-installation components="QRange" />

## Basic Usage
Notice we are using an object for the selection, which holds values for both the lower value of the selected range - `rangeValues.min` and the higher value - `rangeValues.max`.

<doc-example title="Standard" file="QRange/Standard" />

You can define step to enforce

<doc-example title="With Step" file="QRange/Step" />

::: warning IMPORTANT
Make sure you choose the `min`, `max` and `step` values correctly. `step` must be a divisor of `max - min`, of `v-model.min` and of `v-model.max`, otherwise the component won’t work right. This is because all valid steps must be able to hold an equal position within the `min`-`max` values.
:::

`step` can also be floating point number or 0 if you need infinite precision.

<doc-example title="Floating Point" file="QRange/FloatingPoint" />

Move the slider to see the label

<doc-example title="With Label" file="QRange/Label" />

<doc-example title="Snaps to Steps" file="QRange/Snap" />

Use the `markers` prop, to show the steps available for the range selection.

<doc-example title="Markers" file="QRange/Markers" />

<doc-example title="Display Label Always" file="QRange/LabelAlways" />

In the example below we add a “px” suffix to labels.

<doc-example title="Custom Label Values" file="QRange/CustomLabel" />

Use the `drag-range` or `drag-only-range` props, to allow the user to move the selected range or only a predetermined range as a whole.

<doc-example title="Drag Range" file="QRange/Drag" />

<doc-example title="Drag Range + Snap to Step" file="QRange/DragSnap" />

<doc-example title="Drag Only Range" file="QRange/DragOnly" />

<doc-example title="Dark" file="QRange/Dark" dark />

Vue will soon supply the `.lazy` modifier for `v-model` on components too, but until then, you can use the longer equivalent form:

<doc-example title="Lazy Input" file="QRange/Lazy" />

<doc-example title="Readonly" file="QRange/Readonly" />

<doc-example title="Disable" file="QRange/Disable" />

<doc-example title="In a List" file="QRange/List" />

## API
<doc-api file="QRange" />
