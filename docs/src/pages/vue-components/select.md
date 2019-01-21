---
title: Select
---

Select component has two types of selection: single or multiple. This component opens up a Popover for the selection list and action. A filter can also be used for longer lists.

## Installation
<doc-installation components="QSelect"/>

## Usage
<doc-example title="Types" file="QSelect/Types" />

<doc-example title="Design" file="QSelect/Design" />

<doc-example title="Multiple select" file="QSelect/Multiple" />

<doc-example title="Other features" file="QSelect/Features" />

<doc-example title="Slots" file="QSelect/Slots" />

### Custom field keys
If you have options in different format than label/value objects, you can specify which properties should be used for label, value and disable props.

<doc-example title="Custom option fields" file="QSelect/OptionProps" />

If you have options with different structure, you can even provide function which returns the field key for each item during render.

<doc-example title="Functional option fields" file="QSelect/OptionPropsFunctional" />

### Filtering input
You can use `@filter` prop to filter the options.

<doc-example title="Filter with input" file="QSelect/Filter" />

## API
<doc-api file="QSelect" />
