---
title: Layout Page
desc: How to use QPageContainer and QPage components. They define the contents of your Quasar app pages.
related:
  - /layout/layout
---

We will be talking about encapsulating pages within a QLayout. If you haven’t already, please read [QLayout](/layout/layout) documentation page first.

## QPageContainer API
<doc-api file="QPageContainer" />

## QPage API
<doc-api file="QPage" />

## Layout Builder
Scaffold your layout(s) by clicking on the button below.

<q-btn push color="brand-primary" icon-right="launch" label="Layout Builder" type="a" href="layout-builder" target="_blank" rel="noopener noreferrer" />

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

<doc-example title="Basic" file="QPage/Basic" />

### Style-fn
A QPage needs a QLayout because QLayout controls all the offsets of a page, keeping account of the space that header/footer/drawer use, according to its `view` property configuration. By default, your QPage component will have a `min-height` CSS property set on it to ensure that the content fills the screen at all times, even when the content is just a few lines.

If you wish to tweak, or even remove this property, you can do so by using the `style-fn` property:

```html
<template>
  <q-page :style-fn="myTweak">...</q-page>
</template>

<script>
export default {
  // ...
  methods: {
    myTweak (offset) {
      // "offset" is a Number (pixels) that refers to the total
      // height of header + footer that occupies on screen,
      // based on the QLayout "view" prop configuration

      // this is actually what the default style-fn does in Quasar
      return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' }
    }
  }
}
</script>
```
