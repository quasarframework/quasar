---
title: Toggle
desc: The QToggle component is a basic element for user input. You can use it for turning settings, features or true/false inputs on and off.
keys: QToggle
examples: QToggle
related:
  - /vue-components/checkbox
  - /vue-components/option-group
  - /vue-components/radio
  - /vue-components/button-toggle
---

The QToggle component is another basic element for user input. You can use this for turning settings, features or true/false inputs on and off.

::: tip
Please also refer to the [QOptionGroup](/vue-components/option-group) on other possibilities for creating groups of Checkboxes.
:::

<doc-api file="QToggle" />

## Usage

### Basic

Use the `color` prop to control the toggle’s color.

<doc-example title="Basic" file="Standard" />

### With labels

<doc-example title="With labels" file="Labels" />

### Keeping color

<doc-example title="Keep color" file="KeepColor" />

### With icons

<doc-example title="Icons" file="Icons" />

### Custom model values

Instead of the default `true` / `false` values, you can use custom ones.

<doc-example title="Custom model values" file="CustomValues" />

### Indeterminate state

In the example below, as soon as you click on the first QToggle it starts toggling between true/false. The second QToggle, on the other hand toggles between the three states (indeterminate/true/false) with help from `toggle-indeterminate`. You can optionally set the property `indeterminate-value`, otherwise the indeterminate value will be considered `null`.

<doc-example title="Indeterminate state" file="IndeterminateState" />

### Toggle order

By default, QToggle follows this chain when toggling: indeterminate -> checked -> unchecked. However, you can change this behavior through the `toggle-order` prop. This property determines the order of the states and can be `tf` (default) or `ft` (`t` stands for state of true/checked while `f` for state of false/unchecked).

Toggling order is:

* if `toggle-indeterminate` is true, then: indet -> first state -> second state -> indet (and repeat)
* otherwise (no toggle-indeterminate): indet -> first state -> second state -> first state -> second state -> ...

<doc-example title="Toggle order" file="ToggleOrder" />

### Array model

If you have a number of toggles for a selection, use can use an Array as the model for all of them and specify `val` prop on each toggle. If the toggle is ticked, its `val` will be inserted into the array and vice versa.

<doc-example title="Array model" file="ArrayValue" />

### Dark design

<doc-example title="Force dark mode" file="DarkBackground" />

### Disable

<doc-example title="Disabled state" file="Disabled" />

### Sizes

Apart from the standard sizes below, you can define your own through the `size` property (last one is a custom size).

<doc-example title="Standard sizes" file="StandardSizes" />

### With QOptionGroup

::: tip
You can also use [QOptionGroup](/vue-components/option-group), which simplifies the usage when you have groups of toggles, like in example below.
:::

<doc-example title="Usage with QOptionGroup" file="OptionGroup" />

### With QItem

<doc-example title="With QItem" file="List" />

### Native form submit

When dealing with a native form which has an `action` and a `method` (eg. when using Quasar with ASP.NET controllers), you need to specify the `name` property on QToggle, otherwise formData will not contain it (if it should) - all value are converted to string (native behaviour, so do not use Object values):

<doc-example title="Native form" file="NativeForm" />
