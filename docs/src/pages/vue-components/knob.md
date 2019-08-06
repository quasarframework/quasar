---
title: Knob
desc: The QKnob Vue component is used to take a number input through mouse or touch panning.
related:
  - /vue-components/circular-progress
---

The QKnob component is used to take a number input from the user through mouse/touch panning. It is based on [QCircularProgress](/vue-components/circular-progress) and inherits all its properties and behavior.

## Installation
<doc-installation components="QKnob" />

## Usage
By default, QKnob inherits current text color (as arc progress color and inner label color) and current font size (as component size). For customization, you can use the size and color related props.

<doc-example title="Basic" file="QKnob/Basic" />

In the example below, `show-value` property also enables the default slot, so you can fill it with custom content, like even a QAvatar or a QTooltip. The `font-size` prop refers to the inner label font size.

<doc-example title="Show value" file="QKnob/ShowValue" />

<doc-example title="Custom min/max" file="QKnob/MinMax" />

<doc-example title="Custom step" file="QKnob/Step" />

<doc-example title="Offset angle" file="QKnob/Angle" />

<doc-example title="Disable and readonly" file="QKnob/DisableReadonly" />

## QKnob API
<doc-api file="QKnob" />
