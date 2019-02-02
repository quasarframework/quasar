---
title: Input
---

The QInput component is used to capture text input from the user. It uses `v-model`, similar to a regular input. It has support for errors and validation, and comes in a variety of styles, colors, and types.

## Installation
<doc-installation components="QInput"/>

## Design

::: warning
For your QInput you can use only one of the main designs (`filled`, `outlined`, `standout`, `borderless`). You cannot use multiple as they are self-exclusive.
:::

### Standard
<doc-example title="Standard" file="QInput/DesignStandard" />

### Filled
<doc-example title="Filled" file="QInput/DesignFilled" />

### Outlined
<doc-example title="Outlined" file="QInput/DesignOutlined" />

### Standout
<doc-example title="Standout" file="QInput/DesignStandout" />

### Borderless
The `borderless` design allows you to seamlessly integrate your QInput into other components without QInput drawing a border around itself or changing its background color:

<doc-example title="Borderless" file="QInput/Borderless" />

### Rounded design

The `rounded` prop only works along with Filled, Outlined and Standout designs, as showcased in the example below:

<doc-example title="Rounded" file="QInput/Rounded" />

### Dark background

<doc-example title="Dark" file="QInput/Dark" dark />

## Features

### Input types

The following QInputs make use of the `type` prop in order to render native equivalent `<input type="...">` inside of them.

::: warning
Remember that the support and behavior is the subject entirely of the browser rendering the page and not Quasar's core code.
:::

<doc-example title="Input types" file="QInput/InputTypes" />

### Textarea

<doc-example title="Textarea" file="QInput/Textarea" />

When you need QInput to grow along with its content, then use the `autogrow` prop like in the example below:

<doc-example title="Autogrow" file="QInput/Autogrow" />

### Prefix and suffix

<doc-example title="Prefix and suffix" file="QInput/PrefixSuffix" />

### Debouncing model

The role of debouncing is for times when you watch the model and do expensive operations on it. So you want to first let user type out before triggering the model update, rather than updating the model on each keystroke.

<doc-example title="Debounce model" file="QInput/Debouncing" />

### Mask

### Validation

## QInput API
<doc-api file="QInput" />
