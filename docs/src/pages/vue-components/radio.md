---
title: Radio
desc: The QRadio Vue component is a basic element for user input. It can be used to supply a way for the user to pick an option from multiple choices.
related:
  - /vue-components/option-group
  - /vue-components/button-toggle
  - /vue-components/checkbox
  - /vue-components/toggle
---

The QRadio component is another basic element for user input. You can use this to supply a way for the user to pick an option from multiple choices.

::: tip
Please also refer to the [QOptionGroup](/vue-components/option-group) on other possibilities for creating groups of Radios.
:::

## Installation
<doc-installation components="QRadio" />

## Usage
<doc-example title="Standard" file="QRadio/Standard" />

<doc-example title="Dense" file="QRadio/Dense" />

In the second row in the example below, the property `keep-color` is being used to retain the passed in color when the radio button is not in a toggled state.

<doc-example title="Coloring" file="QRadio/Coloring" />

<doc-example title="On a dark background" file="QRadio/OnDarkBackground" dark />

<doc-example title="Label on left side" file="QRadio/LabelPosition" />

::: tip
You can also use [QOptionGroup](/vue-components/option-group), which simplifies the usage when you have groups of radios, like in example below.
:::

<doc-example title="Usage with QOptionGroup" file="QRadio/OptionGroup" />

In the example below, we are rendering a `<label>` tag (notice `tag="label"`) so the QRadio will respond to clicks on QItems to change toggle state.

<doc-example title="In a list" file="QRadio/InaList" />

<doc-example title="Disable" file="QRadio/Disable" />

## QRadio API
<doc-api file="QRadio" />
