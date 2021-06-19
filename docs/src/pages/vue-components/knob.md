---
title: Knob
desc: The QKnob Vue component is used to take a number input through mouse or touch panning.
keys: QKnob
related:
  - /vue-components/circular-progress
---

The QKnob component is used to take a number input from the user through mouse/touch panning. It is based on [QCircularProgress](/vue-components/circular-progress) and inherits all its properties and behavior.

## QKnob API

<doc-api file="QKnob" />

## Usage

By default, QKnob inherits current text color (as arc progress color and inner label color) and current font size (as component size). For customization, you can use the size and color related props.

### Basic

<doc-example title="Basic" file="QKnob/Basic" />

### Show value

In the example below, `show-value` property also enables the default slot, so you can fill it with custom content, like even a QAvatar or a QTooltip. The `font-size` prop refers to the inner label font size.

<doc-example title="Show value" file="QKnob/ShowValue" />

### Min and max

<doc-example title="Custom min/max" file="QKnob/MinMax" />

### Custom step

<doc-example title="Custom step" file="QKnob/Step" />

### Offset angle

<doc-example title="Offset angle" file="QKnob/Angle" />

### Disable and readonly

<doc-example title="Disable and readonly" file="QKnob/DisableReadonly" />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QKnob, otherwise formData will not contain it (if it should):

<doc-example title="Native form" file="QKnob/NativeForm" />
