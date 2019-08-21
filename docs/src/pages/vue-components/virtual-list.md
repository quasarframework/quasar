---
title: Virtual List
desc: The QVirtualList component renders a big list of items as the user scrolls in the container, keeping DOM tree clean and eating the lowest amount of memory possible.
related:
  - /vue-components/select
---

> Introduced in Quasar v1.1+

The QVirtualList component (also known as "virtual scroll") allows you to display only a part of a long list of items and update the visible items as the user scrolls in the container. This has several advantages: only visible items are rendered, so the smallest number of nodes are in the DOM tree at any given point in time and the memory consumption is kept at its lowest.


## Installation
<doc-installation components="QVirtualList" />

## Usage

::: tip
* To get the best performance while using large lists freeze the array you are passing in the `items` prop using `Object.freeze(items)`. This allows Vue to skip making the list "responsive" to changes.
* The number of items that will be rendered will be calculated based on the `virtual-list-item-size` prop and the size of the scrolling container, but you can fit it to your needs using the `virtual-list-slice-size` prop.
* Use the `virtual-list-item-size` to specify the size of elements (pixels of height or width, if horizontal). After an element is rendered on screen it's size is updated automatically, but if you specify an element size close to the real size you'll get a better initial indication of the scroll position. Regardless if you will be using this property or not, QVirtualList will still work, but without it you may experience the scrollbar not following the mouse grab position while continuously scrolling (on desktop) or the actual scroll of the container getting slightly off by one or two elements when on mobile and continuously scrolling.
:::

::: warning
* There is a maximum height of the scrolling container, imposed by the browser. In IE11 this is around 1,000,000px, while in the rest of the browsers it's much more, but still limited.
:::

Scroll the examples below to see QVirtualList in action.

### Basic

<doc-example title="Basic" file="QVirtualList/Basic" />

### Horizontal

<doc-example title="Horizontal" file="QVirtualList/BasicHorizontal" />

### Different templates

<doc-example title="Different Templates for Items" file="QVirtualList/VariousContent" />

<doc-example title="Different Templates for Horizontal Items" file="QVirtualList/VariousContentHorizontal" />

### Scroll target

If you need to specify the scroll target (because the auto detected one is not the desired one) pass a CSS selector (as string) or the DOM element to the `scroll-target` prop.

If you need to use the virtual list with the whole page as the scrolling element then please set  `scroll-target="body"`.

::: warning
* If you pass a custom scroll target container with `scroll-target` prop you must make sure that the element exists and that it can be overflowed (it must have a maximum height and an overflow that allows scrolling).
* If the scroll target container cannot be overflowed you'll get the whole list rendered.
:::

::: danger
If you want to use a Vue reference for `scroll-target`, please take care to set it after mounting the component, like in the example below.
:::

<doc-example title="Custom Scroll Target Container" file="QVirtualList/Container" scrollable />

<doc-example title="Scroll to Position" file="QVirtualList/ScrollTo" />

### Sync and async

You can also generate the items to be displayed on the list by using the `items-fn` prop.

::: warning
Make sure to use a synchronous function that returns the list of items to be displayed.
:::

If you need async data use a component that retrieves and renders the data.

<doc-example title="Generate Items on the Fly" file="QVirtualList/GenerateItems" />

## QVirtualList API
<doc-api file="QVirtualList" />
