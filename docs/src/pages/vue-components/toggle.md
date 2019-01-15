---
title: Docs
---
The Quasar Toggle component is another basic element for user input. You can use this for turning settings, features or true/ false inputs on and off.

Please also refer to the [Internal Link](/vue-components/option-group) documentation on other possibilities for creating groups of Toggles.

## Installation
<doc-installation components="QToggle" />

## Usage
Use the `color` prop to control the toggle’s color.
<doc-example title="Basic Usage" file="QToggle/Standard" />

Add label with `label` prop. Use`left-label` to put it on the left side.
<doc-example title="With Labels" file="QToggle/Labels" />

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
<doc-example title="On Dark Background" file="QToggle/DarkBackground" dark />
<doc-example title="Usage with QOptionGroup" file="QToggle/OptionGroup" />
<doc-example title="In a List" file="QToggle/List" />

## API
<doc-api file="QToggle" />
