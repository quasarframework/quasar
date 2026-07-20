---
title: Video
description: The QVideo Vue components makes embedding a video like Youtube easy. It also resizes to fit the container by default.
canonical: https://quasar.dev/vue-components/video
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QVideo](../../api/QVideo.md)

Using the QVideo component makes embedding a video like Youtube easy. It also resizes to fit the container by default.

::: tip
You may also want to check our own HTML 5 video player component: [QMediaPlayer](https://github.com/quasarframework/app-extension-qmediaplayer), which is far more advanced than QVideo (which essentially is an iframe pointing to embedded Youtube videos).
:::

**API reference:** [QVideo](../../api/QVideo.md)

## Usage

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QVideo/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-video src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" />
  </div>
</template>
````

### With aspect ratio

**Example: With aspect ratio**

Source: [Ratio.vue](../../examples/QVideo/Ratio.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-video
      :ratio="16 / 9"
      src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0"
    />
  </div>
</template>
````

### Markup equivalent

**Example: HTML markup**

Source: [HtmlMarkup.vue](../../examples/QVideo/HtmlMarkup.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-video">
      <iframe
        src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0"
        frameborder="0"
        allowfullscreen
      />
    </div>
  </div>
</template>
````
