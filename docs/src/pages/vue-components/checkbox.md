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

In the example below, we are using the `label` property to assign text to the checkbox. In the second row in the example below, the property `left-label` is being used to display the text on the left-side of the checkbox.

<doc-example title="Label" file="QCheckbox/Label" />

In the example below, we are using the `color` property to assign color to the checkbox. In the second row in the example below, the property `keep-color` is being used to retain the passed in color when the checkbox is not in a toggled state.

<doc-example title="Coloring" file="QCheckbox/Coloring" />

<doc-example title="Dense" file="QCheckbox/Dense" />

<doc-example title="On Dark Background" file="QCheckbox/OnDarkBackground" dark />

In the example below, the checkbox is using the property `toggle-indeterminate`. When used, you can optionally set the property `indeterminate-value`, otherwise the indeterminate value will be `null`.
<doc-example title="Indeterminate State" file="QCheckbox/IndeterminateState" />

<doc-example title="Array as Model" file="QCheckbox/ArrayAsModel" />

<doc-example title="Custom Model Values" file="QCheckbox/CustomModel" />

> In the example below, we are rendering a `<label>` tag (notice `tag="label"`) so the QCheckbox will respond to clicks on QItems to change toggle state.

<doc-example title="In a List" file="QCheckbox/InaList" />

## API
<doc-api file="QCheckbox" />
