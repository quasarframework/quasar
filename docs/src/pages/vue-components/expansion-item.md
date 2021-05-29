---
title: Expansion Item
desc: The QExpansionItem Vue component allows visibility toggling like an accordion.
related:
  - /vue-components/list-and-list-items
  - /vue-components/slide-item
  - /vue-components/slide-transition
---

The QExpansionItem component allows the hiding of content that is not immediately relevant to the user. Think of them as accordion elements that expand when clicked on. It's also known as a collapsible.

They are basically [QItem](/vue-components/list-and-list-items) components wrapped with additional functionality. So they can be included in QLists and inherit QItem component properties.

## QExpansionItem API
<doc-api file="QExpansionItem" />

## Usage

### Basic

<doc-example title="Basic" file="QExpansionItem/Basic" />

### Controlling expansion state

<doc-example title="Controlling expansion state" file="QExpansionItem/ControlExpansionState" />

### Style

<doc-example title="Dense" file="QExpansionItem/Dense" />

<doc-example title="On a dark background" file="QExpansionItem/Dark" dark />

### Options

<doc-example title="Switch toggle side" file="QExpansionItem/SwitchToggleSide" />

<doc-example title="Header slot" file="QExpansionItem/HeaderSlot" />

<doc-example title="Handling events" file="QExpansionItem/HandlingEvents" />

When dealing with inset levels, a general rule of thumb is that `header-inset-level` adds left padding to header while it doesn't do anything with the content, while `content-inset-level` adds left padding to the content.

<doc-example title="Playing with inset levels" file="QExpansionItem/InsetLevels" />

### Behavior

::: tip
The behavior below of toggling by expand icon only is especially useful when having a route attached to the header of QExpansionItem. This way by clicking header it will activate the route and by clicking the expand icon it will, well, expand the content. You can't have both actions attached to the whole header, obviously.
:::

<doc-example title="Toggle by expand icon only" file="QExpansionItem/IconToggle" />

<doc-example title="Accordion mode" file="QExpansionItem/Accordion" />

<doc-example title="Popup mode" file="QExpansionItem/Popup" />
