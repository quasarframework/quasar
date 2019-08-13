---
title: Virtual List
desc: The QVirtualList Vue component allows you to display only a part of a long list of items and update the visible items as the user scrolls in the container.
related:
  - /vue-components/select
---

The QVirtualList component allows you to display only a part of a long list of items and update the visible items as the user scrolls in the container.

## Installation
<doc-installation components="QVirtualList" />

## Usage

::: tip
To get the best performance while using large lists freeze the array you are passing in the `items` prop using `Object.freeze(items)`.
:::

::: tip
The number of items that will be rendered will be calculated based on the `virtual-list-item-default-size` prop and the size of the scrolling container, but you can fit it to your needs using the `virtual-list-slice-size` prop.
:::

::: tip
Use the `virtual-list-item-default-size` to specify the initial size of elements. After an element is rendered on screen it's size is updated automatically, but if you specify a default size close to the real size you'll get a better initial indication of the scroll position.
:::

::: warning
There is a maximum height of the scrolling container, imposed by the browser. In IE11 this is arround 1,000,000px, in the rest of the browsers it much more, but still limited.
:::

::: warning
When emulating an Apple device on a non-Apple platform the scroll will mallfunction when scrolling down. Just scroll back up to stop the scrolling.
:::

Scroll the examples to see them in action.

<doc-example title="Basic" file="QVirtualList/Basic" />

<doc-example title="Horizontal" file="QVirtualList/BasicHorizontal" />

<doc-example title="Different Templates for Items" file="QVirtualList/VariousContent" />

<doc-example title="Different Templates for Horizontal Items" file="QVirtualList/VariousContentHorizontal" />

::: warning
If you want to use a Vue reference for `scroll-target` take care to set it after mounting the component, like in the example below.
:::

<doc-example title="Custom Scroll Target Container" file="QVirtualList/Container" scrollable />

<doc-example title="Scroll to Position" file="QVirtualList/ScrollTo" />

You can also generate the items to be displayed on the list by using the `items-fn` prop.

::: warning
Make sure to use a syncroneous function that returns the list of items to be displayed.
:::

If you need async data use a component that retrieves and renders the data.

<doc-example title="Generate Items on the Fly" file="QVirtualList/GenerateItems" />


### Tips
* If you need to specify the scroll target (because the auto detected one is not the desired one) pass a CSS selector (as string) or the DOM element in the `scroll-target` prop
* If you need to use the virtual list with the whole page as the scrolling element set  `scroll-target="body"`

::: warning
If you pass a custom scroll target container with `scroll-target` prop you must make sure that the element exists and that it can be overflowed (it must have a maximum height and an overflow that allows scrolling).

If the scroll target container cannot be overflowed you'll get the whole list rendered.
:::

## QVirtualList API
<doc-api file="QVirtualList" />
