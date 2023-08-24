---
title: Expansion Item
desc: The QExpansionItem Vue component allows visibility toggling like an accordion.
keys: QExpansionItem
examples: QExpansionItem
related:
  - /vue-components/list-and-list-items
  - /vue-components/slide-item
  - /vue-components/slide-transition
---

The QExpansionItem component allows the hiding of content that is not immediately relevant to the user. Think of them as accordion elements that expand when clicked on. It's also known as a collapsible.

They are basically [QItem](/vue-components/list-and-list-items) components wrapped with additional functionality. So they can be included in QLists and inherit QItem component properties.

<doc-api file="QExpansionItem" />

## Usage

### Basic

<doc-example title="Basic" file="Basic" />

### Controlling expansion state

<doc-example title="Controlling expansion state" file="ControlExpansionState" />

### Style

<doc-example title="Dense" file="Dense" />

<doc-example title="Force dark mode" file="Dark" />

### Options

<doc-example title="Switch toggle side" file="SwitchToggleSide" />

<doc-example title="Header slot" file="HeaderSlot" />

<doc-example title="Handling events" file="HandlingEvents" />

When dealing with inset levels, a general rule of thumb is that `header-inset-level` adds left padding to header while it doesn't do anything with the content, while `content-inset-level` adds left padding to the content.

<doc-example title="Playing with inset levels" file="InsetLevels" />

### Behavior

::: tip
The behavior below of toggling by expand icon only is especially useful when having a route attached to the header of QExpansionItem. This way by clicking header it will activate the route and by clicking the expand icon it will, well, expand the content. You can't have both actions attached to the whole header, obviously.
:::

<doc-example title="Toggle by expand icon only" file="IconToggle" />

<doc-example title="Accordion mode" file="Accordion" />

<doc-example title="Popup mode" file="Popup" />
