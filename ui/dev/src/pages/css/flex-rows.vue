<template>
  <div class="q-layout-padding grid-rows">
    <h1>Grid: Rows</h1>
    Utilize breakpoint-specific column classes for equal-width columns. Add any number of unit-less classes for each breakpoint you need and every column will be the same width.

    <h3>Equal-width</h3>
    For example, here are two grid layouts that apply to every device and viewport, from xs to xl.

    <div class="container">
      <div class="row">
        <div class="col">
          1 of 2
        </div>
        <div class="col">
          1 of 2
        </div>
      </div>
      <div class="row">
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

    <h3>Setting one column width</h3>
    Auto-layout for flexbox grid columns also means you can set the width of one column and the others will automatically resize around it. You may use predefined grid classes (as shown below), grid mixins, or inline widths. Note that the other columns will resize no matter the width of the center column.

    <div class="container">
      <div class="row">
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
      <div class="row">
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

    <h3>Variable width content</h3>
    Using the col-{breakpoint}-auto classes, columns can size itself based on the natural width of its content. This is super handy with single line content like inputs, numbers, etc. This, in conjunction with horizontal alignment classes, is very useful for centering layouts with uneven column sizes as viewport width changes.

    <div class="container">
      <div class="row justify-md-center">
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
      <div class="row">
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
    The grid includes five tiers of predefined classes for building complex responsive layouts. Customize the size of your columns on extra small, small, medium, large, or extra large devices however you see fit.

    <h3>All breakpoints</h3>
    For grids that are the same from the smallest of devices to the largest, use the .col and .col-* classes. Specify a numbered class when you need a particularly sized column; otherwise, feel free to stick to .col.

    <div class="container">
      <div class="row">
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
      <div class="row">
        <div class="col-8">
          col-8
        </div>
        <div class="col-4">
          col-4
        </div>
      </div>
    </div>

    <h3>Stacked to horizontal</h3>
    Using a single set of .col-sm-* classes, you can create a basic grid system that starts out stacked on extra small devices before becoming horizontal on desktop (medium) devices.

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-sm-8">
          col-sm-8
        </div>
        <div class="col-xs-12 col-sm-4">
          col-sm-4
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm">
          col-sm
        </div>
        <div class="col-xs-12 col-sm">
          col-sm
        </div>
        <div class="col-xs-12 col-sm">
          col-sm
        </div>
      </div>
    </div>

    <h3>Mix and match</h3>
    Don’t want your columns to simply stack in some grid tiers? Use a combination of different classes for each tier as needed. See the example below for a better idea of how it all works.
    <div class="container">
      <!-- Stack the columns on mobile by making one full-width and the other half-width -->
      <div class="row">
        <div class="col col-md-8">
          .col .col-md-8
        </div>
        <div class="col-6 col-md-4">
          .col-6 .col-md-4
        </div>
      </div>

      <!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
      <div class="row">
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
      <div class="row">
        <div class="col-6">
          .col-6
        </div>
        <div class="col-6">
          .col-6
        </div>
      </div>

      <div class="row">
        <div class="col-xs-8 col-md-auto col-lg-6">
          .col-xs-8 .col-md-auto .col-lg-6
        </div>
        <div class="col-xs-4 col-md col-lg-6">
          .col-xs-4 .col-md .col-lg-6
        </div>
      </div>
    </div>

    <h1>Alignment</h1>
    Use flexbox alignment utilities to vertically and horizontally align columns.

    <h3>Vertical alignment</h3>
    <div class="container example-minheight">
      <div class="row items-start">
        <div class="col">
          One of three columns
        </div>
        <div class="col">
          One of three columns
        </div>
        <div class="col">
          One of three columns
        </div>
      </div>
      <div class="row items-center">
        <div class="col">
          One of three columns
        </div>
        <div class="col">
          One of three columns
        </div>
        <div class="col">
          One of three columns
        </div>
      </div>
      <div class="row items-end">
        <div class="col">
          One of three columns
        </div>
        <div class="col">
          One of three columns
        </div>
        <div class="col">
          One of three columns
        </div>
      </div>
    </div>

    <div class="container example-minheight">
      <div class="row">
        <div class="col self-start">
          One of three columns
        </div>
        <div class="col self-center">
          One of three columns
        </div>
        <div class="col self-end">
          One of three columns
        </div>
      </div>
    </div>

    <h3>Horizontal alignment</h3>
    <div class="container">
      <div class="row justify-start">
        <div class="col-4">
          One of two columns
        </div>
        <div class="col-4">
          One of two columns
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-4">
          One of two columns
        </div>
        <div class="col-4">
          One of two columns
        </div>
      </div>
      <div class="row justify-end">
        <div class="col-4">
          One of two columns
        </div>
        <div class="col-4">
          One of two columns
        </div>
      </div>
      <div class="row justify-around">
        <div class="col-4">
          One of two columns
        </div>
        <div class="col-4">
          One of two columns
        </div>
      </div>
      <div class="row justify-between">
        <div class="col-4">
          One of two columns
        </div>
        <div class="col-4">
          One of two columns
        </div>
      </div>
    </div>

    <h3>Column wrapping</h3>
    If more than 12 columns are placed within a single row, each group of extra columns will, as one unit, wrap onto a new line.

    <div class="container">
      <div class="row">
        <div class="col-9">
          .col-9
        </div>
        <div class="col-4">
          .col-4<br>Since 9 + 4 = 13 &gt; 12, this 4-column-wide div gets wrapped onto a new line as one contiguous unit.
        </div>
        <div class="col-6">
          .col-6<br>Subsequent columns continue along the new line.
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
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
      <div class="row reverse">
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
      <div class="row">
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

    <h3>Offsetting columns</h3>
    Move columns to the right using .offset-md-* classes. These classes increase the left margin of a column by * columns. For example, .offset-md-4 moves .col-md-4 over four columns.

    <div class="container">
      <div class="row">
        <div class="col-md-4">
          .col-md-4
        </div>
        <div class="col-md-4 offset-md-4">
          .col-md-4 .offset-md-4
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 offset-md-3">
          .col-md-3 .offset-md-3
        </div>
        <div class="col-md-3 offset-md-3">
          .col-md-3 .offset-md-3
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 offset-md-3">
          .col-md-6 .offset-md-3
        </div>
      </div>
    </div>

    <h1>Nesting</h1>
    To nest your content with the default grid, add a new .row and set of .col-sm-* columns within an existing .col-sm-* column. Nested rows should include a set of columns that add up to 12 or fewer (it is not required that you use all 12 available columns).

    <div class="container">
      <div class="row">
        <div class="col-sm-9">
          Level 1: .col-sm-9
          <div class="row">
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

    <div class="container">
      <div class="row">
        <div class="col-7">
          <div class="row">
            <div class="col-9">
              <div class="row">
                <div class="col-4" />
                <div class="col-8" />
              </div>
            </div>
            <div class="col-3">
              <div class="row">
                <div class="col" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-5">
          <div class="row">
            <div class="col-12">
              <div class="row">
                <div class="col-6" />
                <div class="col-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.grid-rows
  .container
    padding: 15px
    max-height: 1000px
  .row > div
    padding: 10px 15px
    background: rgba(86,61,124,.15)
    border: 1px solid rgba(86,61,124,.2)
  .row + .row
    margin-top: 1rem
  .example-minheight .row
    min-height: 5rem
    height: 0px
    background: rgba(255,0,0,.1)
</style>
