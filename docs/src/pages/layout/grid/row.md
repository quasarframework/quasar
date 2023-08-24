---
title: Grid Row
desc: How to use the Quasar grid for rows.
examples: grid
related:
  - /layout/grid/introduction-to-flexbox
  - /layout/grid/column
  - /layout/grid/gutter
  - /layout/grid/flex-playground
---

In the hope that you've previously read the [Introduction to Flexbox](/layout/grid/introduction-to-flexbox) theory, let's get deeper into Rows.

Utilize breakpoint-specific column classes for equal-width columns. Add any number of unit-less classes for each breakpoint you need and every column will be the same width.

## Equal-width

For example, here are two grid layouts that apply to every device and viewport, from xs to xl.

<doc-example title="Equal Width Example" file="RowEqualWidth" />

## Setting one column width
Auto-layout for flexbox grid columns also means you can set the width of one column and the others will automatically resize around it. You may use predefined grid classes (as shown below) or inline widths. Note that the other columns will resize no matter the width of the center column.

<doc-example title="Setting one column width" file="RowColumnWidth" />

## Variable width content
Using the `col-{breakpoint}-auto` classes, columns can size itself based on the natural width of its content. This is super handy with single line content like inputs, numbers, etc (see last example on this page). This, in conjunction with horizontal alignment classes, is very useful for centering layouts with uneven column sizes as viewport width changes.

<doc-example title="Variable width content" file="RowVariableWidth" />

## Responsive classes

The grid includes five tiers of predefined classes for building complex responsive layouts. Customize the size of your columns on extra small, small, medium, large, or extra large devices however you see fit.

### All breakpoints
For grids that are the same from the smallest of devices to the largest, use the `.col` and `.col-*` classes. Specify a numbered class when you need a particularly sized column; otherwise, feel free to stick to .col.

<doc-example title="All breakpoints" file="RowAllBreakpoints" />

### Stacked to horizontal
Using a combination of `.col-12` and `.col-md-*` classes, you can create a basic grid system that starts out stacked on small devices before becoming horizontal on desktop (medium) devices.

<doc-example title="Stacked to horizontal" file="RowStackedToHorizontal" />

### Mix and match
Don’t want your columns to simply stack in some grid tiers? Use a combination of different classes for each tier as needed. See the example below for a better idea of how it all works.

<doc-example title="Mix and match" file="RowMixAndMatch" />

### Alignment
Use flexbox alignment utilities to vertically and horizontally align columns.

<doc-example title="Vertical alignment" file="RowVerticalAlignment" />

<doc-example title="Horizontal alignment" file="RowHorizontalAlignment" />

::: tip
There is also the convenience `flex-center` CSS class which is equivalent to `items-center` + `justify-center`. Use it along with `flex`, `row` or `column`.
:::

### Column wrapping
If more than 12 columns are placed within a single row, each group of extra columns will, as one unit, wrap onto a new line.

<doc-example title="Column wrapping" file="RowColumnWrapping" />

### Reordering

<doc-example title="Reverse" file="RowReverse" />

<doc-example title="Flex order" file="RowFlexOrder" />

### Offsetting columns
Move columns to the right using `.offset-md-*` classes. These classes increase the left margin of a column by * columns. For example, `.offset-md-4` moves `.col-md-4` over four columns.

<doc-example title="Offsetting columns" file="RowOffsettingColumns" />

### Nesting
To nest your content with the default grid, add a new .row and set of `.col-sm-*` columns within an existing `.col-sm-*` column. Nested rows should include a set of columns that add up to 12 or fewer (it is not required that you use all 12 available columns).

<doc-example title="Nesting" file="RowNesting" />

## Flex Playground
To see the Flex in action, you can use the Flex Playground to interactively learn more.

<q-btn icon-right="launch" label="Flex Playground" to="/layout/grid/flex-playground" />
