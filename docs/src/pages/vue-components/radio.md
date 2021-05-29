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

## QRadio API
<doc-api file="QRadio" />

## Usage

### Standard

<doc-example title="Standard" file="QRadio/Standard" />

### Dense

<doc-example title="Dense" file="QRadio/Dense" />

### Coloring

In the second row in the example below, the property `keep-color` is being used to retain the passed in color when the radio button is not in a toggled state.

<doc-example title="Coloring" file="QRadio/Coloring" />

### Dark and disable

<doc-example title="On a dark background" file="QRadio/OnDarkBackground" dark />

<doc-example title="Disable" file="QRadio/Disable" />

### Label on left-side

<doc-example title="Label on left side" file="QRadio/LabelPosition" />

### Sizes <q-badge align="top" color="brand-primary" label="v1.8+" />

Apart from the standard sizes below, you can define your own through the `size` property (last one is a custom size).

<doc-example title="Standard sizes" file="QRadio/StandardSizes" />

### With QOptionGroup

::: tip
You can also use [QOptionGroup](/vue-components/option-group), which simplifies the usage when you have groups of radios, like in example below.
:::

<doc-example title="Usage with QOptionGroup" file="QRadio/OptionGroup" />

### With QItem

In the example below, we are rendering a `<label>` tag (notice `tag="label"`) so the QRadio will respond to clicks on QItems to change toggle state.

<doc-example title="With QItem" file="QRadio/InaList" />

### Native form submit <q-badge align="top" color="brand-primary" label="v1.9+" />

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QRadio, otherwise formData will not contain it (if it should) - all value are converted to string (native behaviour, so do not use Object values):

<doc-example title="Native form" file="QRadio/NativeForm" />
