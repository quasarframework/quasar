---
title: Skeleton
description: The QSkeleton Vue component is used to display a placeholder preview of your content before you load the actual page data.
canonical: https://quasar.dev/vue-components/skeleton
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QSkeleton](../../api/QSkeleton.md)

The QSkeleton is a component for displaying a placeholder preview of your content before you load the actual page data. It's a nice way of informing the user of what to expect from the page before it is fully loaded and increases the perceived performance. It can be used to incrementally display information on screen as data is being fetched.

**API reference:** [QSkeleton](../../api/QSkeleton.md)

## Usage

**Example: On a QCard**

Source: [Card.vue](../../examples/QSkeleton/Card.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-card style="max-width: 300px">
      <q-item>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-skeleton height="200px" square />

      <q-card-actions align="right" class="q-gutter-md">
        <q-skeleton type="QBtn" />
        <q-skeleton type="QBtn" />
      </q-card-actions>
    </q-card>
  </div>
</template>
````

### Predefined types

Below you can see the predefined types. There are some basic types (text, rect, circle) and also some special convenience types that accurately respect Quasar components size and border radius.

**Example: QSkeleton types**

Source: [Types.vue](../../examples/QSkeleton/Types.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-card
        flat
        bordered
        v-for="type in skeletonTypes"
        :key="type"
        style="width: 250px"
      >
        <q-card-section>
          <div class="text-caption">"{{ type }}"</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-skeleton :type="type" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
const skeletonTypes = [
  'text',
  'rect',
  'circle',
  'QBtn',
  'QBadge',
  'QChip',
  'QToolbar',
  'QCheckbox',
  'QRadio',
  'QToggle',
  'QSlider',
  'QRange',
  'QInput',
  'QAvatar'
]
</script>
````

### Animations

**Example: Animations**

Source: [Animations.vue](../../examples/QSkeleton/Animations.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-card
        flat
        bordered
        v-for="animation in skeletonAnimations"
        :key="animation"
        style="width: 250px"
      >
        <q-card-section>
          <div class="text-caption">"{{ animation }}"</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-skeleton :animation="animation" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
const skeletonAnimations = [
  'wave',
  'pulse',
  'pulse-x',
  'pulse-y',
  'fade',
  'blink',
  'none'
]
</script>
````

### Sizing

**Example: Sizing**

Source: [Sizing.vue](../../examples/QSkeleton/Sizing.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-skeleton type="circle" size="100px" />
      <q-skeleton width="150px" />
      <q-skeleton height="150px" />
      <q-skeleton size="50px" />
      <q-skeleton width="200px" height="100px" />
    </div>
  </div>
</template>
````

### Styling

**Example: Bordered**

Source: [StylingBordered.vue](../../examples/QSkeleton/StylingBordered.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-skeleton bordered type="circle" />
      <q-skeleton bordered />
      <q-skeleton bordered square />
    </div>
  </div>
</template>
````

**Example: Square borders**

Source: [StylingSquare.vue](../../examples/QSkeleton/StylingSquare.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-skeleton square />
  </div>
</template>
````

**Example: Custom color**

Source: [StylingColor.vue](../../examples/QSkeleton/StylingColor.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-skeleton class="bg-accent" type="circle" />
      <q-skeleton class="bg-teal" />
      <q-skeleton class="bg-orange" animation="pulse-y" />
      <q-skeleton class="bg-indigo" />
    </div>
  </div>
</template>
````

**Example: Custom border**

Source: [StylingCustomBorder.vue](../../examples/QSkeleton/StylingCustomBorder.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-skeleton width="100px" height="50px" class="custom-skeleton-border" />
    </div>
  </div>
</template>

<style lang="sass">
.custom-skeleton-border
  border-radius: 10px 0 24px 4px
  border: 1px solid #aaa
</style>
````

### Recipes

Enjoy some pre-made recipes. Your imagination is the only limit.

**Example: Youtube**

Source: [RecipeYoutube.vue](../../examples/QSkeleton/RecipeYoutube.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-card flat style="max-width: 300px">
      <q-skeleton height="150px" square />

      <q-card-section>
        <q-skeleton type="text" class="text-subtitle1" />
        <q-skeleton type="text" width="50%" class="text-subtitle1" />
        <q-skeleton type="text" class="text-caption" />
      </q-card-section>
    </q-card>
  </div>
</template>
````

**Example: Facebook**

Source: [RecipeFacebook.vue](../../examples/QSkeleton/RecipeFacebook.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-card flat bordered style="max-width: 300px">
      <q-item>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" animation="fade" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" animation="fade" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" animation="fade" />
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-skeleton height="200px" square animation="fade" />

      <q-card-section>
        <q-skeleton type="text" class="text-subtitle2" animation="fade" />
        <q-skeleton
          type="text"
          width="50%"
          class="text-subtitle2"
          animation="fade"
        />
      </q-card-section>
    </q-card>
  </div>
</template>
````

**Example: Twitter**

Source: [RecipeTwitter.vue](../../examples/QSkeleton/RecipeTwitter.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-card flat bordered style="max-width: 500px">
      <q-item>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" width="80%" />
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section avatar />

        <q-item-section class="q-pl-sm">
          <q-skeleton height="150px" class="q-mb-sm" />

          <div class="row items-center justify-between no-wrap">
            <div class="row items-center">
              <q-icon
                name="chat_bubble_outline"
                color="grey-4"
                class="q-mr-sm"
                size="18px"
              />
              <q-skeleton type="text" width="30px" />
            </div>

            <div class="row items-center">
              <q-icon
                name="repeat"
                color="grey-4"
                class="q-mr-sm"
                size="18px"
              />
              <q-skeleton type="text" width="30px" />
            </div>

            <div class="row items-center">
              <q-icon
                name="favorite_border"
                color="grey-4"
                class="q-mr-sm"
                size="18px"
              />
              <q-skeleton type="text" width="30px" />
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>
````

**Example: Twitch**

Source: [RecipeTwitch.vue](../../examples/QSkeleton/RecipeTwitch.vue)

````vue
<template>
  <div class="q-pa-md">
    <div style="max-width: 300px">
      <q-skeleton height="170px" square animation="fade" />

      <div class="row items-start no-wrap q-mt-sm">
        <q-skeleton size="56px" square animation="fade" />

        <div class="col q-pl-sm">
          <q-skeleton type="text" square width="30%" animation="fade" />
          <q-skeleton type="text" square height="12px" animation="fade" />
          <q-skeleton
            type="text"
            square
            height="12px"
            width="75%"
            animation="fade"
          />
        </div>
      </div>
    </div>
  </div>
</template>
````

**Example: Table**

Source: [RecipeTable.vue](../../examples/QSkeleton/RecipeTable.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left" style="width: 150px">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="n in 5" :key="n">
          <td class="text-left">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="50px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="35px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="65px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="25px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>
````

**Example: List**

Source: [RecipeList.vue](../../examples/QSkeleton/RecipeList.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-item style="max-width: 300px">
      <q-item-section avatar>
        <q-skeleton type="QAvatar" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" />
        </q-item-label>
        <q-item-label caption>
          <q-skeleton type="text" width="65%" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item style="max-width: 300px">
      <q-item-section avatar>
        <q-skeleton type="QAvatar" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" />
        </q-item-label>
        <q-item-label caption>
          <q-skeleton type="text" width="90%" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item style="max-width: 300px">
      <q-item-section avatar>
        <q-skeleton type="QAvatar" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" width="35%" />
        </q-item-label>
        <q-item-label caption>
          <q-skeleton type="text" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>
````
