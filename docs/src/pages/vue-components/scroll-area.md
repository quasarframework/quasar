---
title: Scroll Area
desc: The QScrollArea Vue component offers a way of customizing the scrollbars for all desktop browsers.
keys: QScrollArea
related:
  - /layout/drawer
---

The QScrollArea component offers a neat way of customizing the scrollbars by encapsulating your content. Think of it as a DOM element which has `overflow: auto`, but with your own custom styled scrollbar instead of browser's default one and a few nice features on top.

## QScrollArea API

<doc-api file="QScrollArea" />

## Usage

The following examples are best seen on desktop as they make too little sense on a mobile device.

::: tip
You can also take a look at [Layout Drawer](/layout/drawer) to see some more examples of it in action.
:::

### Basic

<doc-example title="Vertical content" file="QScrollArea/Vertical" />

<doc-example title="Horizontal content" file="QScrollArea/Horizontal" />

<doc-example title="Vertical and horizontal content" file="QScrollArea/VertHoriz" />

### Styled

<doc-example title="Styled thumb and bar" file="QScrollArea/StyledBar" />

<doc-example title="Styled" file="QScrollArea/Styled" />

### Dark

<doc-example title="Dark" file="QScrollArea/Dark" />

### Controlling scrollbar visibility

When using the `visible` Boolean prop, the default mouse over/leave behavior is disabled, leaving you in full control of the scrollbar visibility.

<doc-example title="Controlling scrollbar visibility" file="QScrollArea/ScrollbarVisibility" />

### Delay

When content changes, the scrollbar appears then disappears again. You can set a certain delay (amount of time in milliseconds) before scrollbar disappears again (if component is not hovered):

<doc-example title="Delay" file="QScrollArea/Delay" />

### Scroll position

<doc-example title="Scroll Position" file="QScrollArea/ScrollPosition" />

### Scroll event

Below is an example of using the `@scroll` event to synchronize the scrolling between two containers.

<doc-example title="Synchronized" file="QScrollArea/Synchronized" />
