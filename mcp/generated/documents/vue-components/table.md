---
title: Table
description: The QTable Vue component allows you to display data in a tabular manner and it's packed with a lot of related features. It's generally called a datatable.
canonical: https://quasar.dev/vue-components/table
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QTable](../../api/QTable.md)
- [QTd](../../api/QTd.md)
- [QTh](../../api/QTh.md)
- [QTr](../../api/QTr.md)

QTable is a component that allows you to display data in a tabular manner. It's generally called a datatable. It packs the following main features:

- Filtering
- Sorting
- Single / Multiple rows selection with custom selection actions
- Pagination (including server-side if required)
- Grid mode (you can use for example QCards to display data in a non-tabular manner)
- Total customization of rows and cells through scoped slots
- Ability to add additional row(s) at top or bottom of data rows
- Column picker (through QTableColumns component described in one of the sections)
- Custom top and/or bottom Table controls
- Responsive design

::: tip
If you don't need pagination, sorting, filtering, and all other features of QTable, then you may want to check out [QMarkupTable](/vue-components/markup-table) component instead.
:::

**API reference:** [QTable](../../api/QTable.md)

**API reference:** [QTh](../../api/QTh.md)

**API reference:** [QTr](../../api/QTr.md)

**API reference:** [QTd](../../api/QTd.md)

## Defining the columns

Let’s take an example of configuring the `columns` property. We are going to tell QTable that `row-key` is ‘name’, which **must** be unique. If this was data fetched from a database we would likely use the row **id**.

```js
columns: [
  // array of Objects
  // column Object definition
  {
    // unique id
    // identifies column
    // (used by pagination.sortBy, "body-cell-[name]" slot, ...)
    name: 'desc',

    // label for header
    label: 'Dessert (100g serving)',

    // row Object property to determine value for this column
    field: 'name',
    // OR field: row => row.some.nested.prop,

    // (optional) if we use visible-columns, this col will always be visible
    required: true,

    // (optional) alignment
    align: 'left',

    // (optional) tell QTable you want this column sortable
    sortable: true,

    // (optional) compare function if you have
    // some custom data or want a specific way to compare two rows
    // --> note that rows with null/undefined as value will get auto sorted
    // without calling this method (if you want to handle those as well, use "rawSort" instead)
    sort: (a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10),
    // function return value:
    //   * is less than 0 then sort a to an index lower than b, i.e. a comes first
    //   * is 0 then leave a and b unchanged with respect to each other, but sorted with respect to all different elements
    //   * is greater than 0 then sort b to an index lower than a, i.e. b comes first

    // (optional) requires Quasar v2.13+
    // compare function if you have
    // some custom data or want a specific way to compare two rows
    // --> note that there is an alternative "sort" method (above) if you don't
    // want to handle (by yourself) rows with null/undefined as value
    rawSort: (a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10),
    // has the same return value as the alternative "sort" method above

    // (optional) override 'column-sort-order' prop;
    // sets column sort order: 'ad' (ascending-descending) or 'da' (descending-ascending)
    sortOrder: 'ad', // or 'da'

    // (optional) you can format the data with a function
    format: (val, row) => `${val}%`,
    // one more format example:
    // format: val => val
    //   ? /* Unicode checkmark checked */ "\u2611"
    //   : /* Unicode checkmark unchecked */ "\u2610",

    // body td:
    style: 'width: 500px',
    // or as Function --> style: row => ... (return String/Array/Object)
    classes: 'my-special-class',
    // or as Function --> classes: row => ... (return String)

    // header th:
    headerStyle: 'width: 500px',
    headerClasses: 'my-special-class'
  },
  { name: 'calories', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  {
    name: 'calcium',
    label: 'Calcium (%)',
    field: 'calcium',
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
  },
  {
    name: 'iron',
    label: 'Iron (%)',
    field: 'iron',
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
  }
]
```

## Basic usage

**Example: Basic**

Source: [Basic.vue](../../examples/QTable/Basic.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table title="Treats" :rows="rows" :columns="columns" row-key="name" />
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>
```

**Example: Force dark mode**

Source: [Dark.vue](../../examples/QTable/Dark.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      dark
      color="amber"
    />
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>
```

**Example: Dense**

Source: [Dense.vue](../../examples/QTable/Dense.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      dense
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>
```

::: tip
You can use the `dense` prop along with `$q.screen` to create a responsive behavior. Example: `:dense="$q.screen.lt.md"`. More info: [Screen Plugin](/options/screen-plugin).
:::

## Omitting columns definition

You can omit specifying the `columns`. QTable will infer the columns from the properties of the first row of the data. Note that labels are uppercased and sorting is enabled:

**Example: Infering columns from data**

Source: [InferColumns.vue](../../examples/QTable/InferColumns.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table :rows="rows" row-key="name" flat bordered />
  </div>
</template>

<script setup>
const rows = [
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
</script>
```

## Sticky header/column

::: warning
Sticky headers and columns are achieved through CSS with `position: sticky`. This is NOT supported on all browsers. Check [caniuse.com](https://caniuse.com/#search=sticky) before using this technique.
:::

::: tip
Pay attention to the code in the "style" section in the following examples, especially around `position: sticky`.
:::

**Example: Sticky header**

Source: [StickyHeader.vue](../../examples/QTable/StickyHeader.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #00b4ff

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
```

**Example: Sticky first column**

Source: [StickyColumn.vue](../../examples/QTable/StickyColumn.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-column-table"
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>

<style lang="sass">
.my-sticky-column-table
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 600px

  thead tr:first-child th:first-child
    /* bg color is important for th; just specify one */
    background-color: #00b4ff

  td:first-child
    background-color: #00b4ff

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>
```

**Example: Sticky last column**

Source: [StickyLastColumn.vue](../../examples/QTable/StickyLastColumn.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-last-column-table"
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>

<style lang="sass">
.my-sticky-last-column-table
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 600px

  thead tr:last-child th:last-child
    /* bg color is important for th; just specify one */
    background-color: #00b4ff

  td:last-child
    background-color: #00b4ff

  th:last-child,
  td:last-child
    position: sticky
    right: 0
    z-index: 1
</style>
```

**Example: Sticky header and column**

Source: [StickyHeaderAndColumn.vue](../../examples/QTable/StickyHeaderAndColumn.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-column-table"
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>

<style lang="sass">
.my-sticky-header-column-table
  /* height or max-height is important */
  height: 310px

  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 600px

  td:first-child
    /* bg color is important for td; just specify one */
    background-color: #00b4ff

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #00b4ff

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
```

**Example: Sticky header and last column**

Source: [StickyHeaderAndLastColumn.vue](../../examples/QTable/StickyHeaderAndLastColumn.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-last-column-table"
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>

<style lang="sass">
.my-sticky-header-last-column-table
  /* height or max-height is important */
  height: 310px

  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 600px

  td:last-child
    /* bg color is important for td; just specify one */
    background-color: #00b4ff

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #00b4ff

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:last-child th:last-child
    /* highest z-index */
    z-index: 3

  td:last-child
    z-index: 1

  td:last-child, th:last-child
    position: sticky
    right: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
```

## Separators

**Example: Separators**

Source: [Separators.vue](../../examples/QTable/Separators.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-option-group
      v-model="separator"
      inline
      class="q-mb-md"
      :options="[
        { label: 'Horizontal (default)', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
        { label: 'Cell', value: 'cell' },
        { label: 'None', value: 'none' }
      ]"
    />

    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :separator="separator"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
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

const rows = [
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

const separator = ref('vertical')
</script>
```

## Styling

**Example: Custom column**

Source: [CustomColumn.vue](../../examples/QTable/CustomColumn.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table flat bordered :rows="rows" :columns="columns" row-key="name" />
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>
```

::: tip
For all the styling component properties, please check the API card at the top of the page.
:::

**Example: Custom coloring**

Source: [CustomColor.vue](../../examples/QTable/CustomColor.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      color="primary"
      card-class="bg-orange text-grey-10"
      table-class="text-grey-1"
      table-header-class="text-brown"
      :table-row-class-fn="rowClassFn"
      :table-row-style-fn="rowStyleFn"
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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

function rowClassFn(row) {
  return row.calories % 2 === 0 ? 'bg-brown' : 'bg-primary'
}

function rowStyleFn(row) {
  return row.calories % 2 === 0 ? 'color:#ccc' : 'color:#fff'
}
</script>
```

**Example: No header/footer**

Source: [NoHeaderFooter.vue](../../examples/QTable/NoHeaderFooter.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      hide-header
      hide-bottom
    />
  </div>
</template>

<script setup>
const columns = [
  // #region
  {
    name: 'desc',
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

const rows = [
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
</script>
```

## Virtual scrolling

Notice that when enabling virtual scroll you will need to specify the `table-style` (with a max-height) prop. In the example below, we are also forcing QTable to display all rows at once (note the use of `pagination` and `rows-per-page-options` props).

**Example: Basic virtual scroll**

Source: [VirtscrollBasic.vue](../../examples/QTable/VirtscrollBasic.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      style="height: 400px"
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="index"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
const rows = []
for (let i = 0; i < 1000; i++) {
  rows.push(...seed.map(r => ({ ...r })))
}
rows.forEach((row, index) => {
  row.index = index
})

const pagination = ref({
  rowsPerPage: 0
})
</script>
```

You can dynamically load new rows when scroll reaches the end:

**Example: Dynamic loading virtual scroll**

Source: [VirtscrollDynamic.vue](../../examples/QTable/VirtscrollDynamic.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-dynamic"
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      row-key="index"
      virtual-scroll
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :pagination="pagination"
      :rows-per-page-options="[0]"
      @virtual-scroll="onScroll"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'

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
    format: val => val,
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
const allRows = []
for (let i = 0; i < 1000; i++) {
  allRows.push(...seed.map(r => ({ ...r })))
}
allRows.forEach((row, index) => {
  row.index = index
})

const pageSize = 50
const lastPage = Math.ceil(allRows.length / pageSize)

const pagination = { rowsPerPage: 0 }
const nextPage = ref(2)
const loading = ref(false)

const rows = computed(() => allRows.slice(0, pageSize * (nextPage.value - 1)))

function onScroll({ to, ref: compRef }) {
  const lastIndex = rows.value.length - 1

  if (loading.value !== true && nextPage.value < lastPage && to === lastIndex) {
    loading.value = true

    setTimeout(() => {
      nextPage.value++
      nextTick(() => {
        compRef.refresh()
        loading.value = false
      })
    }, 500)
  }
}
</script>

<style lang="sass">
.my-sticky-dynamic
  /* height or max-height is important */
  height: 410px

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
```

You can have both virtual scroll and pagination:

**Example: Virtual scroll and pagination**

Source: [VirtscrollPagination.vue](../../examples/QTable/VirtscrollPagination.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      style="height: 400px"
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="index"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
const rows = []
for (let i = 0; i < 1000; i++) {
  rows.push(...seed.map(r => ({ ...r })))
}
rows.forEach((row, index) => {
  row.index = index
})

const pagination = ref({
  rowsPerPage: 1000
})
</script>
```

The example below shows how virtual scroll can be used along with a sticky header. Notice the `virtual-scroll-sticky-start` prop which is set to the header height.

**Example: Virtual scroll with sticky header**

Source: [VirtscrollSticky.vue](../../examples/QTable/VirtscrollSticky.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-virtscroll-table"
      virtual-scroll
      flat
      bordered
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="index"
      title="Treats"
      :rows="rows"
      :columns="columns"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
const rows = []
for (let i = 0; i < 1000; i++) {
  rows.push(...seed.map(r => ({ ...r })))
}
rows.forEach((row, index) => {
  row.index = index
})

const pagination = ref({
  rowsPerPage: 0
})
</script>

<style lang="sass">
.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 410px

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
```

There are 2 utility CSS classes that control VirtualScroll size calculation:

- Use `q-virtual-scroll--with-prev` class on an element rendered by the VirtualScroll to indicate that the element should be grouped with the previous one (main use case is for multiple table rows generated from the same row of data).
- Use `q-virtual-scroll--skip` class on an element rendered by the VirtualScroll to indicate that the element's size should be ignored in size calculations.

**Example: Virtual scroll with multiple rows for a data row**

Source: [VirtscrollMultipleRows.vue](../../examples/QTable/VirtscrollMultipleRows.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      style="height: 400px"
      flat
      bordered
      ref="tableRef"
      title="Treats"
      :rows="rows"
      :columns="columns"
      :table-colspan="9"
      row-key="index"
      virtual-scroll
      :virtual-scroll-item-size="48"
      :pagination="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th />

          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" :key="`m_${props.row.index}`">
          <q-td> Index: {{ props.row.index }} </q-td>

          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr
          :props="props"
          :key="`e_${props.row.index}`"
          class="q-virtual-scroll--with-prev"
        >
          <q-td colspan="100%">
            <div class="text-left"
              >This is the second row generated from the same data:
              {{ props.row.name }} (Index: {{ props.row.index }}).</div
            >
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { onMounted, ref, useTemplateRef } from 'vue'

const columns = [
  // #region
  {
    name: 'desc',
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
  {
    name: 'fat',
    label: 'Fat (g)',
    field: 'fat',
    sortable: true,
    style: 'width: 10px'
  },
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

const seedSize = seed.length

const rows = []
for (let i = 0; i < 1000; i++) {
  rows.push(...seed.map((r, j) => ({ ...r, index: i * seedSize + j + 1 })))
}

const tableRef = useTemplateRef('tableRef')
const pagination = { rowsPerPage: 0 }

onMounted(() => {
  tableRef.value.scrollTo(5000)
})
</script>
```

::: tip
When rendering more than one `QTr` for the same row of data (through the `body` slot), give each `QTr` a distinct `key` and add the `q-virtual-scroll--with-prev` class to every extra `QTr` after the first one. This tells VirtualScroll to group their sizes together with the previous element, so the total height of the data row is measured correctly. If a row should not be measured at all (for example, a separator), use `q-virtual-scroll--skip` instead. This is especially important when also using a sticky header or row expansion, otherwise you may notice an incorrect scroll height or a jumping scroll position.
:::

## Selection

::: warning
The property `row-key` must be set in order for selection to work properly.
:::

**Example: Single selection**

Source: [SingleSelection.vue](../../examples/QTable/SingleSelection.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      selection="single"
      v-model:selected="selected"
    />

    <div class="q-mt-md"> Selected: {{ JSON.stringify(selected) }} </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
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

const rows = [
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

const selected = ref([])
</script>
```

**Example: Multiple selection**

Source: [MultipleSelection.vue](../../examples/QTable/MultipleSelection.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      v-model:selected="selected"
    />

    <div class="q-mt-md"> Selected: {{ JSON.stringify(selected) }} </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
  {
    name: 'desc',
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

const rows = [
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

const selected = ref([])

function getSelectedString() {
  return selected.value.length === 0
    ? ''
    : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${rows.length}`
}
</script>
```

**Example: Selection cell slots**

Source: [SelectionSlots.vue](../../examples/QTable/SelectionSlots.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
    >
      <template v-slot:header-selection="scope">
        <q-toggle v-model="scope.selected" />
      </template>

      <template v-slot:body-selection="scope">
        <q-toggle v-model="scope.selected" />
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
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

const rows = [
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

const selected = ref([])
</script>
```

**Example: Selection cell slots with range selection**

Source: [SelectionSlotsRange.vue](../../examples/QTable/SelectionSlotsRange.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="text-subtitle1 q-pa-sm"
      >Use <kbd>SHIFT</kbd> to select / deselect a range and <kbd>CTRL</kbd> to
      add to selection</div
    >

    <q-table
      flat
      bordered
      ref="tableRef"
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
      @selection="handleSelection"
    >
      <template v-slot:header-selection="scope">
        <q-checkbox v-model="scope.selected" />
      </template>

      <template v-slot:body-selection="scope">
        <q-checkbox
          :model-value="scope.selected"
          @update:model-value="
            (val, evt) => {
              Object.getOwnPropertyDescriptor(scope, 'selected').set(val, evt)
            }
          "
        />
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { nextTick, ref, toRaw, useTemplateRef } from 'vue'

const columns = [
  // #region
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

const rows = [
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

const tableRef = useTemplateRef('tableRef')
const selected = ref([])
let storedSelectedRow

function handleSelection({ rows: rowsList, added, evt }) {
  // ignore selection change from header of not from a direct click event
  if (rowsList.length !== 1 || evt === void 0) return

  const oldSelectedRow = storedSelectedRow
  const [newSelectedRow] = rowsList
  const { ctrlKey, shiftKey, metaKey } = evt

  if (!shiftKey) {
    storedSelectedRow = newSelectedRow
  }

  // wait for the default selection to be performed
  nextTick(() => {
    if (shiftKey) {
      const tableRows = tableRef.value.filteredSortedRows
      let firstIndex = tableRows.indexOf(oldSelectedRow)
      let lastIndex = tableRows.indexOf(newSelectedRow)

      if (firstIndex < 0) {
        firstIndex = 0
      }

      if (firstIndex > lastIndex) {
        ;[firstIndex, lastIndex] = [lastIndex, firstIndex]
      }

      const rangeRows = tableRows.slice(firstIndex, lastIndex + 1)
      // we need the original row object so we can match them against the rows in range
      const selectedRows = selected.value.map(toRaw)

      selected.value = added
        ? [
            ...selectedRows,
            ...rangeRows.filter(row => !selectedRows.includes(row))
          ]
        : selectedRows.filter(row => !rangeRows.includes(row))
    } else if (!(ctrlKey || metaKey) && added) {
      selected.value = [newSelectedRow]
    }
  })
}
</script>
```

**Example: Custom multiple selection**

Source: [CustomSelection.vue](../../examples/QTable/CustomSelection.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      ref="tableRef"
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected="selected"
      @selection="onSelection"
    />

    <div class="q-mt-md"> Selected: {{ JSON.stringify(selected) }} </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref, useTemplateRef } from 'vue'

const columns = [
  // #region
  {
    name: 'desc',
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

const rows = [
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

const $q = useQuasar()

const selected = ref([])
const lastIndex = ref(null)
const tableRef = useTemplateRef('tableRef')

function getSelectedString() {
  return selected.value.length === 0
    ? ''
    : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${rows.length}`
}

function onSelection({ rows: rowsList, added, evt }) {
  if (rowsList.length === 0 || tableRef.value === void 0) return

  const row = rowsList[0]
  const filteredSortedRows = tableRef.value.filteredSortedRows
  const rowIndex = filteredSortedRows.indexOf(row)
  const localLastIndex = lastIndex.value

  lastIndex.value = rowIndex
  document.getSelection().removeAllRanges()

  if ($q.platform.is.mobile) {
    evt = { ctrlKey: true }
  } else if (
    evt !== Object(evt) ||
    (evt.shiftKey !== true && evt.ctrlKey !== true)
  ) {
    selected.value = added ? rowsList : []
    return
  }

  const operateSelection = added
    ? selRow => {
        const selectedIndex = selected.value.indexOf(selRow)
        if (selectedIndex === -1) {
          selected.value.push(selRow)
        }
      }
    : selRow => {
        const selectedIndex = selected.value.indexOf(selRow)
        if (selectedIndex !== -1) {
          selected.value = [
            ...selected.value.slice(0, selectedIndex),
            ...selected.value.slice(selectedIndex + 1)
          ]
        }
      }

  if (localLastIndex === null || evt.shiftKey !== true) {
    operateSelection(row)
    return
  }

  const from = localLastIndex < rowIndex ? localLastIndex : rowIndex
  const to = localLastIndex < rowIndex ? rowIndex : localLastIndex
  for (let i = from; i <= to; i += 1) {
    operateSelection(filteredSortedRows[i])
  }
}
</script>
```

## Visible columns, custom top, fullscreen

Please note that columns marked as `required` (in the column definition) cannot be toggled and are always visible.

**Example: Visible columns, custom top and fullscreen**

Source: [VisibleColumns.vue](../../examples/QTable/VisibleColumns.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :visible-columns="visibleColumns"
    >
      <template v-slot:top="props">
        <div class="col-2 q-table__title">Treats</div>

        <q-space />

        <div v-if="$q.screen.gt.xs" class="col">
          <q-toggle v-model="visibleColumns" val="calories" label="Calories" />
          <q-toggle v-model="visibleColumns" val="fat" label="Fat" />
          <q-toggle v-model="visibleColumns" val="carbs" label="Carbs" />
          <q-toggle v-model="visibleColumns" val="protein" label="Protein" />
          <q-toggle v-model="visibleColumns" val="sodium" label="Sodium" />
          <q-toggle v-model="visibleColumns" val="calcium" label="Calcium" />
          <q-toggle v-model="visibleColumns" val="iron" label="Iron" />
        </div>
        <q-select
          v-else
          v-model="visibleColumns"
          multiple
          borderless
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          style="min-width: 150px"
        />

        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
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

const rows = [
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

const visibleColumns = ref([
  'calories',
  'desc',
  'fat',
  'carbs',
  'protein',
  'sodium',
  'calcium',
  'iron'
])
</script>
```

**Example: Visible columns**

Source: [VisibleColumns2.vue](../../examples/QTable/VisibleColumns2.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :visible-columns="visibleColumns"
    >
      <template v-slot:top>
        <img
          style="height: 50px; width: 50px"
          src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
        />

        <q-space />

        <q-select
          v-model="visibleColumns"
          multiple
          outlined
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          options-cover
          style="min-width: 150px"
        />
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
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

const rows = [
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

const visibleColumns = ref([
  'calories',
  'desc',
  'fat',
  'carbs',
  'protein',
  'sodium',
  'calcium',
  'iron'
])
</script>
```

## Popup editing

::: tip
Below is an example with the user being able to edit “in place” with the help of **QPopupEdit** component. Please note that we are using the `body` scoped slot. **QPopupEdit** won’t work with cell scoped slots.
:::

**Example: Popup editing**

Source: [PopupEditing.vue](../../examples/QTable/PopupEditing.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="calories" :props="props">
            {{ props.row.calories }}
            <q-popup-edit
              v-model="props.row.calories"
              title="Update calories"
              buttons
              v-slot="scope"
            >
              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
              />
            </q-popup-edit>
          </q-td>
          <q-td key="fat" :props="props">
            <div class="text-pre-wrap">{{ props.row.fat }}</div>
            <q-popup-edit v-model="props.row.fat" v-slot="scope">
              <q-input type="textarea" v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="carbs" :props="props">
            {{ props.row.carbs }}
            <q-popup-edit
              v-model="props.row.carbs"
              title="Update carbs"
              buttons
              persistent
              v-slot="scope"
            >
              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
                hint="Use buttons to close"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
          <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
          <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
          <q-td key="iron" :props="props">{{ props.row.iron }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
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
  {
    name: 'fat',
    label: 'Fat (g)',
    field: 'fat',
    sortable: true,
    style: 'width: 10px'
  },
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

const rows = ref([
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
])
</script>
```

## Editing with an input

**Example: Input editing**

Source: [InputEditing.vue](../../examples/QTable/InputEditing.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <q-input
            v-model.number="props.row[props.col.name]"
            input-class="text-right"
            type="number"
            dense
            borderless
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
  {
    name: 'calories',
    align: 'right',
    label: 'Calories',
    field: 'calories',
    sortable: true
  },
  {
    name: 'fat',
    align: 'right',
    label: 'Fat (g)',
    field: 'fat',
    sortable: true
  },
  { name: 'carbs', align: 'right', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', align: 'right', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', align: 'right', label: 'Sodium (mg)', field: 'sodium' }
  // #endregion
]

const rows = ref([
  // #region
  {
    id: 1,
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    sodium: 87
  },
  {
    id: 2,
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    sodium: 129
  },
  {
    id: 3,
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    sodium: 337
  },
  {
    id: 4,
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413
  }
  // #endregion
])
</script>
```

## Grid style

::: tip
You can use the `grid` prop along with `$q.screen` to create a responsive behavior. Example: `:grid="$q.screen.lt.md"`. More info: [Screen Plugin](/options/screen-plugin).
:::

In the example below, we let QTable deal with displaying the grid mode (not using the specific slot):

**Example: Grid style**

Source: [GridStyle.vue](../../examples/QTable/GridStyle.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      grid
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      hide-header
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  {
    name: 'desc',
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
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' }
]

const rows = [
  // #region
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16,
    carbs: 23
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16,
    carbs: 49
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0,
    carbs: 94
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25,
    carbs: 51
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26,
    carbs: 65
  }
  // #endregion
]

const filter = ref('')
</script>
```

**Example: Grid with header**

Source: [GridHeader.vue](../../examples/QTable/GridHeader.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      grid
      grid-header
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      hide-header
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  {
    name: 'desc',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
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
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' }
]

const rows = [
  // #region
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16,
    carbs: 23
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16,
    carbs: 49
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0,
    carbs: 94
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25,
    carbs: 51
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26,
    carbs: 65
  }
  // #endregion
]

const filter = ref('')
</script>
```

**Example: Colored grid style**

Source: [GridStyleColored.vue](../../examples/QTable/GridStyleColored.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      grid
      flat
      bordered
      card-class="bg-primary text-white"
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      hide-header
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  {
    name: 'desc',
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
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' }
]

const rows = [
  // #region
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16,
    carbs: 23
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16,
    carbs: 49
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0,
    carbs: 94
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25,
    carbs: 51
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26,
    carbs: 65
  }
  // #endregion
]

const filter = ref('')
</script>
```

**Example: Masonry like grid**

Source: [GridMasonry.vue](../../examples/QTable/GridMasonry.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      grid
      flat
      bordered
      :card-container-class="cardContainerClass"
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      hide-header
      v-model:pagination="pagination"
      :rows-per-page-options="rowsPerPageOptions"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered>
            <q-card-section class="text-center">
              Calories for
              <br />
              <strong>{{ props.row.name }}</strong>
            </q-card-section>
            <q-separator />
            <q-card-section
              class="flex flex-center"
              :style="{ fontSize: props.row.calories / 2 + 'px' }"
            >
              <div>{{ props.row.calories }} g</div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'

const deserts = [
  // #region
  'Frozen Yogurt',
  'Ice cream sandwich',
  'Eclair',
  'Cupcake',
  'Gingerbread',
  'Jelly bean',
  'Lollipop',
  'Honeycomb',
  'Donut',
  'KitKat'
  // #endregion
]

const rows = []

deserts.forEach(name => {
  for (let i = 0; i < 24; i++) {
    rows.push({
      name: name + ' (' + i + ')',
      calories: 20 + Math.ceil(50 * Math.random())
    })
  }
})

rows.sort(() => Math.floor(3 * Math.random()) - 1)

const $q = useQuasar()

function getItemsPerPage() {
  if ($q.screen.lt.sm) {
    return 3
  }
  if ($q.screen.lt.md) {
    return 6
  }
  return 9
}

const filter = ref('')
const pagination = ref({
  page: 1,
  rowsPerPage: getItemsPerPage()
})

watch(
  () => $q.screen.name,
  () => {
    pagination.value.rowsPerPage = getItemsPerPage()
  }
)

const columns = [
  { name: 'name', label: 'Name', field: 'name' },
  { name: 'calories', label: 'Calories (g)', field: 'calories' }
]

const cardContainerClass = computed(() =>
  $q.screen.gt.xs
    ? 'grid-masonry grid-masonry--' + ($q.screen.gt.sm ? '3' : '2')
    : null
)

const rowsPerPageOptions = computed(() =>
  $q.screen.gt.xs ? ($q.screen.gt.sm ? [3, 6, 9] : [3, 6]) : [3]
)
</script>

<style lang="sass">
.grid-masonry
  flex-direction: column
  height: 700px

  &--2
    > div
      &:nth-child(2n + 1)
        order: 1
      &:nth-child(2n)
        order: 2

    &:before
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 1
  &--3
    > div
      &:nth-child(3n + 1)
        order: 1
      &:nth-child(3n + 2)
        order: 2
      &:nth-child(3n)
        order: 3

    &:before,
    &:after
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 2
</style>
```

However, if you want to fully customize the content, check the example below, where:

- We are using a Vue scoped slot called `item` to define how each record (the equivalent of a row in non-grid mode) should look. This allows you total freedom.
- We are using multiple selection.

**Example: Grid style with slot**

Source: [GridStyleSlot.vue](../../examples/QTable/GridStyleSlot.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
      :filter="filter"
      grid
      hide-header
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card
            bordered
            flat
            :class="
              props.selected
                ? $q.dark.isActive
                  ? 'bg-grey-9'
                  : 'bg-grey-2'
                : ''
            "
          >
            <q-card-section>
              <q-checkbox
                dense
                v-model="props.selected"
                :label="props.row.name"
              />
            </q-card-section>
            <q-separator />
            <q-list dense>
              <q-item
                v-for="col in props.cols.filter(col => col.name !== 'desc')"
                :key="col.name"
              >
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
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

const rows = [
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
    name: 'Ice cream',
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

const filter = ref('')
const selected = ref([])
</script>

<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s
</style>
```

## Expanding rows

::: warning
Add unique (distinct) `key` on QTr if you generate more than one QTr from a row in data.
:::

**Example: Internal expansion model**

Source: [ExpandedRowInternal.vue](../../examples/QTable/ExpandedRowInternal.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="sm"
              color="accent"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left"
              >This is expand slot for row above: {{ props.row.name }}.</div
            >
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>
```

An external expansion model can also be used:

**Example: External expansion model**

Source: [ExpandedRowExternal.vue](../../examples/QTable/ExpandedRowExternal.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      v-model:expanded="expanded"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />

          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-toggle
              v-model="props.expand"
              checked-icon="add"
              unchecked-icon="remove"
            />
          </q-td>

          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left"
              >This is expand slot for row above: {{ props.row.name }}.</div
            >
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
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

const rows = [
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

const expanded = ref([
  // Array of row keys
  'Ice cream sandwich'
])
</script>
```

If you are using virtual scroll with QTable, you should know that there are 2 utility CSS classes that control VirtualScroll size calculation:

- Use `q-virtual-scroll--with-prev` class on an element rendered by the VirtualScroll to indicate that the element should be grouped with the previous one (main use case is for multiple table rows generated from the same row of data).
- Use `q-virtual-scroll--skip` class on an element rendered by the VirtualScroll to indicate that the element's size should be ignored in size calculations.

**Example: Virtual scroll with expansion model**

Source: [VirtscrollExpandedRow.vue](../../examples/QTable/VirtscrollExpandedRow.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      style="height: 400px"
      flat
      bordered
      ref="tableRef"
      title="Treats"
      :rows="rows"
      :columns="columns"
      :table-colspan="9"
      row-key="index"
      virtual-scroll
      :virtual-scroll-item-size="48"
      :pagination="pagination"
      :rows-per-page-options="[0]"
      v-model:expanded="expanded"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />

          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" :key="`m_${props.row.index}`">
          <q-td auto-width>
            <q-toggle
              v-model="props.expand"
              checked-icon="add"
              unchecked-icon="remove"
              :label="`Index: ${props.row.index}`"
            />
          </q-td>

          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr
          v-show="props.expand"
          :props="props"
          :key="`e_${props.row.index}`"
          class="q-virtual-scroll--with-prev"
        >
          <q-td colspan="100%">
            <div class="text-left"
              >This is expand slot for row above: {{ props.row.name }} (Index:
              {{ props.row.index }}).</div
            >
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { onMounted, ref, useTemplateRef } from 'vue'

const columns = [
  // #region
  {
    name: 'desc',
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
  {
    name: 'fat',
    label: 'Fat (g)',
    field: 'fat',
    sortable: true,
    style: 'width: 10px'
  },
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

const seedSize = seed.length

const rows = []
for (let i = 0; i < 1000; i++) {
  rows.push(...seed.map((r, j) => ({ ...r, index: i * seedSize + j + 1 })))
}

const initialExpanded = rows.filter((r, i) => i % 3 === 0).map(r => r.index)

const expanded = ref(initialExpanded)
const tableRef = useTemplateRef('tableRef')
const pagination = { rowsPerPage: 0 }

onMounted(() => {
  tableRef.value.scrollTo(5000)
})
</script>
```

::: tip
An expanded row is just another `QTr` rendered for the same row of data, so the same rules from "Virtual scrolling" apply: give it its own unique `key` and the `q-virtual-scroll--with-prev` class, so its height is added to the main row when VirtualScroll calculates sizes — even while it's hidden with `v-show`.
:::

## Before/after slots

**Example: Before/After slots (header/footer)**

Source: [BeforeAfterHeaderFooter.vue](../../examples/QTable/BeforeAfterHeaderFooter.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
    >
      <template v-slot:top> Top </template>
      <template v-slot:top-row>
        <q-tr>
          <q-td colspan="100%"> Top row </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom-row>
        <q-tr>
          <q-td colspan="100%"> Bottom row </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom> Bottom </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
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

const rows = [
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

const selected = ref([])
</script>
```

## Pagination

::: tip
When `pagination` has a property named `rowsNumber`, then this means that you’ll be configuring Table for **server**-side pagination (& sorting & filtering). See _"Server side pagination, filter and sorting"_ section.
:::

Below are two examples of handling the pagination (and sorting and rows per page).

The first example highlights how to configure the initial pagination:

**Example: Initial pagination**

Source: [PaginationInitial.vue](../../examples/QTable/PaginationInitial.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :pagination="initialPagination"
    />
  </div>
</template>

<script setup>
const columns = [
  // #region
  {
    name: 'desc',
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

const rows = [
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

const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 2,
  rowsPerPage: 3
  // rowsNumber: xx if getting data from a server
}
</script>
```

The second example uses the "v-model:pagination" directive because we want to access its current value at any time. A use-case for the technique below can be to control the pagination from outside of QTable.

**Example: Synchronized pagination**

Source: [PaginationSync.vue](../../examples/QTable/PaginationSync.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      v-model:pagination="pagination"
      hide-pagination
    />

    <div class="row justify-center q-mt-md">
      <q-pagination
        v-model="pagination.page"
        color="grey-8"
        :max="pagesNumber"
        size="sm"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const columns = [
  {
    name: 'desc',
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
  { name: 'protein', label: 'Protein (g)', field: 'protein' }
]

const rows = [
  // #region
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7
  }
  // #endregion
]

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 2,
  rowsPerPage: 3
  // rowsNumber: xx if getting data from a server
})

const pagesNumber = computed(() =>
  Math.ceil(rows.length / pagination.value.rowsPerPage)
)
</script>
```

## Pagination slot

For learning purposes, we will customize the pagination controls with the default controls in order to help you get started with your own.

**Example: Pagination slot**

Source: [PaginationSlot.vue](../../examples/QTable/PaginationSlot.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      v-model:pagination="pagination"
    >
      <template v-slot:pagination="scope">
        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="first_page"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isFirstPage"
          @click="scope.firstPage"
        />

        <q-btn
          icon="chevron_left"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isFirstPage"
          @click="scope.prevPage"
        />

        <q-btn
          icon="chevron_right"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isLastPage"
          @click="scope.nextPage"
        />

        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="last_page"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isLastPage"
          @click="scope.lastPage"
        />
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const columns = [
  // #region
  {
    name: 'desc',
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

const rows = [
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

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 2,
  rowsPerPage: 3
  // rowsNumber: xx if getting data from a server
})

const pagesNumber = computed(() =>
  Math.ceil(rows.length / pagination.value.rowsPerPage)
)
</script>
```

## Loading state

**Example: Default loading**

Source: [Loading.vue](../../examples/QTable/Loading.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-toggle v-model="loading" label="Loading state" class="q-mb-md" />
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      color="primary"
      row-key="name"
      :loading="loading"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
  {
    name: 'desc',
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

const rows = [
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

const loading = ref(false)
</script>
```

**Example: Custom loading state**

Source: [CustomLoading.vue](../../examples/QTable/CustomLoading.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-toggle v-model="loading" label="Loading state" class="q-mb-md" />
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      color="primary"
      row-key="name"
      :loading="loading"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
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

const rows = [
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

const loading = ref(false)
</script>
```

## Custom top

**Example: Custom top with add/remove row**

Source: [CustomTop.vue](../../examples/QTable/CustomTop.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :loading="loading"
    >
      <template v-slot:top>
        <q-btn
          color="primary"
          :disable="loading"
          label="Add row"
          @click="addRow"
        />
        <q-btn
          v-if="rows.length !== 0"
          class="q-ml-sm"
          color="primary"
          :disable="loading"
          label="Remove row"
          @click="removeRow"
        />
        <q-space />
        <q-input
          borderless
          dense
          debounce="300"
          color="primary"
          v-model="filter"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  // #region
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

const originalRows = [
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

const loading = ref(false)
const filter = ref('')
const rowCount = ref(10)
const rows = ref([...originalRows])

// emulate fetching data from server
function addRow() {
  loading.value = true
  setTimeout(() => {
    const index = Math.floor(Math.random() * (rows.value.length + 1)),
      row = originalRows[Math.floor(Math.random() * originalRows.length)]

    if (rows.value.length === 0) {
      rowCount.value = 0
    }

    row.id = ++rowCount.value
    const newRow = { ...row } // extend({}, row, { name: `${row.name} (${row.__count})` })
    rows.value = [
      ...rows.value.slice(0, index),
      newRow,
      ...rows.value.slice(index)
    ]
    loading.value = false
  }, 500)
}

function removeRow() {
  loading.value = true
  setTimeout(() => {
    const index = Math.floor(Math.random() * rows.value.length)
    rows.value = [...rows.value.slice(0, index), ...rows.value.slice(index + 1)]
    loading.value = false
  }, 500)
}
</script>
```

## Body slots

The example below shows how you can use a slot to customize the entire row:

**Example: Body slot**

Source: [SlotBody.vue](../../examples/QTable/SlotBody.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body="props">
        <q-tr :props="props" @click="onRowClick(props.row)">
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="calories" :props="props">
            <q-badge color="green">
              {{ props.row.calories }}
            </q-badge>
          </q-td>
          <q-td key="fat" :props="props">
            <q-badge color="purple">
              {{ props.row.fat }}
            </q-badge>
          </q-td>
          <q-td key="carbs" :props="props">
            <q-badge color="orange">
              {{ props.row.carbs }}
            </q-badge>
          </q-td>
          <q-td key="protein" :props="props">
            <q-badge color="primary">
              {{ props.row.protein }}
            </q-badge>
          </q-td>
          <q-td key="sodium" :props="props">
            <q-badge color="teal">
              {{ props.row.sodium }}
            </q-badge>
          </q-td>
          <q-td key="calcium" :props="props">
            <q-badge color="accent">
              {{ props.row.calcium }}
            </q-badge>
          </q-td>
          <q-td key="iron" :props="props">
            <q-badge color="amber">
              {{ props.row.iron }}
            </q-badge>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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

const onRowClick = row => alert(`${row.name} clicked`)
</script>
```

Below, we use a slot which gets applied to each body cell:

**Example: Body-cell slot**

Source: [SlotBodyCell.vue](../../examples/QTable/SlotBodyCell.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <q-badge color="blue" :label="props.value" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>
```

You can also customize a particular column. The syntax for this slot is `body-cell-[name]`, where `[name]` is the column's `name` from the `columns` definition.

**Example: Body-cell-[name] slot**

Source: [SlotBodyCellName.vue](../../examples/QTable/SlotBodyCellName.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <div>
            <q-badge color="purple" :label="props.value" />
          </div>
          <div class="my-table-details">
            {{ props.row.details }}
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>

<style>
.my-table-details {
  font-size: 0.85em;
  font-style: italic;
  max-width: 200px;
  white-space: normal;
  color: #555;
  margin-top: 4px;
}
</style>
```

## Header slots

The example below shows how you can use a slot to customize the entire header row:

**Example: Header slot**

Source: [SlotHeader.vue](../../examples/QTable/SlotHeader.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-italic text-purple"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>
```

Below, we use a slot which gets applied to each header cell:

**Example: Header-cell slot**

Source: [SlotHeaderCell.vue](../../examples/QTable/SlotHeaderCell.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:header-cell="props">
        <q-th :props="props">
          <q-icon name="lock_open" size="1.5em" />
          {{ props.col.label }}
        </q-th>
      </template>
    </q-table>
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>
```

You can also customize a particular header cell. The syntax for this slot is `header-cell-[name]`, where `[name]` is the column's `name` from the `columns` definition.

**Example: Header-cell-[name] slot**

Source: [SlotHeaderCellName.vue](../../examples/QTable/SlotHeaderCellName.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:header-cell-calories="props">
        <q-th :props="props">
          <q-icon name="thumb_up" size="1.5em" />
          {{ props.col.label }}
        </q-th>
      </template>
    </q-table>
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>
```

## No data

**Example: No Data Label**

Source: [NoData.vue](../../examples/QTable/NoData.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      no-data-label="I didn't find anything for you"
      row-key="name"
    />
  </div>
</template>

<script setup>
const rows = []
const columns = [
  // #region
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
</script>
```

There is also a "no-data" scoped slot (see below) that you can also to customize the messages for both when a filter doesn't returns any results or the table has no data to display. Also type something into the "Search" input.

**Example: No Data Slot**

Source: [NoDataSlot.vue](../../examples/QTable/NoDataSlot.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      :filter="filter"
      no-data-label="I didn't find anything for you"
      no-results-label="The filter didn't uncover any results"
      row-key="name"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span> Well this is sad... {{ message }} </span>
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const rows = []
const filter = ref('')
const columns = [
  // #region
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
</script>
```

## Handling bottom layer

There are a few properties that you can use to hide the bottom layer or specific parts of it. You can play with it below:

**Example: Hiding bottom layer**

Source: [HideBottom.vue](../../examples/QTable/HideBottom.vue)

```vue
<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-toggle label="Fill with data" v-model="hasData" />
      <q-toggle label="Hide no data" v-model="hideNoData" />
      <q-toggle label="Hide bottom layer" v-model="hideBottom" />
      <q-toggle label="Hide pagination" v-model="hidePagination" />
      <q-toggle
        label="Hide selected rows banner"
        v-model="hideSelectedBanner"
      />
    </div>

    <q-table
      flat
      bordered
      title="Treats"
      :rows="records"
      :columns="columns"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
      :hide-bottom="hideBottom"
      :hide-selected-banner="hideSelectedBanner"
      :hide-no-data="hideNoData"
      :hide-pagination="hidePagination"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const columns = [
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
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' }
]

const rows = [
  // #region
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16,
    carbs: 23
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16,
    carbs: 49
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0,
    carbs: 94
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25,
    carbs: 51
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26,
    carbs: 65
  }
  // #endregion
]

const hasData = ref(true)
const hideBottom = ref(false)
const hideSelectedBanner = ref(false)
const hideNoData = ref(false)
const hidePagination = ref(false)
const selected = ref([rows[1]])
const records = computed(() => (hasData.value ? rows : []))
</script>
```

## Custom sorting

**Example: Custom sorting**

Source: [CustomSorting.vue](../../examples/QTable/CustomSorting.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :sort-method="customSort"
      binary-state-sort
    />
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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

function customSort(rowsList, sortBy, descending) {
  const data = [...rowsList]

  if (sortBy) {
    data.sort((a, b) => {
      const x = descending ? b : a
      const y = descending ? a : b

      return sortBy === 'name'
        ? // string sort
          x[sortBy] > y[sortBy]
          ? 1
          : x[sortBy] < y[sortBy]
            ? -1
            : 0
        : // numeric sort
          Number.parseFloat(x[sortBy]) - Number.parseFloat(y[sortBy])
    })
  }

  return data
}
</script>
```

## Responsive tables

In order to create responsive tables, we have two tools at our disposal: `dense` and `grid` properties. We can connect these with `$q.screen`. More info: [Screen Plugin](/options/screen-plugin).

First example below uses `$q.screen.lt.md` (for enabling dense mode) and the second examples uses `$q.screen.xs` to enable grid mode, so play with browser width to see them in action.

**Example: Using dense prop**

Source: [ResponsiveDense.vue](../../examples/QTable/ResponsiveDense.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      :dense="$q.screen.lt.md"
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script setup>
const columns = [
  // #region
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

const rows = [
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
</script>
```

**Example: Using grid prop**

Source: [ResponsiveGrid.vue](../../examples/QTable/ResponsiveGrid.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      :grid="$q.screen.xs"
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      hide-header
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  {
    name: 'desc',
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
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' }
]

const rows = [
  // #region
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16,
    carbs: 23
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16,
    carbs: 49
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0,
    carbs: 94
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25,
    carbs: 51
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26,
    carbs: 65
  }
  // #endregion
]

const filter = ref('')
</script>
```

## Server side pagination, filter and sorting

When your database contains a big number of rows for a Table, obviously it’s not feasible to load them all for multiple reasons (memory, UI rendering performance, …). Instead, you can load only a Table page. Whenever the user wants to navigate to another Table page, or wants to sort by a column or wants to filter the Table, a **request** is sent to the **server** to fetch the partially paged data.

1. First step to enable this behavior is to specify `pagination` prop, which MUST contain `rowsNumber`. QTable needs to know the total number of rows available in order to correctly render the pagination links. Should filtering cause the `rowsNumber` to change then it must be modified dynamically.

2. Second step is to listen for `@request` event on QTable. This event is triggered when data needs to be fetched from the **server** because either page number or sorting or filtering changed.

3. It’s best that you also specify the `loading` prop in order to notify the user that a background process is in progress.

::: tip
In the example below, steps have been taken to emulate an ajax call to a server. While the concepts are similar, if you use this code you will need to make the appropriate changes to connect to your own data source.
:::

**Example: Synchronizing with server**

Source: [Synchronizing.vue](../../examples/QTable/Synchronizing.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      ref="tableRef"
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      binary-state-sort
      @request="onRequest"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { onMounted, ref, useTemplateRef } from 'vue'

const columns = [
  // #region
  {
    name: 'desc',
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
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs', sortable: true },
  { name: 'protein', label: 'Protein (g)', field: 'protein', sortable: true },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium', sortable: true },
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

const originalRows = [
  // #region
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
    name: 'KitKat',
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  },
  {
    id: 11,
    name: 'Frozen Yogurt-1',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    id: 12,
    name: 'Ice cream sandwich-1',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    id: 13,
    name: 'Eclair-1',
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    id: 14,
    name: 'Cupcake-1',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    id: 15,
    name: 'Gingerbread-1',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    id: 16,
    name: 'Jelly bean-1',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    id: 17,
    name: 'Lollipop-1',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    id: 18,
    name: 'Honeycomb-1',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    id: 19,
    name: 'Donut-1',
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    id: 20,
    name: 'KitKat-1',
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  },
  {
    id: 21,
    name: 'Frozen Yogurt-2',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    id: 22,
    name: 'Ice cream sandwich-2',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    id: 23,
    name: 'Eclair-2',
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    id: 24,
    name: 'Cupcake-2',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    id: 25,
    name: 'Gingerbread-2',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    id: 26,
    name: 'Jelly bean-2',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    id: 27,
    name: 'Lollipop-2',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    id: 28,
    name: 'Honeycomb-2',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    id: 29,
    name: 'Donut-2',
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    id: 30,
    name: 'KitKat-2',
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  },
  {
    id: 31,
    name: 'Frozen Yogurt-3',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    id: 32,
    name: 'Ice cream sandwich-3',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    id: 33,
    name: 'Eclair-3',
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    id: 34,
    name: 'Cupcake-3',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    id: 35,
    name: 'Gingerbread-3',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    id: 36,
    name: 'Jelly bean-3',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    id: 37,
    name: 'Lollipop-3',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    id: 38,
    name: 'Honeycomb-3',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    id: 39,
    name: 'Donut-3',
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    id: 40,
    name: 'KitKat-3',
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

const tableRef = useTemplateRef('tableRef')
const rows = ref([])
const filter = ref('')
const loading = ref(false)
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 3,
  rowsNumber: 10
})

// emulate ajax call
// SELECT * FROM ... WHERE...LIMIT...
function fetchFromServer(startRow, count, filterStr, sortBy, descending) {
  const data = filterStr
    ? originalRows.filter(row => row.name.includes(filterStr))
    : [...originalRows]

  // handle sortBy
  if (sortBy) {
    const sortFn =
      sortBy === 'desc'
        ? descending
          ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
          : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
        : descending
          ? (a, b) =>
              Number.parseFloat(b[sortBy]) - Number.parseFloat(a[sortBy])
          : (a, b) =>
              Number.parseFloat(a[sortBy]) - Number.parseFloat(b[sortBy])
    data.sort(sortFn)
  }

  return data.slice(startRow, startRow + count)
}

// emulate 'SELECT count(*) FROM ...WHERE...'
function getRowsNumberCount(filterStr) {
  if (!filterStr) {
    return originalRows.length
  }
  let count = 0
  originalRows.forEach(treat => {
    if (treat.name.includes(filterStr)) {
      ++count
    }
  })
  return count
}

function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  const filterStr = props.filter

  loading.value = true

  // emulate server
  setTimeout(() => {
    // update rowsCount with appropriate value
    pagination.value.rowsNumber = getRowsNumberCount(filterStr)

    // get all rows if "All" (0) is selected
    const fetchCount =
      rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage

    // calculate starting row of data
    const startRow = (page - 1) * rowsPerPage

    // fetch data from "server"
    const returnedData = fetchFromServer(
      startRow,
      fetchCount,
      filterStr,
      sortBy,
      descending
    )

    // clear out existing data and add new
    rows.value.splice(0, rows.value.length, ...returnedData)

    // don't forget to update local pagination object
    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending

    // ...and turn of loading indicator
    loading.value = false
  }, 1500)
}

onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction()
})
</script>
```

## Exporting data

Below is an example of a naive csv encoding and then exporting table data by using the [exportFile](/quasar-utils/other-utils#export-file) Quasar util. The browser should trigger a file download. For a more professional approach in regards to encoding we do recommend using [csv-parse](https://csv.js.org/parse/) and [csv-stringify](https://csv.js.org/stringify/) packages.

::: tip
You could also make use of the `filteredSortedRows` internal computed property of QTable should you want to export the user filtered + sorted data.
:::

**Example: Export to csv**

Source: [ExportCsv.vue](../../examples/QTable/ExportCsv.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      color="primary"
      row-key="name"
    >
      <template v-slot:top-right>
        <q-btn
          color="primary"
          icon-right="archive"
          label="Export to csv"
          no-caps
          @click="exportTable"
        />
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { exportFile, useQuasar } from 'quasar'

const columns = [
  // #region
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

const rows = [
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

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val

  formatted =
    formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

const $q = useQuasar()

function exportTable() {
  // naive encoding to csv format
  const content = [
    ...columns.map(col => wrapCsvValue(col.label)),
    ...rows.map(row =>
      columns
        .map(col =>
          wrapCsvValue(
            typeof col.field === 'function'
              ? col.field(row)
              : row[col.field === void 0 ? col.name : col.field],
            col.format,
            row
          )
        )
        .join(',')
    )
  ].join('\r\n')

  const status = exportFile('table-export.csv', content, 'text/csv')

  if (status !== true) {
    $q.notify({
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning'
    })
  }
}
</script>
```

## Keyboard navigation

Below is an example of keyboard navigation in the table using selected row. Use `ArrowUp`, `ArrowDown`, `PageUp`, `PageDown`, `Home` and `End` keys to navigate.

**Example: Keyboard navigation**

Source: [KeyboardNavigation.vue](../../examples/QTable/KeyboardNavigation.vue)

```vue
<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      ref="tableRef"
      :class="tableClass"
      tabindex="0"
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      selection="single"
      v-model:selected="selected"
      v-model:pagination="pagination"
      :filter="filter"
      @focusin="activateNavigation"
      @focusout="deactivateNavigation"
      @keydown="onKey"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, toRaw, useTemplateRef } from 'vue'

const columns = [
  // #region
  {
    name: 'desc',
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

const rows = [
  // #region
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
    name: 'KitKat',
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  },
  {
    id: 11,
    name: 'Frozen Yogurt-1',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    id: 12,
    name: 'Ice cream sandwich-1',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    id: 13,
    name: 'Eclair-1',
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    id: 14,
    name: 'Cupcake-1',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    id: 15,
    name: 'Gingerbread-1',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    id: 16,
    name: 'Jelly bean-1',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    id: 17,
    name: 'Lollipop-1',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    id: 18,
    name: 'Honeycomb-1',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    id: 19,
    name: 'Donut-1',
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    id: 20,
    name: 'KitKat-1',
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  },
  {
    id: 21,
    name: 'Frozen Yogurt-2',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    id: 22,
    name: 'Ice cream sandwich-2',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    id: 23,
    name: 'Eclair-2',
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    id: 24,
    name: 'Cupcake-2',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    id: 25,
    name: 'Gingerbread-2',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    id: 26,
    name: 'Jelly bean-2',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    id: 27,
    name: 'Lollipop-2',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    id: 28,
    name: 'Honeycomb-2',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    id: 29,
    name: 'Donut-2',
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    id: 30,
    name: 'KitKat-2',
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  },
  {
    id: 31,
    name: 'Frozen Yogurt-3',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    id: 32,
    name: 'Ice cream sandwich-3',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    id: 33,
    name: 'Eclair-3',
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    id: 34,
    name: 'Cupcake-3',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    id: 35,
    name: 'Gingerbread-3',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    id: 36,
    name: 'Jelly bean-3',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    id: 37,
    name: 'Lollipop-3',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    id: 38,
    name: 'Honeycomb-3',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    id: 39,
    name: 'Donut-3',
    calories: 452,
    fat: 25,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    id: 40,
    name: 'KitKat-3',
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

const tableRef = useTemplateRef('tableRef')

const navigationActive = ref(false)
const pagination = ref({})
const selected = ref([])
const filter = ref('')

const tableClass = computed(() =>
  navigationActive.value ? 'shadow-8 no-outline' : null
)

function activateNavigation() {
  navigationActive.value = true
}

function deactivateNavigation() {
  navigationActive.value = false
}

function onKey(evt) {
  if (
    !navigationActive.value ||
    ![33, 34, 35, 36, 38, 40].includes(evt.keyCode) ||
    !tableRef.value
  ) {
    return
  }

  evt.preventDefault()

  const { computedRowsNumber, computedRows } = tableRef.value

  if (computedRows.length === 0) return

  const currentIndex =
    selected.value.length !== 0
      ? computedRows.indexOf(toRaw(selected.value[0]))
      : -1
  const currentPage = pagination.value.page
  const rowsPerPage =
    pagination.value.rowsPerPage === 0
      ? computedRowsNumber
      : pagination.value.rowsPerPage
  const lastIndex = computedRows.length - 1
  const lastPage = Math.ceil(computedRowsNumber / rowsPerPage)

  let index = currentIndex
  let page = currentPage

  switch (evt.keyCode) {
    case 36: {
      // Home
      page = 1
      index = 0
      break
    }
    case 35: {
      // End
      page = lastPage
      index = rowsPerPage - 1
      break
    }
    case 33: {
      // PageUp
      page = currentPage <= 1 ? lastPage : currentPage - 1
      if (index < 0) {
        index = 0
      }
      break
    }
    case 34: {
      // PageDown
      page = currentPage >= lastPage ? 1 : currentPage + 1
      if (index < 0) {
        index = rowsPerPage - 1
      }
      break
    }
    case 38: {
      // ArrowUp
      if (currentIndex <= 0) {
        page = currentPage <= 1 ? lastPage : currentPage - 1
        index = rowsPerPage - 1
      } else {
        index = currentIndex - 1
      }
      break
    }
    case 40: {
      // ArrowDown
      if (currentIndex >= lastIndex) {
        page = currentPage >= lastPage ? 1 : currentPage + 1
        index = 0
      } else {
        index = currentIndex + 1
      }
      break
    }
  }

  if (page !== pagination.value.page) {
    pagination.value.page = page

    nextTick(() => {
      const { computedRows: computedRowsList } = tableRef.value
      selected.value = [
        computedRowsList[Math.min(index, computedRowsList.length - 1)]
      ]
      tableRef.value.$el.focus()
    })
  } else {
    selected.value = [computedRows[index]]
  }
}
</script>
```
