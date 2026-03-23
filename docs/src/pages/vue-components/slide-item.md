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
