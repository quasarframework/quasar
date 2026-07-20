---
title: Responsive
description: The QResponsive Vue component forces the content to maintain an aspect ratio based on its width.
canonical: https://quasar.dev/vue-components/responsive
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QResponsive](../../api/QResponsive.md)

QResponsive is a component which forces the content to maintain an aspect ratio based on its width.

**API reference:** [QResponsive](../../api/QResponsive.md)

## Usage

::: tip TIPS

- The component can be used with any content, as long you specify **only one direct child**. If you need multiple elements inside of it, wrap them in a `<div>`.
- It is your responsibility to make sure that your content won't overflow the container.

:::

::: warning
Do not use it on Quasar components that already have a `ratio` property, like QImg or QVideo, or on components that have a forced height.
:::

### Basic

**Example: Basic usage**

Source: [Basic.vue](../../examples/QResponsive/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px">
      <q-responsive :ratio="16 / 9">
        <div class="rounded-borders bg-primary text-white flex flex-center">
          Ratio 16:9
        </div>
      </q-responsive>

      <q-responsive :ratio="1">
        <div class="rounded-borders bg-primary text-white flex flex-center">
          Ratio 1:1
        </div>
      </q-responsive>
    </div>
  </div>
</template>
````

### Flex row

Note below that we are using a vertical alignment (`items-start`) other than the default (`stretch`), so that flexbox won't force the height on each QResponsive component.

**Example: Basic usage**

Source: [FlexRow.vue](../../examples/QResponsive/FlexRow.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row items-start q-gutter-md">
      <q-responsive :ratio="16 / 9" class="col">
        <div class="rounded-borders bg-primary text-white flex flex-center">
          Ratio 16:9
        </div>
      </q-responsive>

      <q-responsive :ratio="1" class="col">
        <div class="rounded-borders bg-primary text-white flex flex-center">
          Ratio 1:1
        </div>
      </q-responsive>
    </div>
  </div>
</template>
````

### On some components

Below are just a few examples. QResponsive is not restricted to only QCard and QCarousel.

**Example: On QCard**

Source: [Card.vue](../../examples/QResponsive/Card.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row items-start q-gutter-md">
      <q-responsive :ratio="16 / 9" class="col">
        <q-card class="column" flat bordered>
          <q-img class="col" src="https://cdn.quasar.dev/img/parallax2.jpg" />

          <q-card-section>
            <div>Ratio 16:9</div>
          </q-card-section>
        </q-card>
      </q-responsive>

      <q-responsive :ratio="1" class="col">
        <q-card class="column" flat bordered>
          <q-img class="col" src="https://cdn.quasar.dev/img/parallax1.jpg" />

          <q-card-section>
            <div>Ratio 1:1</div>
          </q-card-section>
        </q-card>
      </q-responsive>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref(1)
</script>
````

**Example: On QCardSection**

Source: [CardSection.vue](../../examples/QResponsive/CardSection.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row items-start q-gutter-md">
      <q-card flat bordered class="col">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Title</q-item-label>
            <q-item-label caption> Subhead </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-responsive :ratio="16 / 9">
          <!-- notice "border-radius-inherit" below; it's important when in a QCard -->
          <q-card-section class="border-radius-inherit flex flex-center">
            <div>QCardSection with ratio 16:9</div>
          </q-card-section>
        </q-responsive>
      </q-card>

      <q-card flat bordered class="col">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Title</q-item-label>
            <q-item-label caption> Subhead </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-responsive :ratio="1">
          <!-- notice "border-radius-inherit" below; it's important when in a QCard -->
          <q-card-section class="border-radius-inherit flex flex-center">
            <div>QCardSection with ratio 1:1</div>
          </q-card-section>
        </q-responsive>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref(1)
</script>
````

**Example: On QTable**

Source: [Table.vue](../../examples/QResponsive/Table.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-responsive :ratio="16 / 9">
      <q-table
        class="my-sticky-table"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        :virtual-scroll-sticky-size-start="48"
        row-key="index"
        title="Table aspect ratio: 4/3"
        :rows="rows"
        :columns="columns"
      />
    </q-responsive>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const seed = [
  // #region
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  }
  // #endregion
]

// we generate lots of rows here
const rowsData = []
for (let i = 0; i < 100; i++) {
  rowsData.push(...seed.map(r => ({ ...r })))
}
rowsData.forEach((row, index) => {
  row.index = index
})

const rows = ref(rowsData)

const columns = [
  // #region
  {
    name: 'index',
    label: '#',
    field: 'index'
  },
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'calories',
    align: 'center',
    label: 'Calories',
    field: 'calories',
    sortable: true
  },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  {
    name: 'calcium',
    label: 'Calcium (%)',
    field: 'calcium',
    sortable: true,
    sort: (a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10)
  },
  {
    name: 'iron',
    label: 'Iron (%)',
    field: 'iron',
    sortable: true,
    sort: (a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10)
  }
  // #endregion
]

const pagination = ref({
  rowsPerPage: 0
})
</script>

<style lang="sass">
.my-sticky-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #00b4ff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
````

Notice that we will not supply a `height` prop to QCarousel when we use QResponsive on it, since it's QResponsive who will take care of that.

**Example: On QCarousel**

Source: [Carousel.vue](../../examples/QResponsive/Carousel.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-responsive :ratio="16 / 9" style="width: 500px; max-width: 100%">
      <q-carousel swipeable animated arrows v-model="slide" infinite>
        <q-carousel-slide
          :name="1"
          img-src="https://cdn.quasar.dev/img/mountains.jpg"
        />
        <q-carousel-slide
          :name="2"
          img-src="https://cdn.quasar.dev/img/parallax1.jpg"
        />
        <q-carousel-slide
          :name="3"
          img-src="https://cdn.quasar.dev/img/parallax2.jpg"
        />
        <q-carousel-slide
          :name="4"
          img-src="https://cdn.quasar.dev/img/quasar.jpg"
        />

        <template v-slot:control>
          <q-carousel-control
            position="bottom"
            :offset="[16, 8]"
            class="text-white text-center rounded-borders"
            style="background: rgba(255, 255, 255, 0.2); padding: 4px 8px"
          >
            Ratio 16:9
          </q-carousel-control>
        </template>
      </q-carousel>
    </q-responsive>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const slide = ref(1)
</script>
````

### Maximum height

Apply the max height (or max width, etc etc) directly on the QResponsive component through a CSS class or inline. Remember that it is still your responsibility to ensure that the content won't overflow the container.

**Example: On QCard**

Source: [MaxHeight.vue](../../examples/QResponsive/MaxHeight.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row items-start q-gutter-md">
      <q-responsive :ratio="4 / 3" class="col" style="max-height: 100px">
        <q-card class="column" flat bordered>
          <q-img class="col" src="https://cdn.quasar.dev/img/parallax1.jpg" />

          <q-card-section>
            <div>Ratio 4:3, but max height of 100px</div>
          </q-card-section>
        </q-card>
      </q-responsive>
    </div>
  </div>
</template>
````
