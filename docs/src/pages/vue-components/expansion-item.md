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

<DocApi file="QExpansionItem" />

## Usage

### Basic

<DocExample title="Basic" file="Basic" />

### Controlling expansion state

<DocExample title="Controlling expansion state" file="ControlExpansionState" />

### Style

<DocExample title="Dense" file="Dense" />

<DocExample title="Force dark mode" file="Dark" />

### Options

<DocExample title="Switch toggle side" file="SwitchToggleSide" />

<DocExample title="Header slot" file="HeaderSlot" />

<DocExample title="Handling events" file="HandlingEvents" />

When dealing with inset levels, a general rule of thumb is that `header-inset-level` adds left padding to header while it doesn't do anything with the content, while `content-inset-level` adds left padding to the content.

<DocExample title="Playing with inset levels" file="InsetLevels" />

### Behavior

::: tip
The behavior below of toggling by expand icon only is especially useful when having a route attached to the header of QExpansionItem. This way by clicking header it will activate the route and by clicking the expand icon it will, well, expand the content. You can't have both actions attached to the whole header, obviously.
:::

<DocExample title="Toggle by expand icon only" file="IconToggle" />

<DocExample title="Accordion mode" file="Accordion" />

<DocExample title="Popup mode" file="Popup" />
