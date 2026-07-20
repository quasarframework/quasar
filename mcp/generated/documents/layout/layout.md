---
title: Layout
description: How to use the QLayout component. Manages the whole window of your Quasar app.
canonical: https://quasar.dev/layout/layout
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QLayout](../../api/QLayout.md)

The QLayout is a component designed to manage the entire window and wrap page content with elements such as a navigational bar or a drawer. Multiple pages can share the same QLayout, so the code is reusable, which is one of their key points.

**QLayout is NOT mandatory**, but it does help you to better structure your website/app. It has a number of features which offer you major benefits in simplifying your website/app's layout design, right out of the box.

**API reference:** [QLayout](../../api/QLayout.md)

## Layout Builder

Scaffold your layout(s) by clicking on the button below.

::: tip
Keep an eye on your developer console for handy helpers on which components are being used but not declared in your quasar.config file.
:::

<q-btn icon-right="launch" label="Layout Builder" href="/layout-builder" target="_blank" />

## Usage

::: warning Using margin CSS will break the layout
QLayout depends on taking up the whole screen and so QPageContainer, QHeader, QFooter and QLayoutDrawer positions are managed by it (through the `view` prop). You **cannot** use _CSS margins_ as a style neither on QLayout itself nor on any of the QLayout components mentioned above. However you can safely use _CSS padding_.
:::

::: tip
If your layout uses Vue Router sub-routes (recommended), then it makes sense to use Vue's `<router-view />` component, which is just a placeholder where sub-routes are injected. For more information, please read [Routing with Layouts and Pages](/layout/routing-with-layouts-and-pages).
:::

### Understanding the "view" prop

Quasar introduces a unique and excellent layout concept, which allows you to easily structure layouts to work in certain ways, by simply changing a short string notation.

To explain how this works, imagine your Layout is a 3x3 matrix of containers (depicted in blue below). The first row of containers would be the header and the last row would be the footer. The first column of containers would be the "left" and last column would be the "right". The center of the matrix, below the header and above the footer, would be the page or main content container.

This matrix of containers or "QLayout View" can be represented by a string that you should supply to the `view` property of QLayout. This string must contain exactly 11 characters:

- 3 defining the header row
- then a space
- 3 defining the middle row
- a space
- then 3 defining the footer row



<ViewProp />

The letters shown above are also case sensitive. For example, using at least one "L" (uppercase character instead of lowercase) will make your layout left side (drawer) be in a fixed position. Same applies for "H" (header), "F" (footer) and finally "R" (right side / drawer).



<ViewPlay />

For example, if you want your layout's right side / drawer to be placed on the right of the header, page and footer, you'd use `hhr lpr ffr`. If you'd like to also make it fixed, just transform one `r` character to uppercase, like this: `hhr lpR ffr`, or `hhR lpr ffr` or `hhr lpr ffR`.

These settings are completely up to you to use as you'd like. You could even go wild with a setup like this: `lhh LpR ffr`. Try it out!

<q-btn icon-right="launch" label="Layout Builder" href="/layout-builder" target="_blank" />

::: warning

- It is important that you specify all sections of a QLayout, even if you don't use them. For example, even if you don't use footer or right side drawer, still specify them within your QLayout's `view` prop.
- When QDrawer is set into overlay mode, **it will force it to go into fixed position**, regardless if QLayout's "view" prop is configured with "l/r" or "L/R". Also, **if on iOS platform and QLayout is containerized**, the fixed position will also be forced upon QDrawer due to platform limitations that cannot be overcome.

:::

### Containerized QLayout

By default, QLayout is managing the entire window. However, you can also use QLayout as a container (with specific height and width) to isolate it somewhere in your pages.

::: warning
Please note that it **requires a CSS height (or min-height) being set explicitly**, otherwise it can't and it won't work.
:::

In the example below, there is a containerized QLayout with drawers on each side (breakpoint of 700px on the left-side drawer and 500px on the right-side drawer). The breakpoint does not refer to the window width, but to the actual width of the QLayout container.

**Example: Containerized QLayout**

Source: [Container.vue](../../examples/QLayout/Container.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-layout
      view="lhh LpR lff"
      container
      style="height: 500px"
      class="shadow-2 rounded-borders"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-header reveal :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
        <q-toolbar>
          <q-btn
            flat
            @click="drawerLeft = !drawerLeft"
            round
            dense
            icon="menu"
          />
          <q-toolbar-title>Header</q-toolbar-title>
          <q-btn
            flat
            @click="drawerRight = !drawerRight"
            round
            dense
            icon="menu"
          />
        </q-toolbar>
      </q-header>

      <q-footer>
        <q-toolbar>
          <q-toolbar-title>Footer</q-toolbar-title>
        </q-toolbar>
      </q-footer>

      <q-drawer v-model="drawerLeft" :width="200" :breakpoint="700" bordered>
        <q-scroll-area class="fit">
          <div class="q-pa-sm">
            <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
          </div>
        </q-scroll-area>
      </q-drawer>

      <q-drawer
        side="right"
        v-model="drawerRight"
        bordered
        :width="200"
        :breakpoint="500"
      >
        <q-scroll-area class="fit">
          <div class="q-pa-sm">
            <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
          </div>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page style="padding-top: 60px" class="q-pa-md">
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil
            praesentium molestias a adipisci, dolore vitae odit, quidem
            consequatur optio voluptates asperiores pariatur eos numquam rerum
            delectus commodi perferendis voluptate?
          </p>

          <q-page-sticky position="top-left" :offset="[18, 68]">
            <q-btn round color="primary" icon="arrow_back" class="rotate-45" />
          </q-page-sticky>
          <q-page-sticky position="top-right" :offset="[18, 68]">
            <q-btn
              round
              color="primary"
              icon="arrow_upward"
              class="rotate-45"
            />
          </q-page-sticky>
          <q-page-sticky position="bottom-left" :offset="[18, 18]">
            <q-btn
              round
              color="primary"
              icon="arrow_forward"
              class="rotate-135"
            />
          </q-page-sticky>
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
              round
              color="primary"
              icon="arrow_forward"
              class="rotate-45"
            />
          </q-page-sticky>

          <q-page-sticky position="top" expand class="bg-primary text-white">
            <q-toolbar>
              <q-btn flat round dense icon="map" />
              <q-toolbar-title>Title</q-toolbar-title>
            </q-toolbar>
          </q-page-sticky>
        </q-page>

        <q-page-scroller position="bottom">
          <q-btn fab icon="keyboard_arrow_up" color="red" />
        </q-page-scroller>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const drawerLeft = ref(false)
const drawerRight = ref(true)
</script>
````

**Example: In a QDialog**

Source: [ContainerDialog.vue](../../examples/QLayout/ContainerDialog.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn color="teal" label="Open Dialog" @click="dialog = true" />

    <q-dialog v-model="dialog">
      <q-layout
        view="lhh LpR lff"
        container
        style="height: 500px"
        class="shadow-2"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      >
        <q-header :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
          <q-toolbar>
            <q-btn
              flat
              @click="drawerLeft = !drawerLeft"
              round
              dense
              icon="menu"
            />
            <q-toolbar-title>Header</q-toolbar-title>
            <q-btn
              flat
              @click="drawerRight = !drawerRight"
              round
              dense
              icon="menu"
            />
          </q-toolbar>
        </q-header>

        <q-drawer v-model="drawerLeft" :width="200" behavior="mobile" bordered>
          <q-scroll-area class="fit">
            <div class="q-pa-sm">
              <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
            </div>
          </q-scroll-area>
        </q-drawer>

        <q-drawer
          side="right"
          v-model="drawerRight"
          bordered
          :width="200"
          :breakpoint="300"
        >
          <q-scroll-area class="fit">
            <div class="q-pa-sm">
              <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
            </div>
          </q-scroll-area>
        </q-drawer>

        <q-page-container>
          <q-page class="q-pa-md">
            <p v-for="n in 15" :key="n">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit
              nihil praesentium molestias a adipisci, dolore vitae odit, quidem
              consequatur optio voluptates asperiores pariatur eos numquam rerum
              delectus commodi perferendis voluptate?
            </p>

            <q-page-sticky position="top-left" :offset="[18, 18]">
              <q-btn
                round
                color="primary"
                icon="arrow_back"
                class="rotate-45"
              />
            </q-page-sticky>
            <q-page-sticky position="top-right" :offset="[18, 18]">
              <q-btn
                round
                color="primary"
                icon="arrow_upward"
                class="rotate-45"
              />
            </q-page-sticky>
            <q-page-sticky position="bottom-left" :offset="[18, 18]">
              <q-btn
                round
                color="primary"
                icon="arrow_forward"
                class="rotate-135"
              />
            </q-page-sticky>
            <q-page-sticky position="bottom-right" :offset="[18, 18]">
              <q-btn
                round
                color="primary"
                icon="arrow_forward"
                class="rotate-45"
              />
            </q-page-sticky>
          </q-page>

          <q-page-scroller position="bottom">
            <q-btn fab icon="keyboard_arrow_up" color="red" />
          </q-page-scroller>
        </q-page-container>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dialog = ref(false)
const drawerLeft = ref(false)
const drawerRight = ref(true)
</script>
````
