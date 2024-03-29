---
title: Radio
desc: The QRadio Vue component is a basic element for user input. It can be used to supply a way for the user to pick an option from multiple choices.
keys: QRadio
examples: QRadio
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

<DocApi file="QRadio" />

## Usage

### Standard

<DocExample title="Standard" file="Standard" />

### With custom icons <q-badge label="v2.5+" />

<DocExample title="With icons" file="WithIcons" />

### Dense

<DocExample title="Dense" file="Dense" />

### Coloring

In the second row in the example below, the property `keep-color` is being used to retain the passed in color when the radio button is not in a toggled state.

<DocExample title="Coloring" file="Coloring" />

### Force dark mode

<DocExample title="Force dark mode" file="OnDarkBackground" />

### Disable

<DocExample title="Disable" file="Disable" />

### Label on left-side

<DocExample title="Label on left side" file="LabelPosition" />

### Sizes

Apart from the standard sizes below, you can define your own through the `size` property (last one is a custom size).

<DocExample title="Standard sizes" file="StandardSizes" />

### With QOptionGroup

::: tip
You can also use [QOptionGroup](/vue-components/option-group), which simplifies the usage when you have groups of radios, like in example below.
:::

<DocExample title="Usage with QOptionGroup" file="OptionGroup" />

### With QItem

In the example below, we are rendering a `<label>` tag (notice `tag="label"`) so the QRadio will respond to clicks on QItems to change toggle state.

<DocExample title="With QItem" file="InaList" />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QRadio, otherwise formData will not contain it (if it should) - all value are converted to string (native behaviour, so do not use Object values):

<DocExample title="Native form" file="NativeForm" />
