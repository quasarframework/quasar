---
title: Virtual Scroll
desc: The QVirtualScroll component renders a big list of items as the user scrolls in the container, keeping DOM tree clean and eating the lowest amount of memory possible.
keys: QVirtualScroll
examples: QVirtualScroll
related:
  - /vue-components/intersection
  - /vue-components/infinite-scroll
---

The QVirtualScroll component allows you to display only a part of a long list of items and update the visible items as the user scrolls in the container. This has several advantages: only visible items are rendered, so the smallest number of nodes are in the DOM tree at any given point in time and the memory consumption is kept at its lowest.

There are currently two types of QVirtualScroll: "list" (using QItems) and "table" (using a tabular style to display rows of data).

<DocApi file="QVirtualScroll" />

## Usage

::: tip
* (Composition API) To get the best performance while using large lists, do not wrap the array that you are passing in the `items` prop with ref()/computed()/reactive()/etc. This allows Vue to skip making the list "responsive" to changes.
* (Options API) To get the best performance while using large lists, freeze the array that you are passing in the `items` prop using `Object.freeze(items)`. This allows Vue to skip making the list "responsive" to changes.
* The number of items that will be rendered will be calculated based on the `virtual-scroll-item-size` prop and the size of the scrollable area, but you can fit it to your needs using the `virtual-scroll-slice-size` prop.
* Use the `virtual-scroll-item-size` to specify the size of elements (pixels of height, or width if horizontal). After an element is rendered on screen its size is updated automatically, but if you specify an element size close to the real size you'll get a better initial indication of the scroll position. Regardless if you will be using this property or not, QVirtualScroll will still work, but without it you may experience the scrollbar not following the mouse grab position while continuously scrolling (on desktop) or the actual scroll of the container getting slightly off by one or two elements when on mobile and continuously scrolling.
:::

::: warning
There is a maximum height of the scrolling container, imposed by each browser. In IE11 this is around 1,000,000px, while in the rest of the browsers it's much more, but still limited.
:::

Scroll the examples below to see QVirtualScroll in action.

### Basic

<DocExample title="Basic" file="Basic" />

### Horizontal

<DocExample title="Horizontal" file="BasicHorizontal" />

### Different templates

<DocExample title="Different templates for items" file="VariousContent" />

<DocExample title="Different templates for horizontal items" file="VariousContentHorizontal" />

### Table type

Notice the `type="table"` property.

<DocExample title="Basic table" file="TableBasic" />


With header that scrolls along with content (doesn't stay in place).

<DocExample title="Table with scrolling header/footer" file="TableBasicHeader" />

Notice (in the example below) the CSS required to make the table header and footer "sticky". Also note the additional scoped slots which define the header and footer content.

<DocExample title="Sticky headers table" file="TableSticky" />

A more involved example below, playing with sticky headers and footers.

<DocExample title="Playing with sticky headers" file="TableSticky2" />

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

<DocExample title="Custom scroll target by id" file="ScrollTargetId" />

<DocExample title="Custom scroll target by ref" file="ScrollTargetRef" />

<DocExample title="Using QScrollArea" file="ScrollArea" />

### Scroll to position

<DocExample title="Scroll to position" file="ScrollTo" />

### Sync and async

You can also generate the items to be displayed on the list by using the `items-fn` prop.

::: warning
Make sure to use a synchronous function that returns the list of items to be displayed.
:::

If you need async data use a component that retrieves and renders the data.

<DocExample title="Generate items on the fly" file="GenerateItems" />

### Utility classes

There are two CSS classes that you can use (should you need to) to control VirtualScroll size calculation:
* Use `q-virtual-scroll--with-prev` class on an element rendered by the VirtualScroll to indicate the element should be grouped with the previous one (main use case is for multiple table rows generated from the same row of data).
* Use `q-virtual-scroll--skip` class on an element rendered by the VirtualScroll to indicate the element size should be ignored in size calculations.

<DocExample title="Virtual scroll with multiple rows for a data row" file="VirtscrollMultipleRows" />

<DocExample title="Virtual scroll with expansion model" file="VirtscrollExpandedRow" />
