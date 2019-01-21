---
title: QMenu
---

The QMenu component is a convenient way to show menus. Goes very well with [QList](/vue-components/lists-and-list-items) as dropdown content, but it's by no means limited to it.

## Installation
<doc-installation components="QMenu" />

::: tip
Don't forget to use the directive `v-close-menu` in your clickable menu items if you want the menu to close automatically.
Alternatively, you can use the `q-menu` property `auto-close`.
:::

::: tip
`q-menu` by itself will not show anything. You should use it in a default slot of another component. For example, a `q-btn`.
:::

## Usage
<doc-example title="Basic" file="QMenu/Basic" />

:::tip
In the second example below, check out the `file` menu for sub-level menus.
:::

<doc-example title="Target" file="QMenu/Target" />

### Design and Styling

<doc-example title="Transitions" file="QMenu/Transitions" />

<doc-example title="Alignment" file="QMenu/Alignment" />

<doc-example title="Style" file="QMenu/Style" />

### Contextual

<doc-example title="Context Menu" file="QMenu/ContextMenu" />

### Ideas

<doc-example title="Various Content" file="QMenu/VariousContent" />

## API
<doc-api file="QMenu" />
