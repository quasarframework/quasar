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

<DocApi file="QRange" />

## Usage

Notice we are using an object for the selection, which holds values for both the lower value of the selected range - `rangeValues.min` and the higher value - `rangeValues.max`.

### Standard

::: warning
You are responsible for accommodating the space around QRange so that the label and marker labels won't overlap the other content on your page. You can use CSS margin or padding for this purpose.
:::

<DocExample title="Standard" file="Standard" />

### Vertical

<DocExample title="Vertical orientation" file="Vertical" />

### With inner min/max <q-badge label="v2.4+" />

Sometimes you need to restrict the model value to an interval inside of the track's length. For this purpose, use `inner-min` and `inner-max` props. First prop needs to be higher or equal to `min` prop while the latter needs to be lower or equal to the `max` prop.

<DocExample title="Inner min/max" file="InnerMinMax" />

### Range width limits <q-badge label="v2.26+" />

Use the `min-range` and `max-range` props to constrain the width of the selection (the difference between the model's `max` and `min`). Think of picking an event's duration: at least 15 minutes long, but placed anywhere within the hour.

External model values that would break these limits get coerced (in the same way `inner-min`/`inner-max` act), with the model's `min` acting as the anchor. Should the two props conflict, `min-range` wins.

<DocExample title="Minimum width" file="MinimumRange" />

<DocExample title="Maximum width" file="MaximumRange" />

### With step

<DocExample title="With Step" file="Step" />

The `step` property can also be a floating point number (or numeric `0` if you need infinite precision).

<DocExample title="Floating point" file="FloatingPoint" />

<DocExample title="Snaps to steps" file="Snap" />

### With label

In the example below, move the slider to see the label.

<DocExample title="With label" file="Label" />

<DocExample title="Always display label" file="LabelAlways" />

<DocExample title="Custom label values" file="LabelValue" />

The example below is better highlighting how QRange handles label positioning so that it always stays inside the QRange's box horizontally.

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

<DocExample title="Color customizations" file="RangeColoring" />

<DocExample title="Hide selection bar" file="NoSelection" />

<DocExample title="Custom track images" file="TrackImages" />

<DocExample title="Track & thumb size" file="RangeSizes" />

### Dragging range

Use the `drag-range` or `drag-only-range` props to allow the user to move the selected range or only a predetermined range as a whole.

<DocExample title="Drag range" file="Drag" />

<DocExample title="Drag range + snap to step" file="DragSnap" />

<DocExample title="Drag only range (fixed interval)" file="DragOnly" />

### Lazy input

<DocExample title="Lazy input" file="Lazy" />

### Null values

<DocExample title="Null values" file="Null" />

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

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QRange, otherwise formData will not contain it (if it should):

The submitted value contains the minimum and maximum values separated by a pipe (`min|max`).

<DocExample title="Native form" file="NativeForm" />

## Accessibility <q-badge label="v2.25+" />

QRange follows the [WAI-ARIA multi-thumb slider pattern](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/): each thumb is its own `role="slider"` element exposing `aria-valuemin`/`aria-valuemax`/`aria-valuenow` (each thumb's limit follows the other one, mirroring how the values clamp against each other), `aria-orientation` and `aria-disabled`/`aria-readonly`, wrapped in a `role="group"` container. The thumbs are named "Minimum"/"Maximum" through the [Quasar Language Pack](/options/quasar-language-packs) (`label.minimum`/`label.maximum`) — override them per instance with the `left-thumb-aria-label`/`right-thumb-aria-label` props. A `left-label-value`/`right-label-value` (e.g. "20%") also becomes its thumb's `aria-valuetext`, so screen readers announce the same formatted value sighted users see. A thumb whose model side is `null` sits on its limit but reports a localized "No value" as `aria-valuetext`, so an untouched range is not announced as a full selection.

The keyboard behavior matches [QSlider](/vue-components/slider#accessibility): <kbd>Tab</kbd> reaches each thumb in turn, the <kbd>Arrow</kbd> keys step whichever thumb has focus (RTL/`reverse`/`vertical`-aware), <kbd>PageUp</kbd> / <kbd>PageDown</kbd> jump by 10 steps and <kbd>Home</kbd> / <kbd>End</kbd> go straight to the focused thumb's limits, in desktop mode.

With `drag-range`, the track container is an additional Tab stop whose keys move the entire selected window, preserving its width; with `drag-only-range` it is the only one, so the slider semantics (localized "Range" name, the minimum as `aria-valuenow`, both formatted values as `aria-valuetext`) move onto it instead of the thumbs.
