---
title: Expansion Item
---

The QExpansionItem component allows the hiding of content that is not immediately relevant to the user. Think of them as accordion elements that expand when clicked on.

They are basically [QItem](/vue-components/list-and-list-item) components wrapped with additional functionality. So they can be included in QLists and inherit QItem component properties.

## Installation
<doc-installation components="QExpansionItem" />

## Usage

<doc-example title="Basic" file="QExpansionItem/Basic" />

<doc-example title="Dense" file="QExpansionItem/Dense" />

<doc-example title="Controlling expansion state" file="QExpansionItem/ControlExpansionState" />

### Options

<doc-example title="Switch toggle side" file="QExpansionItem/SwitchToggleSide" />

<doc-example title="Header slot" file="QExpansionItem/HeaderSlot" />

<doc-example title="Handling events" file="QExpansionItem/HandlingEvents" />

When dealing with inset levels, a general rule of thumb is that `header-inset-level` adds left padding to header while it doesn't do anything with the content, while `content-inset-level` adds left padding to the content.

<doc-example title="Playing with inset levels" file="QExpansionItem/InsetLevels" />

### Behavior

<doc-example title="Toggle by expand icon only" file="QExpansionItem/IconToggle" />

<doc-example title="Accordion mode" file="QExpansionItem/Accordion" />

<doc-example title="Popup mode" file="QExpansionItem/Popup" />

## QExpansionItem API
<doc-api file="QExpansionItem" />
