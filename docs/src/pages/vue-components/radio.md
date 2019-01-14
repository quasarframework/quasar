---
title: Radio
---

The Quasar Radio component is another basic element for user input. You can use this to supply a way for the user to pick an option from multiple choices.

::: tip
Please also refer to the [QOptionGroup](/vue-components/option-group) on other possibilities for creating groups of Radios.
:::

## Installation
<doc-installation components="QRadio" />

## Usage
<doc-example title="Standard" file="QRadio/Standard" />

> In the example below, the property `dense` is being used. This is a good property to use when the radio buttons are placed in a small area.

<doc-example title="Dense" file="QRadio/Dense" />

> In the example below, the property `color` (ex: `color="teal"`) is being used to change the color of the radio button.

> In the second row, the property `keep-color` is being used retain the passed in color when the radio button does not have focus.

<doc-example title="Coloring" file="QRadio/Coloring" />

> In the example below, the property `dark` is being used to indicate the radio button will be on a dark background.

<doc-example title="On Dark Background" file="QRadio/OnDarkBackground" dark />

> In the example below, the property `left-label` is being used to place the label on the left-side of the radio button.

<doc-example title="Label on Left Side" file="QRadio/LabelPosition" />

> In the example below, we are rendering a `<label>` tag (notice `tag="label"`) so the QRadio will respond to clicks on QItems to change toggle state.

<doc-example title="In a List" file="QRadio/InaList" />

## API
<doc-api file="QRadio" />
