---
title: Toggle
desc: The QToggle component is a basic element for user input. You can use it for turning settings, features or true/false inputs on and off.
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

## Installation
<doc-installation components="QToggle" />

## Usage
Use the `color` prop to control the toggle’s color.

<doc-example title="Basic" file="QToggle/Standard" />

Add label with `label` prop. Use`left-label` to put it on the left side.

<doc-example title="With labels" file="QToggle/Labels" />

Use `keep-color` prop to keep color in off and disabled state.

<doc-example title="Keep color" file="QToggle/KeepColor" />

Disable Toggle with `disable` prop.

<doc-example title="Disabled state" file="QToggle/Disabled" />

Use `icon` prop to set icon. If you want different icons for each toggle state, use `unchecked-icon` and `checked-icon` props. Specifying `checked-icon` and `unchecked-icon` overrides icon property if you’ve also used it.

<doc-example title="Icons" file="QToggle/Icons" />

Instead of the default `true`/`false` values, you can use custom ones.

<doc-example title="Custom model values" file="QToggle/CustomValues" />

if you have a number of toggles for a selection, use can use an Array as the model for all of them and specify `val` prop on each toggle. If the toggle is ticked, its `val` will be inserted into the array and vice versa.

<doc-example title="Array model" file="QToggle/ArrayValue" />

<doc-example title="On a dark background" file="QToggle/DarkBackground" dark />

::: tip
You can also use [QOptionGroup](/vue-components/option-group), which simplifies the usage when you have groups of toggles, like in example below.
:::

<doc-example title="Usage with QOptionGroup" file="QToggle/OptionGroup" />

<doc-example title="In a list" file="QToggle/List" />

## QToggle API
<doc-api file="QToggle" />
