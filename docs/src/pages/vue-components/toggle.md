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

### Basic

Use the `color` prop to control the toggle’s color.

<doc-example title="Basic" file="QToggle/Standard" />

### With labels

<doc-example title="With labels" file="QToggle/Labels" />

### Keeping color

<doc-example title="Keep color" file="QToggle/KeepColor" />

### With icons

<doc-example title="Icons" file="QToggle/Icons" />

### Custom model values

Instead of the default `true`/`false` values, you can use custom ones.

<doc-example title="Custom model values" file="QToggle/CustomValues" />

### Array model

If you have a number of toggles for a selection, use can use an Array as the model for all of them and specify `val` prop on each toggle. If the toggle is ticked, its `val` will be inserted into the array and vice versa.

<doc-example title="Array model" file="QToggle/ArrayValue" />

### Dark and disable

<doc-example title="On a dark background" file="QToggle/DarkBackground" dark />

<doc-example title="Disabled state" file="QToggle/Disabled" />

### With QOptionGroup

::: tip
You can also use [QOptionGroup](/vue-components/option-group), which simplifies the usage when you have groups of toggles, like in example below.
:::

<doc-example title="Usage with QOptionGroup" file="QToggle/OptionGroup" />

### With QItem

<doc-example title="With QItem" file="QToggle/List" />

## QToggle API
<doc-api file="QToggle" />
