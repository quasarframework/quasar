---
title: CSS Shadows (Elevation)
description: The list of CSS classes supplied by Quasar for defining elevation on DOM elements.
canonical: https://quasar.dev/style/shadows
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

Simple yet effective way to add shadows to create a depth/elevation effect.
The shadows are in accordance to Material Design specifications (24 levels of depth).

## Usage

| CSS Class Name      | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `no-shadow`         | Remove any shadow                                     |
| `inset-shadow`      | Set an inset shadow on top                            |
| `inset-shadow-down` | Set an inset shadow on bottom                         |
| `shadow-1`          | Set a depth of 1                                      |
| `shadow-2`          | Set a depth of 2                                      |
| `shadow-N`          | Where `N` is an integer from 1 to 24.                 |
| `shadow-transition` | Apply the default CSS transition effect on the shadow |

**Example: Standard shadows**

Source: [Standard.vue](../../examples/shadows/Standard.vue)

```vue
<template>
  <div class="q-pa-md">
    <div
      class="flex inline shadow-box flex-center"
      v-for="n in 24"
      :key="n"
      :class="`shadow-${n}`"
    >
      .shadow-{{ n }}
    </div>
  </div>
</template>

<style lang="sass" scoped>
.shadow-box
  width: 90px
  height: 90px
  margin: 25px
  border-radius: 50%
  font-size: 12px
</style>
```

The shadows above point towards the bottom of the element. If you want them to point towards the top of the element, add `up` before the number:

| CSS Class Name | Description                           |
| -------------- | ------------------------------------- |
| `shadow-up-1`  | Set a depth of 1                      |
| `shadow-up-2`  | Set a depth of 2                      |
| `shadow-up-N`  | Where `N` is an integer from 1 to 24. |

**Example: Shadows pointing up**

Source: [PointingUp.vue](../../examples/shadows/PointingUp.vue)

```vue
<template>
  <div class="q-pa-md">
    <div
      class="flex inline shadow-box flex-center"
      v-for="n in 24"
      :key="n"
      :class="`shadow-up-${n}`"
    >
      .shadow-up-{{ n }}
    </div>
  </div>
</template>

<style lang="sass" scoped>
.shadow-box
  width: 90px
  height: 90px
  margin: 25px
  border-radius: 50%
  font-size: 12px
</style>
```

**Example: Inset shadow**

Source: [Inset.vue](../../examples/shadows/Inset.vue)

```vue
<template>
  <div class="q-pa-md q-gutter-md">
    <div
      class="inset-shadow flex inline shadow-box flex-center doc-inset-shadow"
    >
      .inset-shadow
    </div>

    <div
      class="inset-shadow-down flex inline shadow-box flex-center doc-inset-shadow"
    >
      .inset-shadow-down
    </div>
  </div>
</template>

<style lang="sass" scoped>
.shadow-box
  width: 90px
  height: 90px
  margin: 25px
  border-radius: 50%
  font-size: 12px
.doc-inset-shadow
  width: 120px
  height: 120px
  border: 1px solid #eee
  padding: 4px
</style>
```
