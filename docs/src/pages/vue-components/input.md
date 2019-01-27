---
title: Input
---

The QInput component is used to capture text input from the user. It uses `v-model`, similar to a regular input. It has support for errors and validation, and comes in a variety of styles, colors, and types.

## Installation
<doc-installation components="QInput"/>

## Usage
By default, QInput is an input box with a grey underline that changes color when focused. The color is primary by default, and can be set with the `color` attribute.
<doc-example title="Standard" file="QInput/Standard" />

Use the `outlined` attribute to give the input a slightly rounded border.
<doc-example title="Outlined" file="QInput/Outlined" />

Use the `filled` attribute to give the input a slightly rounded background hue.
<doc-example title="Filled" file="QInput/Filled" />

Use the `standout` attribute to give the input a slightly rounded background hue that changes color when focused.
<doc-example title="Standout" file="QInput/Standout" />

Use the `dense` attribute to condense the input. You can combine this with other styles as well.
<doc-example title="Dense" file="QInput/Dense" />

Use labels, stack-labels, and hints to inform the user what information to put in the input.
<doc-example title="Labels" file="QInput/Labels" />

Use the `rounded` attribute to round the background or outline of an input.
<doc-example title="Rounded" file="QInput/Rounded" />

You can place icons, text, or buttons before or after the input.
<doc-example title="Decorations" file="QInput/Decorations" />

Inputs have different types depending on what content should be written in them.
<doc-example title="Types" file="QInput/Types" />

You can validate inputs to ensure proper values. Learn more about validation in the [form validation page](/vue-components/form-validation).
<doc-example title="Validation" file="QInput/Validation" />

Use the `readonly` and `disable` attributes to block user input.
<doc-example title="Read Only and Disable" file="QInput/ReadOnly" />

## API
<doc-api file="QInput" />
