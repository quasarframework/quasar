---
title: Scrolling Utils
desc: A set of Quasar methods related to scrolling, like getting scroll target or changing the scroll position of a page.
---

::: tip
For usage with the UMD build see [here](/start/umd#quasar-global-object).
:::

## Determine scrolling container
Might be worthwhile to read how this is done [here](/vue-components/scroll-observer#determining-scrolling-container).

```js
import { scroll } from 'quasar'
const { getScrollTarget } = scroll

// Get parent DomNode that handles page scrolling
// Usually this is element with classname ".layout-view" or "window"
(DOM Element) getScrollTarget(DomElement)
```

This method searches for a parent DOM element which has one of the `scroll` or `overflow-auto` Quasar CSS Helper class attached to it. If none is found, then it considers that the scrolling takes place on the document itself.

Please note that simply attaching `scroll` CSS class to a DOM element or on a Vue component will have no effect if the respective element is not overflowed (example, with: CSS `overflow: hidden` and a height smaller than its inner content height).

Example of good container:

```html
<!--
  Quasar CSS helper 'overflow-hidden' is
  equivalent to style="overflow: hidden"
-->
<div class="scroll overflow-hidden" style="height: 100px">
  ...content expanding over the 100px height from container...
</div>
```

## Get/set scroll position
Vertically:

```js
import { scroll } from 'quasar'
const { getScrollPosition, setScrollPosition } = scroll

// Get scroll position of a element or page.
// Use it in conjunction with `getScrollTarget()`
(Number pixels) getScrollPosition(scrollTargetDomElement)

// Setting scroll position of an element or page:
setScrollPosition (scrollTargetElement, offset[, duration])
// if "duration" is specified then it will animate the scrolling
```

Horizontally:

```js
import { scroll } from 'quasar'
const { getHorizontalScrollPosition, setHorizontalScrollPosition } = scroll

// Get scroll position of a element or page.
// Use it in conjunction with `getScrollTarget()`
(Number pixels) getHorizontalScrollPosition(scrollTargetDomElement)

// Setting scroll position of an element or page:
setHorizontalScrollPosition (scrollTargetElement, offset[, duration])
// if "duration" is specified then it will animate the scrolling
```

### Scrolling to an element
Below is an example using the scroll utils to scroll to an element within its container. It does not take into consideration if the container is on screen or more complex cases.

```js
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll

// takes an element object
function scrollToElement (el) {
  const target = getScrollTarget(el)
  const offset = el.offsetTop
  const duration = 1000
  setScrollPosition(target, offset, duration)
}
```

## Determine scroll size
Vertically:

```js
import { scroll } from 'quasar'
const { getScrollHeight } = scroll

// get scrolling container inner height
(Number) getScrollHeight(scrollTargetDomElement)

console.log( getScrollHeight(el) )
// 824 (it's in pixels always)
```

Horizontally:

```js
import { scroll } from 'quasar'
const { getScrollWidth } = scroll

// get scrolling container inner height
(Number) getScrollWidth(scrollTargetDomElement)

console.log( getScrollWidth(el) )
// 824 (it's in pixels always)
```

## Determining scrollbar width
Computes the width of scrollbar in pixels.

``` js
import { scroll } from 'quasar'
const { getScrollbarWidth } = scroll

console.log(getScrollbarWidth()) // 16 (it's in pixels)
```
