---
title: Layout Page
description: How to use QPageContainer and QPage components. They define the contents of your Quasar app pages.
canonical: https://quasar.dev/layout/page
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QPage](../../api/QPage.md)
- [QPageContainer](../../api/QPageContainer.md)

We will be talking about encapsulating pages within a QLayout. If you haven’t already, please read [QLayout](/layout/layout) documentation page first.

**API reference:** [QPageContainer](../../api/QPageContainer.md)

**API reference:** [QPage](../../api/QPage.md)

## Layout Builder

Scaffold your layout(s) by clicking on the button below.

<q-btn icon-right="launch" label="Layout Builder" href="/layout-builder" target="_blank" />

## Usage

A QPage must be encapsulated by QPageContainer, which in turn must be a child of QLayout.

```html
<q-layout>
  ...
  <q-page-container>
    <q-page>
      <!-- page content -->
    </q-page>
  </q-page-container>
  ...
</q-layout>
```

Usually, the QPageContainer is part of the Layout template (where it contains a `<router-view />` child only), and its content goes into separate vue files under `/src/pages`. If you haven't already, please read [Routing with Layouts and Pages](/layout/routing-with-layouts-and-pages).

```html
<!-- vue file for Layout: -->
<q-layout>
  ...
  <q-page-container>
    <router-view />
  </q-page-container>
  ...
</q-layout>

<!-- vue file for a Page: -->
<q-page padding>
  <!-- page content -->
</q-page>
```

### Example

::: tip
Since QPageContainer and QPage need a layout and QLayout by default manages the entire window, then for demoing purposes we are going to use containerized QLayouts. But remember that by no means you are required to use containerized QLayouts for QPageContainer and QPage.
:::

**Example: Basic**

Source: [Basic.vue](../../examples/QPage/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-layout
      view="lHh lpr lFf"
      container
      style="height: 400px"
      class="shadow-2 rounded-borders"
    >
      <q-header elevated>
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>

          <q-toolbar-title> Quasar Framework </q-toolbar-title>

          <q-btn flat round dense icon="whatshot" />
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
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
````

### Style-fn

A QPage needs a QLayout because QLayout controls all the offsets of a page, keeping account of the space that header/footer/drawer use, according to its `view` property configuration. By default, your QPage component will have a `min-height` CSS property set on it to ensure that the content fills the screen at all times, even when the content is just a few lines.

If you wish to tweak, or even remove this property, you can do so by using the `style-fn` property:

```html
<template>
  <q-page :style-fn="myTweak">...</q-page>
</template>

<script setup>
  function myTweak(offset) {
    // "offset" is a Number (pixels) that refers to the total
    // height of header + footer that occupies on screen,
    // based on the QLayout "view" prop configuration

    // this is actually what the default style-fn does in Quasar
    return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' }
  }
</script>
```
