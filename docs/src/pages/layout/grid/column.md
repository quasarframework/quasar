---
title: Grid Column
desc: How to use the Quasar grid for columns.
examples: grid
related:
  - /layout/grid/introduction-to-flexbox
  - /layout/grid/row
  - /layout/grid/gutter
  - /layout/grid/flex-playground
---

In the hope that you've previously read the [Introduction to Flexbox](/layout/grid/introduction-to-flexbox) theory, let's get deeper into Columns.

Utilize breakpoint-specific row classes for equal-height rows. Add any number of unit-less classes for each breakpoint you need and every row will be the same height.

## Equal-height

For example, here are two grid layouts that apply to every device and viewport, from xs to xl.

<doc-example title="Equal Height Example" file="ColumnEqualWidth" />

## Setting one row height
Auto-layout for flexbox grid rows also means you can set the height of one row and the others will automatically resize around it. You may use predefined grid classes (as shown below) or inline heights. Note that the other rows will resize no matter the height of the center row.

<doc-example title="Setting one row height" file="ColumnRowWidth" />

## Variable height content
Using the `col-{breakpoint}-auto` classes, rows can size itself based on the natural height of its content. This is super handy with single line content like inputs, numbers, etc. This, in conjunction with horizontal alignment classes, is very useful for centering layouts with uneven row sizes as viewport height changes.

<doc-example title="Variable height content" file="ColumnVariableWidth" />

## Responsive classes

The grid includes five tiers of predefined classes for building complex responsive layouts. Customize the size of your rows on extra small, small, medium, large, or extra large devices however you see fit.

### All breakpoints
For grids that are the same from the smallest of devices to the largest, use the `.col` and `.col-*` classes. Specify a numbered class when you need a particularly sized row; otherwise, feel free to stick to .col.

<doc-example title="All breakpoints" file="ColumnAllBreakpoints" />

### Mix and match
Don’t want your rows to simply stack in some grid tiers? Use a combination of different classes for each tier as needed. See the example below for a better idea of how it all works.

<doc-example title="Mix and match" file="ColumnMixAndMatch" />

### Alignment
Use flexbox alignment utilities to vertically and horizontally align columns.

<doc-example title="Horizontal alignment" file="ColumnHorizontalAlignment" />

<doc-example title="Vertical alignment" file="ColumnVerticalAlignment" />

::: tip
There is also the convenience `flex-center` CSS class which is equivalent to `items-center` + `justify-center`. Use it along with `flex`, `row` or `column`.
:::

### Wrapping
If more than 12 columns are placed within a single row, each group of extra columns will, as one unit, wrap onto a new line.

<doc-example title="Wrapping" file="ColumnRowWrapping" />

### Reordering

<doc-example title="Reverse" file="ColumnReverse" />

<doc-example title="Flex order" file="ColumnFlexOrder" />

### Nesting
To nest your content with the default grid, add a new `.row` and set of `.col-sm-*` columns within an existing `.col-sm-*` column. Nested rows should include a set of columns that add up to 12 or fewer (it is not required that you use all 12 available columns).

<doc-example title="Nesting" file="ColumnNesting" />

## Flex Grid Playground
To see the Flex in action, you can use the Flex Playground to interactively learn more.

<q-btn icon-right="launch" label="Flex Playground" to="/layout/grid/flex-playground" />
