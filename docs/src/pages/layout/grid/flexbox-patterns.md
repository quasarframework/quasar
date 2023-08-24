---
title: Flexbox Patterns
desc: Common recipes for working with flexbox CSS is and how it can be used in a Quasar App.
examples: grid
related:
  - /layout/grid/introduction-to-flexbox
  - /layout/grid/row
  - /layout/grid/column
  - /layout/grid/gutter
  - /layout/grid/flex-playground
---

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

<doc-example title="Row break" file="BreakRow" />

::: warning
When using `column` type flex you must define a height for the container. The height must be large enough to hold the longest column.
:::

<doc-example title="Column break" file="BreakColumn" />

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

Example, supossing you want a 4 column layout:

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

Example, supossing you want a 4 column layout:

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

<doc-example title="Masonry" file="Masonry" />

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

<doc-example title="Masonry like table grid" file="MasonryTableGrid" />
