---
title: QSplitter
desc: The QSplitter Vue component allow containers to be split vertically and/or horizontally through a draggable separator bar.
keys: QSplitter
examples: QSplitter
related:
  - /vue-components/expansion-item
  - /vue-components/slide-item
  - /vue-components/separator
---

The QSplitter component allow containers to be split vertically and/or horizontally through a draggable separator bar.

<DocApi file="QSplitter" />

## Usage

::: warning
The use of the `before` and `after` slots is required.
:::

Click and drag on the splitter separator bar to see results.

### Basic

<DocExample title="Basic" file="Basic" />

### Horizontal

<DocExample title="Horizontal" file="Horizontal" />

### Custom dragging limits

<DocExample title="Custom dragging limits (50-100)" file="Limits" />

### Model units

By default, the CSS `unit` used is '%' (percentage). But you can also use 'px' (pixels), as in the example below.

<DocExample title="Model in pixels" file="PixelModel" />

### Reverse model

By default, the model is connected to the `before` slot size. But you can reverse that and make it connect to the `after` slot, as in the example below. This feature turns out especially useful if your `unit` is set to pixels and you want to control the `after` slot.

<DocExample title="Reverse model" file="ReverseModel" />

### Adding content to separator

::: tip
If you use images as content for the separator slot, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.
:::

<DocExample title="Adding to separator" file="SeparatorSlot" />

### Dark design

<DocExample title="On a dark background with customized separator" file="CustomizedSeparator" />

### Embedded

A QSplitter can be embedded in another QSplitter's `before` and/or `after` slots, like shown in example below.

<DocExample title="Embedded" file="Embedded" />

### Fun examples

<DocExample title="Image Fun" file="ImageFun" />

<DocExample title="Reactive Images" file="ReactiveImages" />

## Accessibility <q-badge label="v2.25+" />

The separator bar implements the [WAI-ARIA window splitter pattern](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/): it carries `role="separator"` with an `aria-orientation` matching the splitter's direction, `aria-controls` pointing at the panel the model resizes, and `aria-valuemin`/`aria-valuemax`/`aria-valuenow` tracking the split as it moves. A disabled QSplitter exposes `aria-disabled` on the separator and removes it from the Tab order.

Its accessible name defaults to the `label.resize` entry of the [Quasar Language Pack](/options/quasar-language-packs), since a separator's children are presentational in ARIA — whatever you put in the `separator` slot can never name it. Use the `separator-aria-label` prop (v2.25+) to replace that generic name with one that says which panels are being resized, which is what you want as soon as a page holds more than one splitter.

### Keyboard navigation

QSplitter follows the [WAI-ARIA window splitter pattern](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/): the separator bar is a Tab stop exposed to assistive technology as a `separator` with the model as its value. While it has focus, the arrow keys matching the splitter's orientation (left/right, or up/down when in `horizontal` mode) move it by 1% (or 10px when `unit` is set to pixels), while <kbd>Home</kbd>/<kbd>End</kbd> jump to the model's limits. Arrow keys account for the `reverse` prop and RTL language packs, so a given key always moves the separator in the direction it points to. Pressing <kbd>Enter</kbd> collapses the model-controlled panel to its minimum limit, and pressing it again restores the previous position.
