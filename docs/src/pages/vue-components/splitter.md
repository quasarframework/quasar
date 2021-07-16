---
title: QSplitter
desc: The QSplitter Vue component allow containers to be split vertically and/or horizontally through a draggable separator bar.
keys: QSplitter
related:
  - /vue-components/expansion-item
  - /vue-components/slide-item
  - /vue-components/separator
---

The QSplitter component allow containers to be split vertically and/or horizontally through a draggable separator bar.


## QSplitter API

<doc-api file="QSplitter" />

## Usage

::: warning
The use of the `before` and `after` slots is required.
:::

Click and drag on the splitter separator bar to see results.

### Basic

<doc-example title="Basic" file="QSplitter/Basic" />

### Horizontal

<doc-example title="Horizontal" file="QSplitter/Horizontal" />

### Custom dragging limits

<doc-example title="Custom dragging limits (50-100)" file="QSplitter/Limits" />

### Model units

By default, the CSS `unit` used is '%' (percentage). But you can also use 'px' (pixels), as in the example below.

<doc-example title="Model in pixels" file="QSplitter/PixelModel" />

### Reverse model

By default, the model is connected to the `before` slot size. But you can reverse that and make it connect to the `after` slot, as in the example below. This feature turns out especially useful if your `unit` is set to pixels and you want to control the `after` slot.

<doc-example title="Reverse model" file="QSplitter/ReverseModel" />

### Adding content to separator

::: tip
If you use images as content for the separator slot, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.
:::

<doc-example title="Adding to separator" file="QSplitter/SeparatorSlot" />

### Dark design

<doc-example title="On a dark background with customized separator" file="QSplitter/CustomizedSeparator" dark />

### Embedded

A QSplitter can be embedded in another QSplitter's `before` and/or `after` slots, like shown in example below.

<doc-example title="Embedded" file="QSplitter/Embedded" />

### Fun examples

<doc-example title="Image Fun" file="QSplitter/ImageFun" />

<doc-example title="Reactive Images" file="QSplitter/ReactiveImages" />
