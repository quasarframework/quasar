---
title: QImg
description: The QImg Vue component makes working with responsive images easy and also adds a nice loading effect to them along with many other features like custom aspect ratio and captions.
canonical: https://quasar.dev/vue-components/img
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QImg](../../api/QImg.md)

The QImg component makes working with images (any picture format) easy and also adds a nice loading effect to it along with many other features (example: the ability to set an aspect ratio).

**API reference:** [QImg](../../api/QImg.md)

## Usage

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QImg/Basic.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn push color="teal" label="Change image" @click="refresh" />

    <q-img
      :src="url"
      spinner-color="white"
      style="height: 140px; max-width: 150px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const url = ref('https://picsum.photos/500/300')

function refresh() {
  url.value = 'https://picsum.photos/500/300?t=' + Math.random()
}
</script>
````

### Aspect ratio

**Example: Custom aspect ratio**

Source: [Ratio.vue](../../examples/QImg/Ratio.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-col-gutter-md row items-start">
      <div class="col-4">
        Ratio: 16/9
        <q-img src="https://picsum.photos/500/300" :ratio="16 / 9" />
      </div>

      <div class="col-4">
        Ratio: 1
        <q-img src="https://picsum.photos/500/300" :ratio="1" />
      </div>

      <div class="col-4">
        Ratio: 4/3
        <q-img src="https://picsum.photos/500/300" :ratio="4 / 3" />
      </div>
    </div>
  </div>
</template>
````

### Captions

**Example: Captions**

Source: [Caption.vue](../../examples/QImg/Caption.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-col-gutter-md row items-start">
      <div class="col-6">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="absolute-bottom text-subtitle1 text-center">
            Caption
          </div>
        </q-img>
      </div>

      <div class="col-6">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="absolute-top text-center"> Caption </div>
        </q-img>
      </div>

      <div class="col-6">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="absolute-bottom-right text-subtitle2"> Caption </div>
        </q-img>
      </div>

      <div class="col-6">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="absolute-full text-subtitle2 flex flex-center">
            Caption
          </div>
        </q-img>
      </div>
    </div>
  </div>
</template>
````

### Image style

In the example below, we add a blur and sepia effect. Furthermore, we make use of the `rounded-borders` CSS helper class.

**Example: Custom image style**

Source: [CustomImageStyle.vue](../../examples/QImg/CustomImageStyle.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-img
      src="https://cdn.quasar.dev/img/parallax2.jpg"
      spinner-color="white"
      style="height: 170px; max-width: 300px"
      img-class="my-custom-image"
      class="rounded-borders"
    >
      <div class="absolute-bottom text-subtitle1 text-center"> Caption </div>
    </q-img>
  </div>
</template>

<style lang="sass">
.my-custom-image
  filter: blur(1px) sepia()
</style>
````

### Fit mode

There are multiple ways in which the image can be displayed through the `fit` property: 'cover', 'fill' (default), 'contain', 'none', 'scale-down'. It is basically the same thing as the CSS prop called [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit).

Some modes lead to empty space (horizontally or vertically) besides the image.

You can also configure the position through `position` property, which is equivalent to the CSS [object-position](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position) one. Its default value is "50% 50%".

**Example: Fit modes**

Source: [FitModes.vue](../../examples/QImg/FitModes.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-img
        v-for="mode in fitModes"
        :key="mode"
        src="https://picsum.photos/500/300"
        style="max-width: 300px; height: 150px"
        :fit="mode"
      >
        <div class="absolute-bottom text-subtitle1 text-center">
          {{ mode }}
        </div>
      </q-img>
    </div>
  </div>
</template>

<script setup>
const fitModes = ['cover', 'fill', 'contain', 'none', 'scale-down']
</script>
````

### Loading states

**Example: Loading state**

Source: [LoadingState.vue](../../examples/QImg/LoadingState.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn
      push
      color="teal"
      label="Change image"
      @click="refresh"
      class="q-mb-md"
    />

    <div class="q-gutter-sm row items-start">
      <q-img
        :src="url"
        spinner-color="red"
        style="height: 140px; max-width: 150px"
      />

      <q-img
        :src="url"
        spinner-color="primary"
        spinner-size="82px"
        style="height: 140px; max-width: 150px"
      />

      <q-img :src="url" style="height: 140px; max-width: 150px">
        <template v-slot:loading>
          <div class="text-subtitle1 text-white"> Loading... </div>
        </template>
      </q-img>

      <q-img :src="url" style="height: 140px; max-width: 150px">
        <template v-slot:loading>
          <q-spinner-gears color="white" />
        </template>
      </q-img>

      <q-img :src="url" style="height: 140px; max-width: 150px">
        <template v-slot:loading>
          <div class="text-yellow">
            <q-spinner-ios />
            <div class="q-mt-md">Loading...</div>
          </div>
        </template>
      </q-img>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const url = ref('https://picsum.photos/500/300')

function refresh() {
  url.value = 'https://picsum.photos/500/300?t=' + Math.random()
}
</script>
````

When you have big-sized images, you can use a placeholder image (recommended to be specified in base64 encoding) like in the example below. The placeholder will be displayed until the target image gets loaded. We're toggling the QImg tag so you can see the placeholder image in action.

**Example: Placeholder source**

Source: [PlaceholderSrc.vue](../../examples/QImg/PlaceholderSrc.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <q-btn push color="teal" label="Toggle" @click="toggle" />

    <!-- using v-if so you can see the effect -->
    <q-img
      v-if="url !== null"
      :src="url"
      :ratio="1"
      class="q-mt-md"
      style="width: 150px"
      placeholder-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg=="
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const url = ref(null)

function toggle() {
  url.value =
    url.value === null
      ? 'https://picsum.photos/500/300?t=' + Math.random()
      : null
}
</script>
````

**Example: Error state**

Source: [ErrorState.vue](../../examples/QImg/ErrorState.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-img
      src="https://cdn.quasar.dev/img/non-existent-image-src.png"
      style="height: 140px; max-width: 150px"
    >
      <template v-slot:error>
        <div class="absolute-full flex flex-center bg-negative text-white">
          Cannot load image
        </div>
      </template>
    </q-img>

    <q-img
      src="https://cdn.quasar.dev/img/non-existent-image-src.png"
      error-src="https://cdn.quasar.dev/logo-v2/header.png"
      style="height: 140px; max-width: 150px"
    >
      <template v-slot:error>
        <div class="absolute-full flex flex-center"> Error encountered </div>
      </template>
    </q-img>
  </div>
</template>
````

### Responsive

::: warning
To grasp the `sizes` and `srcset` properties, please read about native support on [responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Why_responsive_images) because **QImg relies on that entirely**.
:::

**Example: Responsive**

Source: [Responsive.vue](../../examples/QImg/Responsive.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-img
        src="https://cdn.quasar.dev/img/image-src.png"
        srcset="https://cdn.quasar.dev/img/image-1x.png 300w,
                https://cdn.quasar.dev/img/image-2x.png 2x,
                https://cdn.quasar.dev/img/image-3x.png 3x,
                https://cdn.quasar.dev/img/image-4x.png 4x"
        style="height: 280px; max-width: 300px"
      >
        <div class="absolute-bottom text-body1 text-center"> With srcset </div>
      </q-img>

      <q-img
        src="https://cdn.quasar.dev/img/image-src.png"
        srcset="https://cdn.quasar.dev/img/image-1x.png 400w,
                https://cdn.quasar.dev/img/image-2x.png 800w,
                https://cdn.quasar.dev/img/image-3x.png 1200w,
                https://cdn.quasar.dev/img/image-4x.png 1600w"
        sizes="(max-width: 400px) 400w,
              (min-width: 400px) and (max-width: 800px) 800w,
              (min-width: 800px) and (max-width: 1200px) 1200w,
              (min-width: 1200px) 1600w"
        style="height: 280px; max-width: 300px"
      >
        <div class="absolute-bottom text-body1 text-center">
          With srcset & sizes
        </div>
      </q-img>
    </div>
  </div>
</template>
````

::: tip
For `sizes` property, please read about Resolution Switching: [Different Sizes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Resolution_switching_Different_sizes).
:::

::: tip
For `srcset` property, please read about Resolution Switching: [Same size, different resolutions](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Resolution_switching_Same_size_different_resolutions).
:::

### Render on demand

For browsers that natively support the [loading="lazy" DOM attribute](https://caniuse.com/loading-lazy-attr) you can take advantage of it. Quasar will use it and tell the browser to request the image and render it only if the image is currently being displayed on screen (or when it is scrolled into the screen).

One alternative is to use the [QIntersection](/vue-components/intersection) component as a wrapper or [Intersection](/vue-directives/intersection) directive.

**Example: Native lazy loading**

Source: [LoadingLazy.vue](../../examples/QImg/LoadingLazy.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-sm">
    <q-img
      src="https://picsum.photos/500/300"
      loading="lazy"
      spinner-color="white"
      height="140px"
      style="max-width: 150px"
    />
  </div>
</template>
````

### No native context menu

In the example below we disable the native context menu on the images.

::: warning
When you are using this option always take care to have the content of the `default` or `error` slots wrapped in a `div` element, or add a `all-pointer-events` class on the element.
:::

**Example: Native context menu**

Source: [ContextMenu.vue](../../examples/QImg/ContextMenu.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-col-gutter-md row items-start">
      <div class="col-6">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" no-native-menu>
          <div class="absolute-bottom text-subtitle1 text-center">
            Caption
          </div>
        </q-img>
      </div>

      <div class="col-6">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" no-native-menu>
          <div class="absolute-top text-center"> Caption </div>
        </q-img>
      </div>

      <div class="col-6">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" no-native-menu>
          <div class="absolute-bottom-right text-subtitle2"> Caption </div>
        </q-img>
      </div>

      <div class="col-6">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" no-native-menu>
          <q-icon
            class="absolute all-pointer-events"
            size="32px"
            name="info"
            color="white"
            style="top: 8px; left: 8px"
          >
            <q-tooltip> Tooltip </q-tooltip>
          </q-icon>
        </q-img>
      </div>
    </div>
  </div>
</template>
````
