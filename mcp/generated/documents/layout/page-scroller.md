---
title: Layout QPageScroller
description: How to use the QPageScroller component. Places components that will appear on screen after user scrolls the page.
canonical: https://quasar.dev/layout/page-scroller
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QPageScroller](../../api/QPageScroller.md)

The QPageScroller component helps in placing DOM elements / components wrapped by it into a static position within the content area of your QPage, no matter where the user scrolls.

The great advantage of this is that the elements wrapped by this component will never overlap the layout header, footer or drawer(s), even if those are not configured to be fixed. In the latter case, the position will be offset so that the overlap won't occur.
Try it out with a non-fixed footer for example. When user reaches bottom of screen and footer comes into view, the component will shift up so it won't overlap with the footer.

Essentially QPageScroller is very similar to QPageSticky. Whereas a QPageSticky component is always visible, a QPageScroller component only appears after a `scroll-offset` (property) is reached. Once visible, the user can click on it to quickly get back to the top of the page via `duration` property.

**API reference:** [QPageScroller](../../api/QPageScroller.md)

## Usage

::: tip
Since QPageScroller needs a layout and QLayout by default manages the entire window, then for demoing purposes we are going to use containerized QLayouts. But remember that by no means you are required to use containerized QLayouts for QPageScroller.
:::

::: warning

- In order for QPageScroller to work, it must be placed within a QLayout component.
- QPageScroller must be the last child element within its parent, so it can display on top of other content

:::

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QPageScroller/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-layout
      view="lHh Lpr lFf"
      container
      style="height: 400px"
      class="shadow-2 rounded-borders"
    >
      <q-header elevated>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          <q-toolbar-title> <strong>Quasar</strong> Framework </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding>
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil
            praesentium molestias a adipisci, dolore vitae odit, quidem
            consequatur optio voluptates asperiores pariatur eos numquam rerum
            delectus commodi perferendis voluptate?
          </p>

          <!-- place QPageScroller at end of page -->
          <q-page-scroller
            position="bottom-right"
            :scroll-offset="150"
            :offset="[18, 18]"
          >
            <q-btn fab icon="keyboard_arrow_up" color="accent" />
          </q-page-scroller>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
````

### Expanded

**Example: Expanded**

Source: [Expanded.vue](../../examples/QPageScroller/Expanded.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-layout
      view="lHh Lpr lFf"
      container
      style="height: 400px"
      class="shadow-2 rounded-borders"
    >
      <q-header elevated>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          <q-toolbar-title> <strong>Quasar</strong> Framework </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding>
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil
            praesentium molestias a adipisci, dolore vitae odit, quidem
            consequatur optio voluptates asperiores pariatur eos numquam rerum
            delectus commodi perferendis voluptate?
          </p>

          <!-- place QPageScroller at end of page -->
          <q-page-scroller
            expand
            position="top"
            :scroll-offset="150"
            :offset="[0, 0]"
          >
            <div
              class="col cursor-pointer q-pa-sm bg-accent text-white text-center"
            >
              Scroll back up...
            </div>
          </q-page-scroller>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
````

### Reverse

**Example: Reverse**

Source: [Reverse.vue](../../examples/QPageScroller/Reverse.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-layout
      view="lHh Lpr lFf"
      container
      style="height: 400px"
      class="shadow-2 rounded-borders"
    >
      <q-header elevated>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          <q-toolbar-title> <strong>Quasar</strong> Framework </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding>
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil
            praesentium molestias a adipisci, dolore vitae odit, quidem
            consequatur optio voluptates asperiores pariatur eos numquam rerum
            delectus commodi perferendis voluptate?
          </p>

          <!-- place QPageScroller at end of page -->
          <q-page-scroller
            reverse
            position="top"
            :scroll-offset="20"
            :offset="[0, 18]"
          >
            <q-btn fab icon="keyboard_arrow_down" color="accent" />
          </q-page-scroller>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
````
