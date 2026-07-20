---
title: Flexbox Patterns
description: Common recipes for working with flexbox CSS is and how it can be used in a Quasar App.
canonical: https://quasar.dev/layout/grid/flexbox-patterns
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

Here are some common patterns for using [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/). Some more info can be found at [Tobias Ahlin Blog](https://tobiasahlin.com/blog/).

## Flex row / column break

You can define a CSS class that would force the element it is applied on to create a row / column break in a flex layout.

```sass
.flex-break
  flex: 1 0 100% !important
.row
  .flex-break
    height: 0 !important
.column
  .flex-break
    width: 0 !important
```

Take care not to use `no-wrap` when defining the flex container, and insert a `div` with class `flex-break` where you need.

::: tip
You can use `q-py-##` on row breaking elements or `q-px-##` on column breaking elements to increase the space.
:::

```html
<div class="row">
  <div>Col 1 / Row 1</div>
  <div>Col 2 / Row 1</div>
  <div class="flex-break"></div>
  <div>Col 1 / Row 2</div>
  <div class="flex-break q-py-md"></div>
  <div>Col 1 / Row 3</div>
  <div>Col 2 / Row 3</div>
  <div>Col 3 / Row 3</div>
</div>
```

**Example: Row break**

Source: [BreakRow.vue](../../../examples/grid/BreakRow.vue)

````vue
<template>
  <div class="q-pa-md example-break-row">
    <div class="row items-start example-container">
      <div class="example-cell" tabindex="0">Col 1 / Row 1</div>
      <div class="example-cell col-6" tabindex="0"
        >Col 2 / Row 1 - 1<br />Col 2 / Row 1 - 2</div
      >
      <div class="flex-break"></div>
      <div class="example-cell" tabindex="0">Col 1 / Row 2</div>
      <div class="flex-break q-py-md"></div>
      <div class="example-cell col-4" tabindex="0">Col 1 / Row 3</div>
      <div class="example-cell" tabindex="0">Col 2 / Row 3</div>
      <div class="example-cell" tabindex="0">Col 3 / Row 3</div>
    </div>
  </div>
</template>

<style lang="sass">
.example-break-row
  .flex-break
    flex: 1 0 100% !important
    height: 0 !important

  .example-container
    .example-cell
      margin: 1px
      padding: 4px 8px
      box-shadow: inset 0 0 0 2px #9e9e9e
</style>
````

::: warning
When using `column` type flex you must define a height for the container. The height must be large enough to hold the longest column.
:::

**Example: Column break**

Source: [BreakColumn.vue](../../../examples/grid/BreakColumn.vue)

````vue
<template>
  <div class="q-pa-md example-break-column">
    <div class="column inline items-start example-container">
      <div class="example-cell" tabindex="0">Col 1 / Row 1</div>
      <div class="example-cell" tabindex="0"
        >Col 2 / Row 1 - 1<br />Col 2 / Row 1 - 2</div
      >
      <div class="flex-break"></div>
      <div class="example-cell" tabindex="0">Col 1 / Row 2</div>
      <div class="flex-break q-px-md"></div>
      <div class="example-cell" tabindex="0">Col 1 / Row 3</div>
      <div class="example-cell" tabindex="0">Col 2 / Row 3</div>
      <div class="example-cell" tabindex="0">Col 3 / Row 3</div>
    </div>
  </div>
</template>

<style lang="sass">
.example-break-column
  .flex-break
    flex: 1 0 100% !important
    width: 0 !important

  .example-container
    height: 100px

    .example-cell
      margin: 1px
      padding: 4px 8px
      box-shadow: inset 0 0 0 2px #9e9e9e
</style>
````

## Masonry-like layout

When using a `column` type flex with multiple columns the visual order of the elements will be in vertical columns. Sometimes you want the order to follow the rows in the layout, and in order to achieve this you can use a combination or custom order CSS styles and column break elements.

::: warning
You must know how many columns you want use for the layout. Also for best visual aspect the elements in the layout should be close in height one to the others.
:::

The general CSS formula for `$x` number of columns is:

```scss
$x: 3;

@for $i from 1 through ($x - 1) {
  .item:nth-child(#{$x}n + #{$i}) {
    order: #{$i};
  }
}

.item:nth-child(#{$x}n) {
  order: #{$x};
}
```

Example, supposing you want a 4 column layout:

```sass
.item:nth-child(4n+1)
  order: 1
.item:nth-child(4n+2)
  order: 2
.item:nth-child(4n+3)
  order: 3
.item:nth-child(4n)
  order: 4
```

For the HTML there are some requirements that should be followed:

- the flex column container must have a height defined
- the column breaking elements must be placed at the start
- the column breaking elements must be as many as the columns
- the first column breaking element must be hidden (class `hidden` or style `display: none`)

Example, supposing you want a 4 column layout:

```html
<div class="column">
  <div class="flex-break hidden"></div>
  <div class="flex-break"></div>
  <div class="flex-break"></div>
  <div class="flex-break"></div>

  <div>Cell 1</div>
  <div>Cell 2</div>
  ...
  <div>Cell last</div>
</div>
```

**Example: Masonry**

Source: [Masonry.vue](../../../examples/grid/Masonry.vue)

````vue
<template>
  <div class="q-pa-md example-masonry">
    <q-btn
      class="q-mb-md"
      color="primary"
      label="Regenerate layout"
      @click="onClick"
    />

    <div class="column example-container">
      <div class="flex-break hidden"></div>
      <div class="flex-break"></div>
      <div class="flex-break"></div>
      <div class="flex-break"></div>

      <div
        v-for="(cell, i) in cells"
        :key="i"
        class="example-cell"
        tabindex="0"
      >
        <div>
          <div v-for="(text, j) in cell" :key="j">
            {{ text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const generateCells = () =>
  Array.from({ length: 24 }, (item, cell) =>
    Array.from(
      { length: 2 + Math.ceil(3 * Math.random()) },
      (entry, text) => `Cell ${cell + 1} - ${text + 1}`
    )
  )

const cells = ref(generateCells())

function onClick() {
  cells.value = generateCells()
}
</script>

<style lang="sass">
.example-masonry
  .flex-break
    flex: 1 0 100% !important
    width: 0 !important

  $x: 4

  @for $i from 1 through ($x - 1)
    .example-container > div:nth-child(#{$x}n + #{$i})
      order: #{$i}

  .example-container > div:nth-child(#{$x}n)
    order: #{$x}

  .example-container
    height: 700px

    .example-cell
      width: 25%
      padding: 1px

      > div
        padding: 4px 8px
        box-shadow: inset 0 0 0 2px #9e9e9e
</style>
````

## Masonry with pseudo selectors to break rows / columns

When it's not easy or not possible to insert the elements for row / column break and you need 2 or 3 rows / column you can use pseudo selectors.

```sass
.container-class
  &--2-rows
    :before
      flex: 1 0 100% !important
      height: 0 !important
      order: 1
  &--2-columns
    :before
      flex: 1 0 100% !important
      width: 0 !important
      order: 1
  &--3-rows
    :before,
    :after
      flex: 1 0 100% !important
      height: 0 !important
      order: 2
  &--3-columns
    :before,
    :after
      flex: 1 0 100% !important
      width: 0 !important
      order: 2
```

**Example: Masonry like table grid**

Source: [MasonryTableGrid.vue](../../../examples/grid/MasonryTableGrid.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-table
      grid
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
          <q-card>
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

rows.sort(() => -1 + Math.floor(3 * Math.random()))

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
    ? 'example-masonry-table-grid example-masonry-table-grid--' +
      ($q.screen.gt.sm ? '3' : '2')
    : null
)

const rowsPerPageOptions = computed(() =>
  $q.screen.gt.xs ? ($q.screen.gt.sm ? [3, 6, 9] : [3, 6]) : [3]
)
</script>

<style lang="sass">
.example-masonry-table-grid
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
````
