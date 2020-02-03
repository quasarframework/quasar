---
title: Scroll Area
desc: The QScrollArea Vue component offers a way of customizing the scrollbars for all desktop browsers.
related:
  - /layout/drawer
---

The QScrollArea component offers a neat way of customizing the scrollbars by encapsulating your content. Think of it as a DOM element which has `overflow: auto`, but with your own custom styled scrollbar instead of browser's default one and a few nice features on top.

This is especially useful for desktop as scrollbars are hidden on a mobile device. When on a mobile device, QScrollArea simply wraps the content in a `<div>` configured for default mobile browser scrolling -- so no QScrollArea features apply on such devices. However, if configured with `force-on-mobile` prop, then QScrollArea will work just as on desktops, but it won't have inertial scrolling.

## Installation

<doc-installation components="QScrollArea" />

## Usage

The following examples are best seen on desktop as they make too little sense on a mobile device.

::: tip
You can also take a look at [Layout Drawer](/layout/drawer) to see some more examples of it in action.
:::

### Basic

<doc-example title="Basic" file="QScrollArea/Basic" />

### Styled

<doc-example title="Styled" file="QScrollArea/Styled" />

<doc-example title="Styled thumb and bar" file="QScrollArea/StyledBar" />

### Controlling scrollbar visibility

<q-badge label="v1.3+" />

When using the `visible` Boolean prop, the default mouse over/leave behavior is disabled, leaving you in full control of the scrollbar visibility.

<doc-example title="Controlling scrollbar visibility" file="QScrollArea/ScrollbarVisibility" />

### Delay

When content changes, the scrollbar appears then disappears again. You can set a certain delay (amount of time in milliseconds) before scrollbar disappears again (if component is not hovered):

<doc-example title="Delay" file="QScrollArea/Delay" />

### Scroll position

<doc-example title="Scroll Position" file="QScrollArea/ScrollPosition" />

### Horizontal mode

<doc-example title="Horizontal mode" file="QScrollArea/Horizontal" />

## QScrollArea API

<doc-api file="QScrollArea" />
