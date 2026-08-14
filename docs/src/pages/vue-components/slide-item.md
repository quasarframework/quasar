---
title: Slide Item
desc: The QSlideItem Vue component is essentially a QItem with two additional slots (left and right) which allows the user to drag it to one of the sides in order to apply a specific action.
keys: QSlideItem
examples: QSlideItem
related:
  - /vue-components/list-and-list-items
  - /vue-components/expansion-item
---

The QSlideItem component is essentially a [QItem](/vue-components/list-and-list-items) with two additional slots (`left` and `right`) which allows user to drag the item (through mouse or with the finger on a touch device) to one of the sides in order to apply a specific action.

<DocApi file="QSlideItem" />

## Usage

Drag with the mouse or use your finger to pan to left or right side to see QSlideItem in action.

::: tip
If your content also has images, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.
:::

<DocExample title="Basic" file="Basic" />

<DocExample title="Vertical" file="Vertical" />

<DocExample title="Custom colors" file="CustomColors" />

<DocExample title="Customize while sliding" file="CustomizeSlide" />

<DocExample title="One sided or no sides" file="OneSided" />

## Accessibility <q-badge label="v2.25+" />

::: warning
The slide actions are pointer gestures only — there is no keyboard interaction and no assistive technology path to trigger them. Any behavior you bind to the slide events is unreachable for keyboard and screen reader users.
:::

Always provide an equivalent way to perform the same actions — visible buttons, or a [QMenu](/vue-components/menu) with the same commands — so the gestures remain a convenience rather than the only route.
