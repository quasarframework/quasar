---
title: Checkbox
desc: The QCheckbox Vue component is a checkbox with features like coloring, ripple and indeterminate state.
keys: QCheckbox
examples: QCheckbox
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

<DocApi file="QCheckbox" />

## Usage

### Standard

<DocExample title="Standard" file="Standard" />

### With custom icons <q-badge label="v2.5+" />

<DocExample title="With icons" file="WithIcons" />

### Label

<DocExample title="Label" file="Label" />

### Coloring

In the second row in the example below, the property `keep-color` is being used to retain the passed in color when the checkbox is not in a toggled state.

<DocExample title="Coloring" file="Coloring" />

### Dense

<DocExample title="Dense" file="Dense" />

### Force dark mode

<DocExample title="Force dark mode" file="OnDarkBackground" />

### Sizes

Apart from the standard sizes below, you can define your own through the `size` property (last one is a custom size).

<DocExample title="Standard sizes" file="StandardSizes" />

### Indeterminate state

In the example below, as soon as you click on the first checkbox it starts toggling between true/false. The second checkbox, on the other hand toggles between the three states (indeterminate/true/false) with help from `toggle-indeterminate`. You can optionally set the property `indeterminate-value`, otherwise the indeterminate value will be considered `null`.

<DocExample title="Indeterminate state" file="IndeterminateState" />

### Toggle order

By default, QCheckbox follows this chain when toggling: indeterminate -> checked -> unchecked. However, you can change this behavior through the `toggle-order` prop. This property determines the order of the states and can be `tf` (default) or `ft` (`t` stands for state of true/checked while `f` for state of false/unchecked).

Toggling order is:

- if `toggle-indeterminate` is true, then: indet -> first state -> second state -> indet (and repeat)
- otherwise (no toggle-indeterminate): indet -> first state -> second state -> first state -> second state -> ...

<DocExample title="Toggle order" file="ToggleOrder" />

### Array model

<DocExample title="Array as model" file="ArrayAsModel" />

### Custom model values

<DocExample title="Custom model values" file="CustomModel" />

### With QOptionGroup

::: tip
You can also use [QOptionGroup](/vue-components/option-group), which simplifies the usage when you have groups of checkboxes, like in example below.
:::

<DocExample title="Usage with QOptionGroup" file="OptionGroup" />

### With QItem

In the example below, we are rendering a `<label>` tag (notice `tag="label"`) so the QCheckbox will respond to clicks on QItems to change toggle state.

<DocExample title="With QItem" file="InaList" />

### Disable

<DocExample title="Disable" file="Disable" />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QCheckbox, otherwise formData will not contain it (if it should) - all value are converted to string (native behaviour, so do not use Object values):

<DocExample title="Native form" file="NativeForm" />
