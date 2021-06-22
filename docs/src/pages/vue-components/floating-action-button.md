---
title: Floating Action Button
desc: How to use the QFab component. Floating Action Buttons for your Quasar app.
keys: QFab
related:
  - /layout/layout
  - /layout/page
---

A Floating Action Button (FAB) represents the primary action in a Page. But, it's not limited to only a single action. It can contain any number of sub-actions too. And more importantly, it can also be used inline in your Pages or Layouts.

Note that you don’t need a QLayout to use FABs.

## QFab API

<doc-api file="QFab" />

## QFabAction API

<doc-api file="QFabAction" />

## Usage
There are two types of FABs: expandable (has sub-actions) and non-expandable.

:::tip
For an exhausting list of options, please read the API cards (at the top of this page).
:::

### Non-Expandable
If you want a non-expandable FAB, all you need is a round button – wrapped in QPageSticky if used on a QLayout.

<doc-example title="Non expandable" file="QFab/NonExpandable" />

### Expandable

<doc-example title="Expandable" file="QFab/Expandable" />

### Internal labels

<doc-example title="Internal label" file="QFab/InternalLabel" />

<doc-example title="Toggling internal label" file="QFab/InternalLabelToggling" />

When the labels are internal and your QFab opens up vertically (up or down) then you also have the ability to choose how to vertically align the sub-actions:

<doc-example title="Vertical actions alignment" file="QFab/VerticalActionsAlignment" />

### External labels

By default, when the label is external on the main QFab (not the sub-actions), it gets shown only when QFab is opened. However, you can override that by setting a Boolean value for `hide-label` prop.

<doc-example title="External label" file="QFab/ExternalLabel" />

<doc-example title="Custom styled external label" file="QFab/ExternalLabelStyled" />

<doc-example title="Toggling external label" file="QFab/ExternalLabelToggling" />

### Hide icons

If we hide the icon (through specific prop), we should at least use an internal label:

<doc-example title="Hide icon" file="QFab/HideIcon" />

### Padding

The default padding for QFab is "md" and for QFabAction is "sm". However, you can use `padding` prop to customize it (accepts CSS units too):

<doc-example title="Playing with padding" file="QFab/Padding" />

### Square style

<doc-example title="Square style" file="QFab/SquareStyle" />

### With QPageSticky

<doc-example title="With QPageSticky" file="QFab/PageSticky" />

### Draggable

Below is a nice example of using [TouchPan](/vue-directives/touch-pan) for making the QFab draggable across the screen.

<doc-example title="Draggable" file="QFab/Draggable" />
