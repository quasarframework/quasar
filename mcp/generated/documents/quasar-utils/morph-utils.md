---
title: Morph Utils
description: Morph one DOM element into another (with animation) or between two states of the same element using Quasar's morph util.
canonical: https://quasar.dev/quasar-utils/morph-utils
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

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

| Name                      | Type                          | Default value | Description                                                                                                                                                                                                                                                                                                         |
| ------------------------- | ----------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| from                      | DOM                           | -             | (**required**) A DOM element or CSS selector or a function returning a DOM element                                                                                                                                                                                                                                  |
| to                        | DOM                           | -             | Same as "from"; if "to" is missing, then it is assumes that it is the same as "from"                                                                                                                                                                                                                                |
| onToggle()                | Function                      | -             | A synchronous toggle function that will be executed immediately after the state of the initial element is saved. Use a function that toggles the state of the components so that the destination element becomes available.                                                                                         |
| waitFor                   | Number/'transitioned'/Promise | 0             | A number, 'transitionend' or a Promise - it will delay animation start for that number of milliseconds, or until a 'transitionend' event is emitted by the destination element, or until the promise is resolved (if the promise is rejected the morphing will abort, but the `toggle function` was already called) |
| duration                  | Number                        | 300           | The duration in milliseconds for the animation                                                                                                                                                                                                                                                                      |
| easing                    | String                        | 'ease-in-out' | The timing function for the animation (CSS easing format)                                                                                                                                                                                                                                                           |
| delay                     | Number                        | 0             | The delay in milliseconds for the animation                                                                                                                                                                                                                                                                         |
| fill                      | String                        | 'none'        | The fill mode for the animation                                                                                                                                                                                                                                                                                     |
| style                     | String/Object                 | -             | The extra style to be applied to the morphing element while it is animated (either as string or a CSSStyleDeclaration object)                                                                                                                                                                                       |
| classes                   | String                        | -             | The extra classes to be applied to the morphing element while it is animated (as string)                                                                                                                                                                                                                            |
| resize                    | Boolean                       | _false_       | Force resizing instead of the default scaling transformation                                                                                                                                                                                                                                                        |
| useCSS                    | Boolean                       | _false_       | Force use of CSS instead of the Animation API                                                                                                                                                                                                                                                                       |
| hideFromClone             | Boolean                       | _false_       | By default a clone of the initial element is used to fill the space after the element is removed - set this flag if the initial element is not removed or resizing of the space occupied by the initial element is not desired                                                                                      |
| keepToClone               | Boolean                       | _false_       | By default the final element is removed from it's final position to be animated - set this flag to keep a copy in the final position                                                                                                                                                                                |
| tween                     | Boolean                       | _false_       | By default the final element is morphed from the position and aspect of the initial element to the ones of the final element - set this flag to use an opacity tween between the initial and final elements                                                                                                         |
| tweenFromOpacity          | Number                        | 0.6           | If using **tween** it is the initial opacity of the initial element (will be animated to 0) - the initial element is placed on top of the destination element                                                                                                                                                       |
| tweenToOpacity            | Number                        | 0.5           | If using **tween** it is the initial opacity of the destination element (will be animated to 1)                                                                                                                                                                                                                     |
| onEnd(direction, aborted) | Function                      | -             | A function that will be called once the morphing is finalized - receives two params: "direction" is a string ('to' if the morphing was finished in the final state or 'from' if it was finished in the initial state) and "aborted" is a boolean (true means that the animation was aborted)                        |

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

- If the `cancel` function that was returned is called during steps 1 to 11 then the morphing will be aborted (the `toggle function` will still be called if the cancel comes after step 4) and the returned value will be **false**.
- If the `cancel` function is called between the start and end of the animation then the animation will be reversed and the returned value will be **true**.
- If the `cancel` function is called after the end of the animation nothing will happen and the returned value will be **false**.

## Examples

**Example: Morphing the same element**

Source: [SameElement.vue](../../examples/MorphUtils/SameElement.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-y-md">
    <div class="row no-wrap q-gutter-x-lg items-center relative-position">
      <q-btn
        color="primary"
        no-wrap
        label="Morph element"
        @click="morphContent1"
      />

      <div ref="firstMorphRef" v-bind="props1">
        {{ toggle1 ? 'Small' : 'Large' }}
      </div>
    </div>

    <div
      class="row no-wrap q-gutter-x-lg items-center relative-position"
      :class="{ 'justify-between': toggle2 }"
    >
      <q-btn
        color="primary"
        no-wrap
        label="Morph element"
        @click="morphContent2"
      />

      <q-avatar
        ref="secondMorphRef"
        text-color="white"
        size="100px"
        v-bind="props2"
      />
    </div>
  </div>
</template>

<script setup>
import { morph } from 'quasar'
import { computed, ref, useTemplateRef } from 'vue'

const toggle1 = ref(false)
const toggle2 = ref(false)

const firstMorphRef = useTemplateRef('firstMorphRef')
const secondMorphRef = useTemplateRef('secondMorphRef')

let cancel1, cancel2

const props1 = computed(() =>
  toggle1.value
    ? {
        class: 'q-ml-sm q-pa-md bg-orange text-white rounded-borders',
        style: 'font-size: 24px'
      }
    : {
        class: 'q-ml-xl q-px-xl q-py-lg bg-blue text-white',
        style: 'border-radius: 25% 0/50% 0; font-size: 36px'
      }
)

const props2 = computed(() =>
  toggle2.value
    ? {
        fontSize: '52px',
        color: 'positive',
        icon: 'check',
        rounded: true
      }
    : {
        fontSize: '32px',
        color: 'negative',
        icon: 'close'
      }
)

function morphContent1() {
  const onToggle = () => {
    toggle1.value = !toggle1.value
  }

  if (cancel1 === void 0 || cancel1() === false) {
    cancel1 = morph({
      from: firstMorphRef.value,
      onToggle,
      duration: 500,
      tween: true,
      onEnd: end => {
        if (end === 'from') onToggle()
      }
    })
  }
}

function morphContent2() {
  const onToggle = () => {
    toggle2.value = !toggle2.value
  }

  if (cancel2 === void 0 || cancel2() === false) {
    cancel2 = morph({
      from: secondMorphRef.value.$el,
      onToggle,
      duration: 500,
      tween: true,
      tweenFromOpacity: 0.8,
      tweenToOpacity: 0.4,
      onEnd: end => {
        if (end === 'from') onToggle()
      }
    })
  }
}
</script>
````

**Example: Morphing a QCard from a QFabAction**

Source: [FabCard.vue](../../examples/MorphUtils/FabCard.vue)

````vue
<template>
  <div class="q-pa-md relative-position" style="min-height: 300px">
    <div class="absolute-bottom-right q-ma-lg">
      <div
        ref="fabRef"
        class="absolute-center bg-accent"
        style="border-radius: 50%; width: 50%; height: 50%"
      />

      <q-fab
        direction="up"
        icon="add"
        color="accent"
        @update:model-value="val => val && morphState(false)"
      >
        <q-fab-action color="primary" @click="morphState(true)" icon="alarm" />
      </q-fab>
    </div>

    <q-card
      v-if="toggle"
      ref="cardRef"
      class="my-card text-white absolute-center bg-grey-10"
      @click="morphState(false)"
    >
      <q-card-section>
        <div class="text-h6">Our Changing Planet</div>
        <div class="text-subtitle2">by John Doe</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ lorem }}
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { morph } from 'quasar'
import { ref, useTemplateRef } from 'vue'

const toggle = ref(false)
const fabRef = useTemplateRef('fabRef')
const cardRef = useTemplateRef('cardRef')

const getFab = () => fabRef.value
const getCard = () => cardRef.value?.$el

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

function morphState(state) {
  if (state === toggle.value) return

  morph({
    from: toggle.value ? getCard : getFab,
    to: toggle.value ? getFab : getCard,
    onToggle: () => {
      toggle.value = state
    },
    duration: 500
  })
}
</script>
````

**Example: Image gallery **

Source: [ImageGallery.vue](../../examples/MorphUtils/ImageGallery.vue)

````vue
<template>
  <div class="q-pa-md">
    <div
      class="fixed-full image-gallery__blinder bg-grey-8"
      :class="
        indexZoomed !== void 0 ? 'image-gallery__blinder--active' : void 0
      "
      @click="zoomImage()"
    />

    <div
      class="row justify-center q-gutter-sm q-mx-auto scroll relative-position"
      style="max-width: 80vw; max-height: 80vh"
    >
      <q-img
        v-for="(src, index) in images"
        :key="index"
        ref="thumbRefs"
        class="image-gallery__image"
        :style="index === indexZoomed ? 'opacity: 0.3' : void 0"
        :src="src"
        @click="zoomImage(index)"
      />
    </div>

    <q-img
      ref="fullRef"
      class="image-gallery__image image-gallery__image-full fixed-center"
      :class="
        indexZoomed !== void 0 ? 'image-gallery__image-full--active' : void 0
      "
      :src="images[indexZoomed]"
      @load="imgLoadedResolve"
      @error="imgLoadedReject"
      @click="zoomImage()"
    />
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { morph } from 'quasar'

const thumbRefs = useTemplateRef('thumbRefs')
const fullRef = useTemplateRef('fullRef')

const indexZoomed = ref(void 0)
const images = ref(
  Array.from(
    { length: 24 },
    (_, i) => 'https://picsum.photos/id/' + i + '/500/300'
  )
)
const imgLoaded = {
  promise: Promise.resolve(),
  resolve: () => {},
  reject: () => {}
}

function imgLoadedResolve() {
  imgLoaded.resolve()
}

function imgLoadedReject() {
  imgLoaded.reject()
}

function zoomImage(index) {
  const indexZoomedState = indexZoomed.value
  let cancel = void 0

  imgLoaded.reject()

  const zoom = () => {
    if (index !== void 0 && index !== indexZoomedState) {
      imgLoaded.promise = new Promise((resolve, reject) => {
        imgLoaded.resolve = () => {
          imgLoaded.resolve = () => {}
          imgLoaded.reject = () => {}

          resolve()
        }
        imgLoaded.reject = () => {
          imgLoaded.resolve = () => {}
          imgLoaded.reject = () => {}

          reject(new Error('Error loading image'))
        }
      })

      cancel = morph({
        from: thumbRefs.value[index].$el,
        to: fullRef.value.$el,
        onToggle: () => {
          indexZoomed.value = index
        },
        waitFor: imgLoaded.promise,
        duration: 400,
        hideFromClone: true,
        onEnd: end => {
          if (end === 'from' && indexZoomed.value === index) {
            indexZoomed.value = void 0
          }
        }
      })
    }
  }

  if (
    indexZoomedState !== void 0 &&
    (cancel === void 0 || cancel() === false)
  ) {
    morph({
      from: fullRef.value.$el,
      to: thumbRefs.value[indexZoomedState].$el,
      onToggle: () => {
        indexZoomed.value = void 0
      },
      duration: 200,
      keepToClone: true,
      onEnd: zoom
    })
  } else {
    zoom()
  }
}
</script>

<style lang="sass">
.image-gallery
  &__image
    border-radius: 3%/5%
    width: 150px
    max-width: 20vw
    cursor: pointer

    &-full
      width: 800px
      max-width: 70vw
      z-index: 2002
      pointer-events: none

      &--active
        pointer-events: all
  &__blinder
    opacity: 0
    z-index: 2000
    pointer-events: none
    transition: opacity 0.3s ease-in-out

    &--active
      opacity: 0.6
      pointer-events: all

      + div > .image-gallery__image
        z-index: 2001
</style>
````

**Example: Horizontal image strip **

Source: [ImageStripHorizontal.vue](../../examples/MorphUtils/ImageStripHorizontal.vue)

````vue
<template>
  <div class="q-pa-md">
    <div
      class="row no-wrap q-gutter-x-sm"
      style="overflow-x: auto; overflow-y: visible"
    >
      <q-img
        v-for="(src, index) in images"
        :key="index"
        ref="thumbRefs"
        class="cursor-pointer"
        :class="
          index === indexZoomed ? 'fixed-top q-mt-md q-mx-auto z-top' : void 0
        "
        style="border-radius: 3%/5%; flex: 0 0 10vw"
        :style="
          index === indexZoomed ? 'width: 800px; max-width: 70vw' : void 0
        "
        :src="src"
        @click="zoomImage(index)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { morph } from 'quasar'

const thumbRefs = useTemplateRef('thumbRefs')
const indexZoomed = ref(void 0)
const images = ref(
  Array.from(
    { length: 24 },
    (_, i) => 'https://picsum.photos/id/' + i + '/500/300'
  )
)

function zoomImage(index) {
  const indexZoomedState = indexZoomed.value
  let cancel = void 0

  indexZoomed.value = void 0

  if (index !== void 0 && index !== indexZoomedState) {
    cancel = morph({
      from: thumbRefs.value[index].$el,
      onToggle: () => {
        indexZoomed.value = index
      },
      duration: 500,
      onEnd: end => {
        if (end === 'from' && indexZoomed.value === index) {
          indexZoomed.value = void 0
        }
      }
    })
  }

  if (
    indexZoomedState !== void 0 &&
    (cancel === void 0 || cancel() === false)
  ) {
    morph({
      from: thumbRefs.value[indexZoomedState].$el,
      waitFor: 100,
      duration: 300
    })
  }
}
</script>
````

**Example: Vertical image strip **

Source: [ImageStripVertical.vue](../../examples/MorphUtils/ImageStripVertical.vue)

````vue
<template>
  <div class="q-pa-md">
    <div
      class="q-gutter-y-sm"
      style="
        overflow-x: visible;
        overflow-y: auto;
        width: 300px;
        max-width: 20vw;
        max-height: 80vh;
      "
    >
      <q-img
        v-for="(src, index) in images"
        :key="index"
        ref="thumbRefs"
        class="cursor-pointer"
        :class="
          index === indexZoomed
            ? 'fixed-top-right q-mr-md q-mt-md z-top'
            : void 0
        "
        style="border-radius: 3%/5%"
        :style="
          index === indexZoomed ? 'width: 800px; max-width: 70vw;' : void 0
        "
        :src="src"
        @click="zoomImage(index)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { morph } from 'quasar'

const thumbRefs = useTemplateRef('thumbRefs')

const indexZoomed = ref(void 0)
const images = ref(
  Array.from(
    { length: 24 },
    (_, i) => 'https://picsum.photos/id/' + i + '/500/300'
  )
)

function zoomImage(index) {
  const indexZoomedState = indexZoomed.value
  let cancel = void 0

  indexZoomed.value = void 0

  if (index !== void 0 && index !== indexZoomedState) {
    cancel = morph({
      from: thumbRefs.value[index].$el,
      onToggle: () => {
        indexZoomed.value = index
      },
      duration: 500,
      onEnd: end => {
        if (end === 'from' && indexZoomed.value === index) {
          indexZoomed.value = void 0
        }
      }
    })
  }

  if (
    indexZoomedState !== void 0 &&
    (cancel === void 0 || cancel() === false)
  ) {
    morph({
      from: thumbRefs.value[indexZoomedState].$el,
      waitFor: 100,
      duration: 300
    })
  }
}
</script>
````
