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

### Disable and readonly
<doc-example title="Disable and readonly" file="QSelect/DisableReadonly" />

### Menu transitions

::: warning
Please note that transitions do not work when using `options-cover` prop.
:::

In the example below there's a few transitions showcased. For a full list of transitions available, go to [Transitions](/options/transitions).

<doc-example title="Menu transitions" file="QSelect/MenuTransitions" />

## The options

<doc-example title="String options" file="QSelect/OptionString" />

<doc-example title="Object options" file="QSelect/OptionObject" />

<doc-example title="Emit-value" file="QSelect/OptionEmitValue" />

<doc-example title="Map options" file="QSelect/OptionMapOptions" />

<doc-example title="Custom label, value and disable props" file="QSelect/OptionCustomProps" />

<doc-example title="Options slot" file="QSelect/OptionSlot" />

<doc-example title="No options slot" file="QSelect/OptionsNoneSlot" />

<doc-example title="Menu covering component" file="QSelect/OptionCover" />

## The display value

<doc-example title="Custom display value" file="QSelect/DisplayCustomValue" />

<doc-example title="Chips as display value" file="QSelect/DisplayChips" />

<doc-example title="Selected slot" file="QSelect/DisplaySelectedSlot" />

## The model

<doc-example title="Single vs multiple selection" file="QSelect/ModelSingleMultiple" />

<doc-example title="Multiple selection, counter and max-values" file="QSelect/ModelMultipleCounter" />

## Using an input textfield

## Render performance

The render performance is NOT affected much by the number of options, unless `map-options` is used on a large set.
Notice the infinite scroll in place which renders additional options as the user scrolls through the list.

<doc-example title="10k options" file="QSelect/Render10k" />

## QSelect API
<doc-api file="QSelect" />
