---
title: Parallax
description: The QParallax Vue component makes it easy to embed a parallax scrolling effect into a page.
canonical: https://quasar.dev/vue-components/parallax
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QParallax](../../api/QParallax.md)

Parallax scrolling is a technique in computer graphics and web design, where background images move by the camera slower than foreground images, creating an illusion of depth in a 2D scene and adding to the immersion.

QParallax takes care of a lot of quirks, including image/video size which can actually be smaller than the window width/height.

**API reference:** [QParallax](../../api/QParallax.md)

## Usage

::: tip Scrolling container
Please read [here](/vue-components/scroll-observer#determining-scrolling-container) about how Quasar determines the container to attach scrolling events to.
:::

### Image background

**Example: Image background**

Source: [Image.vue](../../examples/QParallax/Image.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-between">
      <q-parallax src="https://cdn.quasar.dev/img/parallax2.jpg">
        <h1 class="text-white">Basic</h1>
      </q-parallax>
    </div>
  </div>
</template>
````

### Video background

::: warning
On some iOS platforms there may be problems regarding the autoplay feature of the native `<video>` tag. [Reference](https://webkit.org/blog/6784/new-video-policies-for-ios/). QParallax and Quasar are not interfering in any way with the client browser's ability/restrictions on the `<video>` tag.
:::

::: warning
When using the `video` tag inside QParallax, you **must** provide the `width` and `height` attributes in order for QParallax to work properly because of the intrinsic resizing capabilities of this type of media. Also, be aware that the actual video width and height are not available until the video's metadata has been loaded.
:::

**Example: Custom height with video background**

Source: [Video.vue](../../examples/QParallax/Video.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-parallax :height="150">
      <template v-slot:media>
        <video
          width="720"
          height="440"
          poster="https://cdn.quasar.dev/img/polina.jpg"
          autoplay
          loop
          muted
        >
          <source
            type="video/webm"
            src="https://cdn.quasar.dev/img/polina.webm"
          />
          <source
            type="video/mp4"
            src="https://cdn.quasar.dev/img/polina.mp4"
          />
        </video>
      </template>

      <h3 class="text-white">Video</h3>
    </q-parallax>
  </div>
</template>
````

### Custom speed

**Example: Custom speed**

Source: [Speed.vue](../../examples/QParallax/Speed.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-parallax :height="200" :speed="0.5">
      <template v-slot:media>
        <img src="https://cdn.quasar.dev/img/parallax1.jpg" />
      </template>

      <h1 class="text-white">Docks</h1>
    </q-parallax>
  </div>
</template>
````

### Using slot

**Example: Using the slot**

Source: [ScopedSlot.vue](../../examples/QParallax/ScopedSlot.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-parallax>
      <template v-slot:media>
        <img src="https://cdn.quasar.dev/img/parallax2.jpg" />
      </template>

      <template v-slot:content="scope">
        <div
          class="absolute column items-center"
          :style="{
            opacity: 0.45 + (1 - scope.percentScrolled) * 0.55,
            top: scope.percentScrolled * 60 + '%',
            left: 0,
            right: 0
          }"
        >
          <img
            src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg"
            style="width: 150px; height: 150px"
          />
          <div class="text-h3 text-white text-center">Quasar Framework</div>
          <div class="text-h6 text-grey-3 text-center"> v{{ $q.version }} </div>
        </div>
      </template>
    </q-parallax>
  </div>
</template>
````
