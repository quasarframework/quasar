---
title: DOM Utils
desc: A set of Quasar methods for DOM elements which helps you in retrieving the offset on screen viewport, getting and setting styles, waiting for the DOM to be ready and morphing DOM elements.
related:
  - /vue-directives/morph
---

### Helping Tree-Shake
You will notice all examples import different parts of Quasar. However, if you need only one specific util method, then you can use ES6 destructuring to help Tree Shaking embed only that method and not all around it.

Example with `dom` utils:
```js
import { dom } from 'quasar'
const { offset } = dom

// Offset on screen
console.log(offset(DomElement))
// { top: 10, left: 100 }
```

You can also import all of dom utils and use whatever you need like this (but note that your bundle will contain unused methods too):
```js
import { dom } from 'quasar'

// Offset on screen
console.log(dom.offset(DomElement))
// { top: 10, left: 100 }
```

::: tip
For usage with the UMD build see [here](/start/umd#Quasar-Global-Object).
:::

## Offset on screen viewport
``` js
import { dom } from 'quasar'
const { offset } = dom

// Offset on screen
console.log(offset(DomElement))
// { top: 10, left: 100 }
```

## Get Computed Style
This applies only when DomElement is visible! It returns the **computed** browser style, so the property you are asking for doesn't necessary has to be applied within a `style` attribute.

``` js
import { dom } from 'quasar'
const { style } = dom

// Get COMPUTED style (when DomElement is visible!)
// Computed means a DomElement might not have "height" CSS property set,
// but that does not mean it doesn't have a height when it's displayed.
// The following method accesses the computed CSS provided by the browser:
console.log(style(DomElement, 'height'))
// '10px' <<< notice it returns a String ending in 'px'
```

## Get Height / Width
``` js
import { dom } from 'quasar'
const { height, width } = dom


// Some aliases of the previous method for "width" and "height" which
// returns Numbers instead of Strings:
console.log(
  height(DomElement),
  width(DomElement)
)
// 10 100
```

## Apply CSS Properties in Batch
```js
import { dom } from 'quasar'
const { css } = dom

// Apply a list of CSS properties to a DomNode
css(DomElement, {
  height: '10px',
  display: 'flex'
})
```

## Execute when DOM is ready
```js
import { dom } from 'quasar'
const { ready } = dom

// Execute a Function when DOM is ready:
ready(function () {
  // ....
})
```

## Morphing DOM elements
Creates a morph animation between two DOM elements or between two states of the same element.

The function expects one mandatory parameter and two optional one and returns a function to cancel (revert) the morph.
- The first parameter (mandatory) must supply the elements the morph should refer to, in one of the following formats:
  - a single element (it will be used as both initial and final element), described as:
    - a DOM element
    - a CSS selector as string
    - a function returning a DOM element
  - an object having both **from** and **to** keys, each holding an element as described above
- The second parameter (optional) is a synchronous `toggle function` that will be executed immediately after the state of the initial element is saved.
  Use a function that toggles the state of the components so that the final element becomes available.
- The third parameter (optional) is the configuration user for morphing, It can be any of the following:
  - a number that will be used as the morphing duration
  - a function that will be used called when the morphing is finished
  - an object, with the following available options:
    - **waitFor** (default *0*) - a number, 'transitionend' or a Promise - it will delay animation start for that number of milliseconds, or until a 'transitionend' event is emitted by the destination element, or until the promise is resolved (if the promise is rejected the morphing will abort, but the `toggle function` was already called)
    - **duration** (default *300*) - the duration in milliseconds for the animation
    - **easing** (default *'ease-in-out'*) - the timing function for the animation
    - **delay** (default *0*) - the delay in milliseconds for the animation
    - **fill** (default *'none'*) - the fill mode for the animation
    - **style** - the extra style to be applied to the morphing element while it is animated (either as string or a CSSStyleDeclaration object)
    - **class** - the extra classes to be applied to the morphing element while it is animated (as string)
    - **forceResize** (default *false*) - by default the animation is using scale transform - set this flag to use resizing
    - **forceCssAnimation** (default *false*) - by default the animation is implemented using the Animation API (if available) - set this flag to use CSS animations
    - **hideFromClone** (default *false*) - by default a clone of the initial element is used to fill the space after the element is removed - set this flag if the initial element is not removed or resizing of the space occupied by the initial element is not desired
    - **keepToClone** (default *false*) - by default the final element is removed from it's final position to be animated - set this flag to keep a copy in the final position
    - **tween** (default *false*) - by default the final element is morphed from the position and aspect of the initial element to the ones of the final element - set this flag to use an opacity tween between the initial and final elements
    - **tweenFromOpacity** (default *0.6*) - if using **tween** it is the initial opacity of the initial element (will be animated to 0) - the initial element is placed on top of the final element
    - **tweenToOpacity** (default *0.5*) - if using **tween** it is the initial opacity of the final element (will be animated to 1)
    - **onReady** - a function that will be called once the morphing is finished - receives a single string parameter ('to' if the morphing was finished in the final state or 'from' if it was finished in the initial state)

The lifecycle of the morphing is:
1. get the aspect and position of the initial element (if a function is provided for getting the initial element it will be called)
2. calculate the size and position of the container of the initial element
3. if another morphing was using the same element that morphing will be aborted
4. execute the `toggle function`
5. recalculate the size and position of the container of the initial element to check if they are changed
6. in the next tick (to allow Vue to process the state changes) the final element will be identified (if a function is provided for getting the final element it will be called)
7. if another morphing was using the same element that morphing will be aborted
8. calculate the size and position of the container of the final element
9. if a **waitFor** is provided, wait that number of milliseconds, for a 'transitionend' event or until the promise is resolved (if the promise is rejected then the morphing is aborted)
10. recalculate the size and position of the container of the final element to check if they are changed
11. get the aspect and position of the final element
12. start the animation

If the `cancel` function that was returned is called during steps 1 to 11 then the morphing will be aborted (the `toggle function` will still be called if the cancel comes after step 4) and the returned value will be **false**.
If the `cancel` function is called between the start and end of the animation then the animation will be reversed and the returned value will be **true**.
If the `cancel` function is called after the end of the animation nothing will happen and the returned value will be **false**.

```js
import { dom } from 'quasar'
const { morph } = dom

// Morph one DOM element to another:
morph({
  from: '#from-el',
  to: '#to-el'
})
```

<doc-example title="Morphing the same element" file="DomMorph/SameElement" />

<doc-example title="Morphing a QCard from a QFabAction" file="DomMorph/FabCard" />

<doc-example title="Image gallery " file="DomMorph/ImageGallery" />

<doc-example title="Horizontal image strip " file="DomMorph/ImageStripHorizontal" />

<doc-example title="Vertical image strip " file="DomMorph/ImageStripVertical" />
