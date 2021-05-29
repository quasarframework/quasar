---
title: Checkbox
desc: The QCheckbox Vue component is a checkbox with features like coloring, ripple and indeterminate state.
related:
  - /vue-components/toggle
  - /vue-components/option-group
  - /vue-components/radio
  - /vue-components/button-toggle
---

The QCheckbox component is another basic element for user input. You can use this to supply a way for the user to toggle an option.

::: tip
Please also refer to the [QOptionGroup](/vue-components/option-group) on other possibilities for creating groups of Checkboxes.
:::

## QCheckbox API
<doc-api file="QCheckbox" />

## Usage

### Standard

<doc-example title="Standard" file="QCheckbox/Standard" />

### Label

<doc-example title="Label" file="QCheckbox/Label" />

### Coloring

In the second row in the example below, the property `keep-color` is being used to retain the passed in color when the checkbox is not in a toggled state.

<doc-example title="Coloring" file="QCheckbox/Coloring" />

### Dense and dark

<doc-example title="Dense" file="QCheckbox/Dense" />

<doc-example title="On a dark background" file="QCheckbox/OnDarkBackground" dark />

### Sizes <q-badge align="top" color="brand-primary" label="v1.8+" />

Apart from the standard sizes below, you can define your own through the `size` property (last one is a custom size).

<doc-example title="Standard sizes" file="QCheckbox/StandardSizes" />

### Indeterminate state

In the example below, as soon as you click on the first checkbox it starts toggling between true/false. The second checkbox, on the other hand toggles between the three states (indeterminate/true/false) with help from `toggle-indeterminate`. You can optionally set the property `indeterminate-value`, otherwise the indeterminate value will be considered `null`.

<doc-example title="Indeterminate state" file="QCheckbox/IndeterminateState" />

### Toggle order <q-badge align="top" color="brand-primary" label="v1.12+" />

By default, QCheckbox follows this chain when toggling: indeterminate -> checked -> unchecked. However, you can change this behavior through the `toggle-order` prop. This property determines the order of the states and can be `tf` (default) or `ft` (`t` stands for state of true/checked while `f` for state of false/unchecked).

Toggling order is:
* if `toggle-indeterminate` is true, then: indet -> first state -> second state -> indet (and repeat)
* otherwise (no toggle-indeterminate): indet -> first state -> second state -> first state -> second state -> ...

<doc-example title="Toggle order" file="QCheckbox/ToggleOrder" />

### Array model

<doc-example title="Array as model" file="QCheckbox/ArrayAsModel" />

### Custom model values

<doc-example title="Custom model values" file="QCheckbox/CustomModel" />

### With QOptionGroup

::: tip
You can also use [QOptionGroup](/vue-components/option-group), which simplifies the usage when you have groups of checkboxes, like in example below.
:::

<doc-example title="Usage with QOptionGroup" file="QCheckbox/OptionGroup" />

### With QItem

In the example below, we are rendering a `<label>` tag (notice `tag="label"`) so the QCheckbox will respond to clicks on QItems to change toggle state.

<doc-example title="With QItem" file="QCheckbox/InaList" />

### Disable

<doc-example title="Disable" file="QCheckbox/Disable" />

### Native form submit <q-badge align="top" color="brand-primary" label="v1.9+" />

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QCheckbox, otherwise formData will not contain it (if it should) - all value are converted to string (native behaviour, so do not use Object values):

<doc-example title="Native form" file="QCheckbox/NativeForm" />
