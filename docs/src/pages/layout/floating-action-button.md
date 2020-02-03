---
title: Floating Action Button
desc: How to use the QFab component. Floating Action Buttons for your Quasar app.
related:
  - /layout/layout
  - /layout/page
---

A Floating Action Button (FAB) represents the primary action in a Page. But, it's not limited to only a single action. It can contain any number of sub-actions too. And more importantly, it can also be used inline in your Pages or Layouts.

Note that you don’t need a QLayout to use FABs.

## Installation
<doc-installation :components="['QFab', 'QFabAction']" />

## Usage
There are two types of FABs: expandable (has sub-actions) and non-expandable.

### Non-Expandable
If you want a non-expandable FAB, all you need is a round button – wrapped in QPageSticky if used on a QLayout.

<doc-example title="Basic" file="QFab/NonExpandable" />

### Expandable

<doc-example title="Expandable" file="QFab/Expandable" />

<doc-example title="With QPageSticky" file="QFab/PageSticky" />

### Draggable

Below is a nice example of using [TouchPan](/vue-directives/touch-pan) for making the QFab draggable across the screen.

<doc-example title="Draggable" file="QFab/Draggable" />

## QFab API
<doc-api file="QFab" />

## QFabAction API
<doc-api file="QFabAction" />
