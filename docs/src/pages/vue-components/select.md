---
title: Select
---

The QSelect component has two types of selection: single or multiple. This component opens up a Popover for the selection list and action. A filter can also be used for longer lists.

## Installation
<doc-installation components="QSelect"/>

## Design

### Overview
::: warning
For your QSelect you can use only one of the main designs (`filled`, `outlined`, `standout`, `borderless`). You cannot use multiple as they are self-exclusive.
:::

<doc-example title="Design Overview" file="QSelect/DesignOverview" />

### Decorators

<doc-example title="Decorators" file="QSelect/Decorators" />

### Coloring

<doc-example title="Coloring" file="QSelect/Coloring" />

### Disable and readonly
<doc-example title="Disable and readonly" file="QSelect/DisableReadonly" />

### Menu transitions

::: warning
Please note that transitions do not work when using `options-cover` prop.
:::

In the example below there's a few transitions showcased. For a full list of transitions available, go to [Transitions](/options/transitions).

<doc-example title="Menu transitions" file="QSelect/MenuTransitions" />

## The model

::: danger
The model for single selection can be anything (String, Object, ...) while the model for multiple selection must be an Array.
:::

<doc-example title="Single vs multiple selection" file="QSelect/ModelSingleMultiple" />

<doc-example title="Multiple selection, counter and max-values" file="QSelect/ModelMultipleCounter" />

The model content can be influenced by `emit-value` prop as you'll learn in "The options" section below.

## The options

### Options type

<doc-example title="String options" file="QSelect/OptionString" />

<doc-example title="Object options" file="QSelect/OptionObject" />

### Affecting model

When `emit-value` is used, the model becomes the determined `value` from the specified selected option. Default is to emit the whole option. It makes sense to use it only when the options are of Object form.

<doc-example title="Emit-value" file="QSelect/OptionEmitValue" />

When `map-options` is used, the model can contain only the `value`, and it will be mapped against the options to determine its label. There is a performance penalty involved, so use it only if absolutely necessary. It's not needed, for example, if the model contains the whole Object (so contains the label prop).

<doc-example title="Map options" file="QSelect/OptionMapOptions" />

### Custom prop names

By default, QSelect looks at `label`, `value` and `disable` props of each option from the options array Objects. But you can override those:

<doc-example title="Custom label, value and disable props" file="QSelect/OptionCustomProps" />

### Customizing menu options

<doc-example title="Options slot" file="QSelect/OptionSlot" />

By default, when there are no options, the menu won't appear. But you can customize this scenario and specify what the menu should display.

<doc-example title="No options slot" file="QSelect/OptionNoneSlot" />

### Lazy loading

The following example shows a glimpse of how you can play with lazy loading the options. This means, along with many other things, that `options` prop is not required on first render.

<doc-example title="Lazy load options" file="QSelect/OptionLazyLoad" />

### Cover mode

<doc-example title="Menu covering component" file="QSelect/OptionCover" />

## The display value

<doc-example title="Custom display value" file="QSelect/DisplayCustomValue" />

<doc-example title="Chips as display value" file="QSelect/DisplayChips" />

<doc-example title="Selected-item slot" file="QSelect/DisplaySelectedItemSlot" />

## Filtering and autocomplete

<doc-example title="Filtering options" file="QSelect/InputFilter" />

<doc-example title="Autocomplete on more than 2 chars" file="QSelect/InputFilterMin" />

<doc-example title="Lazy autocomplete" file="QSelect/InputFilterLazy" />

## Create new values

::: tip
The following are just a few examples to get you started into making your own QSelect behavior. This is not exhaustive list of possibilities that QSelect offers.
:::

No filtering and no menu:

<doc-example title="No filtering" file="QSelect/NoFiltering" />

Filtering and adding the new values to menu:

<doc-example title="Filtering and adding to menu" file="QSelect/FilteringAddsToMenu" />

Filters new values (in the example below the value to be added requires at least 3 characters to pass), and does not add to menu:

<doc-example title="Filtering without adding to menu" file="QSelect/FilteringNoAddToMenu" />

## Render performance

The render performance is NOT affected much by the number of options, unless `map-options` is used on a large set.
Notice the infinite scroll in place which renders additional options as the user scrolls through the list.

<doc-example title="10k options" file="QSelect/Render10k" />

## QSelect API
<doc-api file="QSelect" />
