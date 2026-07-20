---
title: Grid Row
description: How to use the Quasar grid for rows.
canonical: https://quasar.dev/layout/grid/row
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

In the hope that you've previously read the [Introduction to Flexbox](/layout/grid/introduction-to-flexbox) theory, let's get deeper into Rows.

Utilize breakpoint-specific column classes for equal-width columns. Add any number of unit-less classes for each breakpoint you need and every column will be the same width.

## Equal-width

For example, here are two grid layouts that apply to every device and viewport, from xs to xl.

**Example: Equal Width Example**

Source: [RowEqualWidth.vue](../../../examples/grid/RowEqualWidth.vue)

```vue
<template>
  <div class="q-pa-md example-row-equal-width">
    <div class="row">
      <div class="col"> .col </div>
      <div class="col"> .col </div>
    </div>

    <div class="row">
      <div class="col"> .col </div>
      <div class="col"> .col </div>
      <div class="col"> .col </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-row-equal-width
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 1rem
</style>
```

## Setting one column width

Auto-layout for flexbox grid columns also means you can set the width of one column and the others will automatically resize around it. You may use predefined grid classes (as shown below) or inline widths. Note that the other columns will resize no matter the width of the center column.

**Example: Setting one column width**

Source: [RowColumnWidth.vue](../../../examples/grid/RowColumnWidth.vue)

```vue
<template>
  <div class="q-pa-md example-row-column-width">
    <div class="row">
      <div class="col"> .col </div>
      <div class="col-6"> .col-6 (wider) </div>
      <div class="col"> .col </div>
    </div>

    <div class="row">
      <div class="col"> .col </div>
      <div class="col-5"> .col-5 (wider) </div>
      <div class="col"> .col </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-row-column-width
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 1rem
</style>
```

## Variable width content

Using the `col-{breakpoint}-auto` classes, columns can size itself based on the natural width of its content. This is super handy with single line content like inputs, numbers, etc (see last example on this page). This, in conjunction with horizontal alignment classes, is very useful for centering layouts with uneven column sizes as viewport width changes.

**Example: Variable width content**

Source: [RowVariableWidth.vue](../../../examples/grid/RowVariableWidth.vue)

```vue
<template>
  <div class="q-pa-md example-row-variable-width">
    <div class="row justify-center">
      <div class="col-12 col-md-2"> .col-12 .col-md-2 </div>
      <div class="col-12 col-md-auto">
        .col-12 .col-md-auto (Variable width content)
      </div>
      <div class="col-12 col-md-2"> .col-12 .col-md-2 </div>
    </div>

    <div class="row">
      <div class="col"> .col </div>
      <div class="col-12 col-md-auto">
        .col-12 .col-md-auto (Variable width content)
      </div>
      <div class="col"> .col </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-row-variable-width
  .row
    background: rgba(#aa0, .1)
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 1rem
</style>
```

## Responsive classes

The grid includes five tiers of predefined classes for building complex responsive layouts. Customize the size of your columns on extra small, small, medium, large, or extra large devices however you see fit.

### All breakpoints

For grids that are the same from the smallest of devices to the largest, use the `.col` and `.col-*` classes. Specify a numbered class when you need a particularly sized column; otherwise, feel free to stick to .col.

**Example: All breakpoints**

Source: [RowAllBreakpoints.vue](../../../examples/grid/RowAllBreakpoints.vue)

```vue
<template>
  <div class="q-pa-md example-row-all-breakpoints">
    <div class="row">
      <div class="col">.col</div>
      <div class="col">.col</div>
      <div class="col">.col</div>
      <div class="col">.col</div>
    </div>

    <div class="row">
      <div class="col-8">.col-8</div>
      <div class="col-4">.col-4</div>
    </div>
  </div>
</template>

<style lang="sass">
.example-row-all-breakpoints
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 1rem
</style>
```

### Stacked to horizontal

Using a combination of `.col-12` and `.col-md-*` classes, you can create a basic grid system that starts out stacked on small devices before becoming horizontal on desktop (medium) devices.

**Example: Stacked to horizontal**

Source: [RowStackedToHorizontal.vue](../../../examples/grid/RowStackedToHorizontal.vue)

```vue
<template>
  <div class="q-pa-md example-row-stacked-to-horizontal">
    <div class="row">
      <div class="col-12 col-md-8">.col-12 .col-md-8</div>
      <div class="col-12 col-md-4">.col-12 .col-md-4</div>
    </div>

    <div class="row">
      <div class="col-12 col-md">.col-12 .col-md</div>
      <div class="col-12 col-md">.col-12 .col-md</div>
      <div class="col-12 col-md">.col-12 .col-md</div>
    </div>
  </div>
</template>

<style lang="sass">
.example-row-stacked-to-horizontal
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 1rem
</style>
```

### Mix and match

Don’t want your columns to simply stack in some grid tiers? Use a combination of different classes for each tier as needed. See the example below for a better idea of how it all works.

**Example: Mix and match**

Source: [RowMixAndMatch.vue](../../../examples/grid/RowMixAndMatch.vue)

```vue
<template>
  <div class="q-pa-md example-row-mix-and-match">
    <!-- Stack the columns on mobile by making one full-width and the other half-width -->
    <div class="row">
      <div class="col col-md-8">.col .col-md-8</div>
      <div class="col-6 col-md-4">.col-6 .col-md-4</div>
    </div>

    <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
    <div class="row">
      <div class="col-6 col-md-4">.col-6 .col-md-4</div>
      <div class="col-6 col-md-4">.col-6 .col-md-4</div>
      <div class="col-6 col-md-4">.col-6 .col-md-4</div>
    </div>

    <!-- Columns are always 50% wide, on mobile and desktop -->
    <div class="row">
      <div class="col-6">.col-6</div>
      <div class="col-6">.col-6</div>
    </div>
  </div>
</template>

<style lang="sass">
.example-row-mix-and-match
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 1rem
</style>
```

### Alignment

Use flexbox alignment utilities to vertically and horizontally align columns.

**Example: Vertical alignment**

Source: [RowVerticalAlignment.vue](../../../examples/grid/RowVerticalAlignment.vue)

```vue
<template>
  <div class="q-pa-md example-row-vertical-alignment">
    <q-badge>items-start</q-badge>
    <div class="row items-start">
      <div class="col"> One of three cols </div>
      <div class="col"> One of three cols </div>
      <div class="col"> One of three cols </div>
    </div>

    <q-badge>items-center</q-badge>
    <div class="row items-center">
      <div class="col"> One of three cols </div>
      <div class="col"> One of three cols </div>
      <div class="col"> One of three cols </div>
    </div>

    <q-badge>items-end</q-badge>
    <div class="row items-end">
      <div class="col"> One of three cols </div>
      <div class="col"> One of three cols </div>
      <div class="col"> One of three cols </div>
    </div>

    <q-badge>self-*</q-badge>
    <div class="row">
      <div class="col self-start"> .self-start </div>
      <div class="col self-center"> .self-center </div>
      <div class="col self-end"> .self-end </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-row-vertical-alignment
  .row
    height: 5rem
    background: rgba(#aa0, .1)
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  > div + div
    margin-top: 1rem
</style>
```

**Example: Horizontal alignment**

Source: [RowHorizontalAlignment.vue](../../../examples/grid/RowHorizontalAlignment.vue)

```vue
<template>
  <div class="q-pa-md example-row-horizontal-alignment">
    <q-badge>justify-start</q-badge>
    <div class="row justify-start">
      <div class="col-4"> One of two cols </div>
      <div class="col-4"> One of two cols </div>
    </div>

    <q-badge>justify-center</q-badge>
    <div class="row justify-center">
      <div class="col-4"> One of two cols </div>
      <div class="col-4"> One of two cols </div>
    </div>

    <q-badge>justify-end</q-badge>
    <div class="row justify-end">
      <div class="col-4"> One of two cols </div>
      <div class="col-4"> One of two cols </div>
    </div>

    <q-badge>justify-around</q-badge>
    <div class="row justify-around">
      <div class="col-4"> One of two cols </div>
      <div class="col-4"> One of two cols </div>
    </div>

    <q-badge>justify-between</q-badge>
    <div class="row justify-between">
      <div class="col-4"> One of two cols </div>
      <div class="col-4"> One of two cols </div>
    </div>

    <q-badge>justify-evenly</q-badge>
    <div class="row justify-evenly">
      <div class="col-4"> One of two cols </div>
      <div class="col-4"> One of two cols </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-row-horizontal-alignment
  .row
    background: rgba(#aa0, .1)
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  > div + div
    margin-top: 1rem
</style>
```

::: tip
There is also the convenience `flex-center` CSS class which is equivalent to `items-center` + `justify-center`. Use it along with `flex`, `row` or `column`.
:::

### Column wrapping

If more than 12 columns are placed within a single row, each group of extra columns will, as one unit, wrap onto a new line.

**Example: Column wrapping**

Source: [RowColumnWrapping.vue](../../../examples/grid/RowColumnWrapping.vue)

```vue
<template>
  <div class="q-pa-md example-row-column-wrapping">
    <div class="row">
      <div class="col-9">.col-9</div>
      <div class="col-4"
        >.col-4<br />Since 9 + 4 = 13 &gt; 12, this 4-column-wide div gets
        wrapped onto a new line as one contiguous unit.</div
      >
      <div class="col-5"
        >.col-5<br />Subsequent columns continue along the new line.</div
      >
    </div>

    <div class="row">
      <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
      <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>

      <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
      <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
    </div>
  </div>
</template>

<style lang="sass">
.example-row-column-wrapping
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 1rem
  .row
    background: rgba(#aa0, .1)
</style>
```

### Reordering

**Example: Reverse**

Source: [RowReverse.vue](../../../examples/grid/RowReverse.vue)

```vue
<template>
  <div class="q-pa-md example-row-reverse">
    <div class="row reverse">
      <div class="col"> First, but last </div>
      <div class="col"> Second, unchanged </div>
      <div class="col"> Third, but first </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-row-reverse
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
</style>
```

**Example: Flex order**

Source: [RowFlexOrder.vue](../../../examples/grid/RowFlexOrder.vue)

```vue
<template>
  <div class="q-pa-md example-row-flex-order">
    <div class="row">
      <div class="col order-none">
        First, but unordered<br />(.order-none)
      </div>
      <div class="col order-last"> Second, but last<br />(.order-last) </div>
      <div class="col order-first"> Third, but first<br />(.order-first) </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-row-flex-order
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
</style>
```

### Offsetting columns

Move columns to the right using `.offset-md-*` classes. These classes increase the left margin of a column by \* columns. For example, `.offset-md-4` moves `.col-md-4` over four columns.

**Example: Offsetting columns**

Source: [RowOffsettingColumns.vue](../../../examples/grid/RowOffsettingColumns.vue)

```vue
<template>
  <div class="q-pa-md example-row-offsetting-columns">
    <div class="row">
      <div class="col-md-4">.col-md-4</div>
      <div class="col-md-4 offset-md-4">.col-md-4 .offset-md-4</div>
    </div>

    <div class="row">
      <div class="col-md-3 offset-md-3">.col-md-3 .offset-md-3</div>
      <div class="col-md-3 offset-md-3">.col-md-3 .offset-md-3</div>
    </div>

    <div class="row">
      <div class="col-md-6 offset-md-3">.col-md-6 .offset-md-3</div>
    </div>
  </div>
</template>

<style lang="sass">
.example-row-offsetting-columns
  .row
    background: rgba(#aa0, .1)
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 1rem
</style>
```

### Nesting

To nest your content with the default grid, add a new .row and set of `.col-sm-*` columns within an existing `.col-sm-*` column. Nested rows should include a set of columns that add up to 12 or fewer (it is not required that you use all 12 available columns).

**Example: Nesting**

Source: [RowNesting.vue](../../../examples/grid/RowNesting.vue)

```vue
<template>
  <div class="q-pa-md example-row-nesting">
    <div class="row">
      <div class="col-sm-9">
        <p>Level 1: .col-sm-9</p>
        <div class="row">
          <div class="col-8 col-sm-6"> Level 2: .col-8 .col-sm-6 </div>
          <div class="col-4 col-sm-6"> Level 2: .col-4 .col-sm-6 </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-row-nesting
  .row
    background: rgba(#aa0, .1)
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
</style>
```

## Flex Playground

To see the Flex in action, you can use the Flex Playground to interactively learn more.

<q-btn icon-right="launch" label="Flex Playground" to="/layout/grid/flex-playground" />
