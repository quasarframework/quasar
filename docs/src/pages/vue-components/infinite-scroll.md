---
title: QInfiniteScroll
---

The Quasar InfiteScroll component allows you to load new content as the user scrolls down the page.

::: tip
Infinite Scroll loads items in advance when less than `offset` (default = 500) pixels is left to be seen. If the content you fetch has height less than the container’s height on screen then Infinite Scroll will continue loading more content. So make sure you load enough content.
:::


## Installation
<doc-installation components="QInfiniteScroll" />

::: tip
Scroll to the bottom to see QInfiniteScroll in action.
:::

## Usage
<doc-example title="Basic" file="QInfiniteScroll/Basic" />

slot="message" for DOM element to display (in this example a dots spinner) when loading additional content
<doc-example title="Slot" file="QInfiniteScroll/Slot" />

## API
<doc-api file="QInfiniteScroll" />
