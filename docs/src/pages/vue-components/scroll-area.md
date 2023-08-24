---
title: Scroll Area
desc: The QScrollArea Vue component offers a way of customizing the scrollbars for all desktop browsers.
keys: QScrollArea
examples: QScrollArea
related:
  - /layout/drawer
---

The QScrollArea component offers a neat way of customizing the scrollbars by encapsulating your content. Think of it as a DOM element which has `overflow: auto`, but with your own custom styled scrollbar instead of browser's default one and a few nice features on top.

<doc-api file="QScrollArea" />

## Usage

The following examples are best seen on desktop as they make too little sense on a mobile device.

::: tip
You can also take a look at [Layout Drawer](/layout/drawer) to see some more examples of it in action.
:::

### Basic

<doc-example title="Vertical content" file="Vertical" />

<doc-example title="Horizontal content" file="Horizontal" />

<doc-example title="Vertical and horizontal content" file="VertHoriz" />

### Styled

<doc-example title="Styled thumb and bar" file="StyledBar" />

<doc-example title="Styled" file="Styled" />

### Dark design

<doc-example title="Force dark mode" file="Dark" />

### Controlling scrollbar visibility

When using the `visible` Boolean prop, the default mouse over/leave behavior is disabled, leaving you in full control of the scrollbar visibility.

<doc-example title="Controlling scrollbar visibility" file="ScrollbarVisibility" />

### Delay

When content changes, the scrollbar appears then disappears again. You can set a certain delay (amount of time in milliseconds) before scrollbar disappears again (if component is not hovered):

<doc-example title="Delay" file="Delay" />

### Scroll position

<doc-example title="Scroll Position" file="ScrollPosition" />

### Scroll event

Below is an example of using the `@scroll` event to synchronize the scrolling between two containers.

<doc-example title="Synchronized" file="Synchronized" />
