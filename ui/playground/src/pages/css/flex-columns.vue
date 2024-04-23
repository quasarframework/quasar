<template>
  <div class="q-layout-padding grid-columns">
    <h1>Grid: Columns</h1>
    Utilize breakpoint-specific row classes for equal-width rows. Add any number of unit-less classes for each breakpoint you need and every row will be the same height.

    <h3>Equal-width</h3>
    For example, here are two grid layouts that apply to every device and viewport, from xs to xl.

    <div class="container">
      <div class="column">
        <div class="col">
          1 of 2
        </div>
        <div class="col">
          1 of 2
        </div>
      </div>
      <div class="column">
        <div class="col">
          1 of 3
        </div>
        <div class="col">
          1 of 3
        </div>
        <div class="col">
          1 of 3
        </div>
      </div>
    </div>

    <h3>Setting one row height</h3>
    Auto-layout for flexbox grid rows also means you can set the height of one row and the others will automatically resize around it. You may use predefined grid classes (as shown below), grid mixins, or inline heights. Note that the other rows will resize no matter the height of the center row.

    <div class="container">
      <div class="column">
        <div class="col">
          1 of 3
        </div>
        <div class="col-6">
          2 of 3 (wider)
        </div>
        <div class="col">
          3 of 3
        </div>
      </div>
      <div class="column">
        <div class="col">
          1 of 3
        </div>
        <div class="col-5">
          2 of 3 (wider)
        </div>
        <div class="col">
          3 of 3
        </div>
      </div>
    </div>

    <h3>Variable height content</h3>
    Using the col-{breakpoint}-auto classes, rows can size itself based on the natural height of its content. This is super handy with single line content like inputs, numbers, etc. This, in conjunction with horizontal alignment classes, is very useful for centering layouts with uneven row sizes as viewport height changes.

    <div class="container">
      <div class="column justify-md-center">
        <div class="col col-lg-2">
          1 of 3
        </div>
        <div class="col-12 col-md-auto">
          Variable width content
        </div>
        <div class="col col-lg-2">
          3 of 3
        </div>
      </div>
      <div class="column">
        <div class="col">
          1 of 3
        </div>
        <div class="col-12 col-md-auto">
          Variable width content
        </div>
        <div class="col col-lg-2">
          3 of 3
        </div>
      </div>
    </div>

    <h1>Responsive classes</h1>
    The grid includes five tiers of predefined classes for building complex responsive layouts. Customize the size of your rows on extra small, small, medium, large, or extra large devices however you see fit.

    <h3>All breakpoints</h3>
    For grids that are the same from the smallest of devices to the largest, use the .col and .col-* classes. Specify a numbered class when you need a particularly sized row; otherwise, feel free to stick to .col.

    <div class="container">
      <div class="column">
        <div class="col">
          col
        </div>
        <div class="col">
          col
        </div>
        <div class="col">
          col
        </div>
        <div class="col">
          col
        </div>
      </div>
      <div class="column">
        <div class="col-8">
          col-8
        </div>
        <div class="col-4">
          col-4
        </div>
      </div>
    </div>

    <h3>Mix and match</h3>
    Don’t want your rows to simply stack in some grid tiers? Use a combination of different classes for each tier as needed. See the example below for a better idea of how it all works.
    <div class="container">
      <!-- Stack the columns on mobile by making one full-width and the other half-width -->
      <div class="column">
        <div class="col col-md-8">
          .col .col-md-8
        </div>
        <div class="col-6 col-md-4">
          .col-6 .col-md-4
        </div>
      </div>

      <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
      <div class="column">
        <div class="col-6 col-md-4">
          .col-6 .col-md-4
        </div>
        <div class="col-6 col-md-4">
          .col-6 .col-md-4
        </div>
        <div class="col-6 col-md-4">
          .col-6 .col-md-4
        </div>
      </div>

      <!-- Columns are always 50% wide, on mobile and desktop -->
      <div class="column">
        <div class="col-6">
          .col-6
        </div>
        <div class="col-6">
          .col-6
        </div>
      </div>
    </div>

    <h1>Alignment</h1>
    Use flexbox alignment utilities to vertically and horizontally align columns.

    <h3>Horizontal alignment</h3>
    <div class="container example-minheight">
      <div class="column items-start">
        <div class="col">
          One of three rows
        </div>
        <div class="col">
          One of three rows
        </div>
        <div class="col">
          One of three rows
        </div>
      </div>
      <div class="column items-center">
        <div class="col">
          One of three rows
        </div>
        <div class="col">
          One of three rows
        </div>
        <div class="col">
          One of three rows
        </div>
      </div>
      <div class="column items-end">
        <div class="col">
          One of three rows
        </div>
        <div class="col">
          One of three rows
        </div>
        <div class="col">
          One of three rows
        </div>
      </div>
    </div>

    <div class="container example-minheight">
      <div class="column">
        <div class="col self-start">
          One of three rows
        </div>
        <div class="col self-center">
          One of three rows
        </div>
        <div class="col self-end">
          One of three rows
        </div>
      </div>
    </div>

    <h3>Vertical alignment</h3>
    <div class="container">
      <div class="column justify-start">
        <div class="col-4">
          One of two rows
        </div>
        <div class="col-4">
          One of two rows
        </div>
      </div>
      <div class="column justify-center">
        <div class="col-4">
          One of two rows
        </div>
        <div class="col-4">
          One of two rows
        </div>
      </div>
      <div class="column justify-end">
        <div class="col-4">
          One of two rows
        </div>
        <div class="col-4">
          One of two columns
        </div>
      </div>
      <div class="column justify-around">
        <div class="col-4">
          One of two rows
        </div>
        <div class="col-4">
          One of two rows
        </div>
      </div>
      <div class="column justify-between">
        <div class="col-4">
          One of two rows
        </div>
        <div class="col-4">
          One of two rows
        </div>
      </div>
    </div>

    <h3>Row wrapping</h3>
    If more than 12 rows are placed within a single row, each group of extra rows will, as one unit, wrap onto a new column.

    <div class="container">
      <div class="column">
        <div class="col-9">
          .col-9
        </div>
        <div class="col-4">
          .col-4<br>Since 9 + 4 = 13 &gt; 12,<br>this 4-row-wide div gets wrapped<br>onto a new line as<br>one contiguous unit.
        </div>
        <div class="col-6">
          .col-6<br>Subsequent rows continue along the new line.
        </div>
      </div>
    </div>

    <div class="container">
      <div class="column">
        <div class="col-6 col-sm-3">
          .col-6 .col-sm-3
        </div>
        <div class="col-6 col-sm-3">
          .col-6 .col-sm-3
        </div>

        <div class="col-6 col-sm-3">
          .col-6 .col-sm-3
        </div>
        <div class="col-6 col-sm-3">
          .col-6 .col-sm-3
        </div>
      </div>
    </div>

    <h1>Reordering</h1>

    <h3>Reverse</h3>

    <div class="container">
      <div class="column reverse">
        <div class="col">
          First, but last
        </div>
        <div class="col">
          Second, unchanged
        </div>
        <div class="col">
          Third, but first
        </div>
      </div>
    </div>

    <h3>Flex order</h3>
    Use flexbox utilities for controlling the visual order of your content.

    <div class="container">
      <div class="column">
        <div class="col order-none">
          First, but unordered
        </div>
        <div class="col order-last">
          Second, but last
        </div>
        <div class="col order-first">
          Third, but first
        </div>
      </div>
    </div>

    <h1>Nesting</h1>
    To nest your content with the default grid, add a new .column and set of .col-sm-* rows within an existing .col-sm-* row. Nested columns should include a set of rows that add up to 12 or fewer (it is not required that you use all 12 available columns).

    <div class="container">
      <div class="column">
        <div class="col-sm-9">
          Level 1: .col-sm-9
          <div class="column" style="height: 150px">
            <div class="col-8 col-sm-6">
              Level 2: .col-8 .col-sm-6
            </div>
            <div class="col-4 col-sm-6">
              Level 2: .col-4 .col-sm-6
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.grid-columns
  .container
    padding: 15px
  .column
    height: 300px
  .column > div
    padding: 10px 15px
    background: rgba(86,61,124,.15)
    border: 1px solid rgba(86,61,124,.2)
  .column + .column
    margin-top: 1rem
  .example-minheight .column
    min-width: 5rem
    background: rgba(255,0,0,.1)
</style>
