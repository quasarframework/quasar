---
title: Morph Utils
desc: Morph one DOM element into another (with animation) or between two states of the same element using Quasar's morph util.
badge: "v1.13+"
related:
  - /vue-directives/morph
---

You can morph one DOM element into another (with animation) or between two states of the same element using Quasar's morph util described below.

Might also be worth to look at the [Morph directive](/vue-directives/morph) which uses this util but it's simpler to use.

## Basic usage

```js
import { morph } from 'quasar'

// Morph one DOM element to another:
const cancelMorph = morph({
  from: '#from-el',
  to: '#to-el'
})

// call cancelMorph() to cancel the morphing
```

The function expects one mandatory Object parameter with the following keys:

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| from | DOM | - | (**required**) A DOM element or CSS selector or a function returning a DOM element |
| to | DOM | - | Same as "from"; if "to" is missing, then it is assumes that it is the same as "from" |
| onToggle() | Function | - | A synchronous toggle function that will be executed immediately after the state of the initial element is saved. Use a function that toggles the state of the components so that the destination element becomes available. |
| waitFor | Number/'transitioned'/Promise | 0 | A number, 'transitionend' or a Promise - it will delay animation start for that number of milliseconds, or until a 'transitionend' event is emitted by the destination element, or until the promise is resolved (if the promise is rejected the morphing will abort, but the `toggle function` was already called) |
| duration | Number | 300 | The duration in milliseconds for the animation |
| easing | String | 'ease-in-out' | The timing function for the animation (CSS easing format) |
| delay | Number | 0 | The delay in milliseconds for the animation |
| fill | String | 'none' | The fill mode for the animation |
| style | String/Object | - | The extra style to be applied to the morphing element while it is animated (either as string or a CSSStyleDeclaration object) |
| classes | String | - | The extra classes to be applied to the morphing element while it is animated (as string) |
| resize | Boolean | *false* | Force resizing instead of the default scaling transformation |
| useCSS | Boolean | *false* | Force use of CSS instead of the Animation API |
| hideFromClone | Boolean | *false* | By default a clone of the initial element is used to fill the space after the element is removed - set this flag if the initial element is not removed or resizing of the space occupied by the initial element is not desired |
| keepToClone | Boolean | *false* | By default the final element is removed from it's final position to be animated - set this flag to keep a copy in the final position |
| tween | Boolean | *false* | By default the final element is morphed from the position and aspect of the initial element to the ones of the final element - set this flag to use an opacity tween between the initial and final elements |
| tweenFromOpacity | Number | 0.6 | If using **tween** it is the initial opacity of the initial element (will be animated to 0) - the initial element is placed on top of the destination element |
| tweenToOpacity | Number | 0.5 | If using **tween** it is the initial opacity of the destination element (will be animated to 1) |
| onEnd(direction, aborted) | Function | - | A function that will be called once the morphing is finalized - receives two params: "direction" is a string ('to' if the morphing was finished in the final state or 'from' if it was finished in the initial state) and "aborted" is a boolean (true means that the animation was aborted) |

## Morphing lifecycle

1. Get the aspect and position of the initial element (if a function is provided for getting the initial element it will be called)
2. Calculate the size and position of the container of the initial element
3. If another morphing was using the same element that morphing will be aborted
4. Execute the onToggle() function (if present)
5. Recalculate the size and position of the container of the initial element to check if they are changed
6. In the next tick (to allow Vue to process the state changes) the final element will be identified (if a function is provided for getting the final element it will be called)
7. If another morphing was using the same element that morphing will be aborted
8. Calculate the size and position of the container of the final element
9. If a **waitFor** is provided, wait that number of milliseconds, for a 'transitionend' event or until the promise is resolved (if the promise is rejected then the morphing is aborted)
10. Recalculate the size and position of the container of the final element to check if they are changed
11. Get the aspect and position of the final element
12. Start the animation

Regarding the cancel() function (the return value of a call to morph()):
* If the `cancel` function that was returned is called during steps 1 to 11 then the morphing will be aborted (the `toggle function` will still be called if the cancel comes after step 4) and the returned value will be **false**.
* If the `cancel` function is called between the start and end of the animation then the animation will be reversed and the returned value will be **true**.
* If the `cancel` function is called after the end of the animation nothing will happen and the returned value will be **false**.

## Examples

<doc-example title="Morphing the same element" file="MorphUtils/SameElement" />

<doc-example title="Morphing a QCard from a QFabAction" file="MorphUtils/FabCard" />

<doc-example title="Image gallery " file="MorphUtils/ImageGallery" />

<doc-example title="Horizontal image strip " file="MorphUtils/ImageStripHorizontal" />

<doc-example title="Vertical image strip " file="MorphUtils/ImageStripVertical" />
