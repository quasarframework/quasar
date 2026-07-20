---
title: Grid Column
description: How to use the Quasar grid for columns.
canonical: https://quasar.dev/layout/grid/column
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

In the hope that you've previously read the [Introduction to Flexbox](/layout/grid/introduction-to-flexbox) theory, let's get deeper into Columns.

Utilize breakpoint-specific row classes for equal-height rows. Add any number of unit-less classes for each breakpoint you need and every row will be the same height.

## Equal-height

For example, here are two grid layouts that apply to every device and viewport, from xs to xl.

**Example: Equal Height Example**

Source: [ColumnEqualWidth.vue](../../../examples/grid/ColumnEqualWidth.vue)

```vue
<template>
  <div class="q-pa-md example-column-equal-width">
    <div class="column" style="height: 150px">
      <div class="col"> 1 of 2 </div>
      <div class="col"> 1 of 2 </div>
    </div>

    <div class="column" style="height: 150px">
      <div class="col"> 1 of 3 </div>
      <div class="col"> 1 of 3 </div>
      <div class="col"> 1 of 3 </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-column-equal-width
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
```

## Setting one row height

Auto-layout for flexbox grid rows also means you can set the height of one row and the others will automatically resize around it. You may use predefined grid classes (as shown below) or inline heights. Note that the other rows will resize no matter the height of the center row.

**Example: Setting one row height**

Source: [ColumnRowWidth.vue](../../../examples/grid/ColumnRowWidth.vue)

```vue
<template>
  <div class="q-pa-md example-column-row-width">
    <div class="column" style="height: 150px">
      <div class="col"> .col </div>
      <div class="col-5"> .col-5 </div>
      <div class="col"> .col </div>
    </div>

    <div class="column" style="height: 250px">
      <div class="col"> .col </div>
      <div class="col-8"> .col-8 </div>
      <div class="col"> .col </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-column-row-width
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
```

## Variable height content

Using the `col-{breakpoint}-auto` classes, rows can size itself based on the natural height of its content. This is super handy with single line content like inputs, numbers, etc. This, in conjunction with horizontal alignment classes, is very useful for centering layouts with uneven row sizes as viewport height changes.

**Example: Variable height content**

Source: [ColumnVariableWidth.vue](../../../examples/grid/ColumnVariableWidth.vue)

```vue
<template>
  <div class="q-pa-md example-column-variable-height">
    <div class="column justify-center" style="height: 250px">
      <div class="col col-md-4"> .col .col-md-4 </div>
      <div class="col-auto"> .col-auto (Variable height content) </div>
      <div class="col col-md-4"> .col .col-md-4 </div>
    </div>

    <div class="column" style="height: 250px">
      <div class="col"> .col </div>
      <div class="col-auto"> .col-auto (Variable height content) </div>
      <div class="col col-md-3"> .col .col-md-3 </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-column-variable-height
  .column
    background: rgba(#aa0, .1)
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
```

## Responsive classes

The grid includes five tiers of predefined classes for building complex responsive layouts. Customize the size of your rows on extra small, small, medium, large, or extra large devices however you see fit.

### All breakpoints

For grids that are the same from the smallest of devices to the largest, use the `.col` and `.col-*` classes. Specify a numbered class when you need a particularly sized row; otherwise, feel free to stick to .col.

**Example: All breakpoints**

Source: [ColumnAllBreakpoints.vue](../../../examples/grid/ColumnAllBreakpoints.vue)

```vue
<template>
  <div class="q-pa-md example-column-all-breakpoints">
    <div class="column" style="height: 150px">
      <div class="col">.col</div>
      <div class="col">.col</div>
      <div class="col">.col</div>
      <div class="col">.col</div>
    </div>

    <div class="column" style="height: 150px">
      <div class="col-8">.col-8</div>
      <div class="col-4">.col-4</div>
    </div>
  </div>
</template>

<style lang="sass">
.example-column-all-breakpoints
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
```

### Mix and match

Don’t want your rows to simply stack in some grid tiers? Use a combination of different classes for each tier as needed. See the example below for a better idea of how it all works.

**Example: Mix and match**

Source: [ColumnMixAndMatch.vue](../../../examples/grid/ColumnMixAndMatch.vue)

```vue
<template>
  <div class="q-pa-md example-column-mix-and-match">
    <!-- Stack the columns on mobile by making one full-width and the other half-width -->
    <div class="column" style="height: 150px">
      <div class="col col-md-8">.col .col-md-8</div>
      <div class="col-6 col-md-4">.col-6 .col-md-4</div>
    </div>

    <!-- Columns start at 33.3% wide on mobile and bump up to 50% wide on desktop -->
    <div class="column" style="height: 150px">
      <div class="col-4 col-md-6">.col-4 .col-md-6</div>
      <div class="col-4 col-md-6">.col-4 .col-md-6</div>
      <div class="col-4 col-md-6">.col-4 .col-md-6</div>
    </div>

    <!-- Columns are always 50% wide, on mobile and desktop -->
    <div class="column" style="height: 150px">
      <div class="col-6">.col-6</div>
      <div class="col-6">.col-6</div>
    </div>
  </div>
</template>

<style lang="sass">
.example-column-mix-and-match
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
```

### Alignment

Use flexbox alignment utilities to vertically and horizontally align columns.

**Example: Horizontal alignment**

Source: [ColumnHorizontalAlignment.vue](../../../examples/grid/ColumnHorizontalAlignment.vue)

```vue
<template>
  <div class="q-pa-md example-column-horizontal-alignment">
    <q-badge>items-start</q-badge>
    <div class="column items-start" style="height: 150px">
      <div class="col"> One of three rows </div>
      <div class="col"> One of three rows </div>
      <div class="col"> One of three rows </div>
    </div>

    <q-badge>items-center</q-badge>
    <div class="column items-center" style="height: 150px">
      <div class="col"> One of three rows </div>
      <div class="col"> One of three rows </div>
      <div class="col"> One of three rows </div>
    </div>

    <q-badge>items-end</q-badge>
    <div class="column items-end" style="height: 150px">
      <div class="col"> One of three rows </div>
      <div class="col"> One of three rows </div>
      <div class="col"> One of three rows </div>
    </div>

    <q-badge>self-*</q-badge>
    <div class="column" style="height: 150px">
      <div class="col self-start"> .self-start </div>
      <div class="col self-center"> .self-center </div>
      <div class="col self-end"> .self-end </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-column-horizontal-alignment
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  > div + div
    margin-top: 1rem
  .column
    background: rgba(#aa0, .1)
</style>
```

**Example: Vertical alignment**

Source: [ColumnVerticalAlignment.vue](../../../examples/grid/ColumnVerticalAlignment.vue)

```vue
<template>
  <div class="q-pa-md example-column-vertical-alignment">
    <q-badge>justify-start</q-badge>
    <div class="column justify-start" style="height: 150px">
      <div class="col-4"> One of two rows </div>
      <div class="col-4"> One of two rows </div>
    </div>

    <q-badge>justify-center</q-badge>
    <div class="column justify-center" style="height: 150px">
      <div class="col-4"> One of two rows </div>
      <div class="col-4"> One of two rows </div>
    </div>

    <q-badge>justify-end</q-badge>
    <div class="column justify-end" style="height: 150px">
      <div class="col-4"> One of two rows </div>
      <div class="col-4"> One of two rows </div>
    </div>

    <q-badge>justify-around</q-badge>
    <div class="column justify-around" style="height: 150px">
      <div class="col-4"> One of two rows </div>
      <div class="col-4"> One of two rows </div>
    </div>

    <q-badge>justify-between</q-badge>
    <div class="column justify-between" style="height: 150px">
      <div class="col-4"> One of two rows </div>
      <div class="col-4"> One of two rows </div>
    </div>

    <q-badge>justify-evenly</q-badge>
    <div class="column justify-evenly" style="height: 150px">
      <div class="col-4"> One of two rows </div>
      <div class="col-4"> One of two rows </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-column-vertical-alignment
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  > div + div
    margin-top: 1rem
  .column
    background: rgba(#aa0, .1)
</style>
```

::: tip
There is also the convenience `flex-center` CSS class which is equivalent to `items-center` + `justify-center`. Use it along with `flex`, `row` or `column`.
:::

### Wrapping

If more than 12 columns are placed within a single row, each group of extra columns will, as one unit, wrap onto a new line.

**Example: Wrapping**

Source: [ColumnRowWrapping.vue](../../../examples/grid/ColumnRowWrapping.vue)

```vue
<template>
  <div class="q-pa-md example-column-row-wrapping">
    <div class="column" style="height: 300px; max-height: 100%">
      <div class="col-9">.col-9</div>
      <div class="col-5">
        .col-5
        <br />Since 9 + 5 = 14 &gt; 12, this 5-row-wide div <br />gets wrapped
        onto a new line as one <br />contiguous unit.
      </div>
      <div class="col-6">
        .col-6
        <br />Subsequent rows <br />continue along the <br />new line.
      </div>
    </div>

    <div class="column" style="height: 150px">
      <div class="col-3 col-sm-6">.col-3 .col-sm-6</div>
      <div class="col-3 col-sm-6">.col-3 .col-sm-6</div>

      <div class="col-3 col-sm-6">.col-3 .col-sm-6</div>
      <div class="col-3 col-sm-6">.col-3 .col-sm-6</div>
    </div>
  </div>
</template>

<style lang="sass">
.example-column-row-wrapping
  .column
    background: rgba(#aa0, .1)
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
```

### Reordering

**Example: Reverse**

Source: [ColumnReverse.vue](../../../examples/grid/ColumnReverse.vue)

```vue
<template>
  <div class="q-pa-md example-column-reverse">
    <div class="column reverse" style="height: 150px">
      <div class="col"> First, but last </div>
      <div class="col"> Second, unchanged </div>
      <div class="col"> Third, but first </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-column-reverse
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
```

**Example: Flex order**

Source: [ColumnFlexOrder.vue](../../../examples/grid/ColumnFlexOrder.vue)

```vue
<template>
  <div class="q-pa-md example-column-flex-order">
    <div class="column" style="height: 190px">
      <div class="col order-none">
        First, but unordered
        <br />(.order-none)
      </div>
      <div class="col order-last">
        Second, but last
        <br />(.order-last)
      </div>
      <div class="col order-first">
        Third, but first
        <br />(.order-first)
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-column-flex-order
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
```

### Nesting

To nest your content with the default grid, add a new `.row` and set of `.col-sm-*` columns within an existing `.col-sm-*` column. Nested rows should include a set of columns that add up to 12 or fewer (it is not required that you use all 12 available columns).

**Example: Nesting**

Source: [ColumnNesting.vue](../../../examples/grid/ColumnNesting.vue)

```vue
<template>
  <div class="q-pa-md example-column-nesting">
    <div class="column" style="height: 200px">
      <div class="col-auto">.col-auto</div>
      <div class="col column">
        <div class="col-8 col-sm-6"> .col-8 .col-sm-6 </div>
        <div class="col-4 col-sm-6"> .col-4 .col-sm-6 </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-column-nesting
  .column > div
    padding: 10px 15px
    background: rgba(#999, .15)
    border: 1px solid rgba(#999, .2)
  .column + .column
    margin-top: 1rem
</style>
```

## Flex Grid Playground

To see the Flex in action, you can use the Flex Playground to interactively learn more.

<q-btn icon-right="launch" label="Flex Playground" to="/layout/grid/flex-playground" />
