---
title: Checkbox
---

The Quasar Checkbox component is another basic element for user input. You can use this to supply a way for the user to toggle an option.

::: tip
Please also refer to the [QOptionGroup](/vue-components/option-group) on other possibilities for creating groups of Checkboxes.
:::


## Installation
<doc-installation components="QCheckbox" />

## Usage
<doc-example title="Standard" file="QCheckbox/Standard" />

<doc-example title="Label" file="QCheckbox/Label" />

In the second row in the example below, the property `keep-color` is being used to retain the passed in color when the checkbox is not in a toggled state.

<doc-example title="Coloring" file="QCheckbox/Coloring" />

<doc-example title="Dense" file="QCheckbox/Dense" />

<doc-example title="On Dark Background" file="QCheckbox/OnDarkBackground" dark />

In the example below, as soon as you click on the first checkbox it starts toggling between true/false. The second checkbox, on the other hand toggles between the three states (indeterminate/true/false) with help from `toggle-indeterminate`. You can optionally set the property `indeterminate-value`, otherwise the indeterminate value will be considered `null`.
<doc-example title="Indeterminate State" file="QCheckbox/IndeterminateState" />

<doc-example title="Array as Model" file="QCheckbox/ArrayAsModel" />

<doc-example title="Custom Model Values" file="QCheckbox/CustomModel" />

::: tip
You can also use [QOptionGroup](/vue-components/option-group), which simplifies the usage when you have groups of checkboxes, like in example below.
:::
<doc-example title="Usage with QOptionGroup" file="QCheckbox/OptionGroup" />

In the example below, we are rendering a `<label>` tag (notice `tag="label"`) so the QCheckbox will respond to clicks on QItems to change toggle state.
<doc-example title="In a List" file="QCheckbox/InaList" />

<doc-example title="Disable" file="QCheckbox/Disable" />

## API
<doc-api file="QCheckbox" />
