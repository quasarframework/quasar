---
title: Resize Observer (for Element)
desc: The QResizeObserver Vue component emits a 'resize' event whenever the wrapping DOM element changes its width or height.
related:
  - /vue-components/scroll-observer
---
QResizeObserver is a Quasar component that emits a `resize` event whenever the wrapping DOM element / component (defined as direct parent of QResizeObserver) changes its size (width and/or height). Note that no polling is involved, but overusing it is costly too.

## QResizeObserver API
<doc-api file="QResizeObserver" />

## Usage
<doc-example title="Basic" file="QResizeObserver/Basic" />

Please note that QResizeObserver will issue an event as soon as it gets rendered and attached to DOM, so you can have the initial size of the container.
