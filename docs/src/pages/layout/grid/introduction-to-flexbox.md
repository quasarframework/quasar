---
title: Introduction to Flexbox
desc: What the flexbox CSS is and how it can be used in a Quasar App.
related:
  - /style/spacing
  - /style/visibility
  - /layout/grid/column
  - /layout/grid/gutter
  - /layout/grid/flex-playground
---

Quasar provides lots of CSS classes to help you build your UI easily with the help of [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/). Think of it like operating with rows and columns with many options at hand.

Flexbox (upon which Quasar Flex CSS classes are based) module aims to provide a more efficient way to lay out, align and distribute space among items in a container, even when their size is unknown and/or dynamic (thus the word “flex”).

::: tip
This page covers the basic theory of Quasar Flex CSS classes and prepares you for the in-depth pages on [Grid Row](/layout/grid/row), [Grid Column](/layout/grid/column) and [Grid Gutter](/layout/grid/gutter).
:::

## Key concept
Quasar Flex CSS classes apply to either the Container (Parent) or the Container's items (Children).

![Flexbox Container](https://cdn.quasar.dev/img/flexbox-container.svg)
![Flexbox Items](https://cdn.quasar.dev/img/flexbox-items.svg)

## Managing Parent

### Setting Direction
One of the following CSS classes is mandatory for the parent in order for ones on the children (described in next sections) to have any effect.

![Flexbox Direction](https://cdn.quasar.dev/img/flexbox-direction.svg)

| Class Name | Description |
| --- | --- |
| `row` | Flex row |
| `row inline` | Inline Flex row |
| `column` | Flex column |
| `column inline` | Inline Flex column |
| `row reverse` | Flex row with `flex-direction` set to `row-reverse` |
| `column reverse` | Flex column with `flex-direction` set to `column-reverse` |

Example:
```html
<div class="row">
  <div>First column</div>
  <div>Second column</div>
  <div>Third column</div>
</div>
```

### Wrapping by default
By default, all rows and columns wrap their content.

![Flexbox Direction](https://cdn.quasar.dev/img/flexbox-wrap.svg)

However if you explicitly do not want to wrap and by so doing you want to fit all content into one line, then add `no-wrap` CSS helper class.

Also, if you want to wrap in reverse order, then `reverse-wrap` is available.

| Class Name | Description |
| --- | --- |
| `wrap` | Wrap if necessary ("on" by default, no need to specify it) |
| `no-wrap` | Do NOT wrap even if necessary |
| `reverse-wrap` | Wrap backwards if necessary |

### Alignment

**For alignment along the main axis**, use classes below. It helps distribute left over free space when either all the flex items on a line are inflexible, or are flexible but have reached their maximum size. It also exerts some control over the alignment of items when they overflow the line.

![Flexbox Justify Content](https://cdn.quasar.dev/img/flexbox-main-axis-align---2.svg)

**For alignment perpendicular to the main axis**, use classes below. This defines the default behavior for how flex items are laid out along the cross axis on the current line. Think of it as the horizontal-* version for the cross-axis (perpendicular to the main-axis).

![Flexbox Items Align](https://cdn.quasar.dev/img/flexbox-cross-axis-align.svg)

The next classes **align a flex container's lines** within when there is extra space in the cross-axis, similar to how horizontal-* aligns individual items within the main-axis.

![Flexbox Content Align](https://cdn.quasar.dev/img/flexbox-content-align.svg)

## Managing Children

### Distribution of Size
Quasar uses a 12 point column system for distributing the size of row children. Here are some examples of the available CSS helper classes:


```html
<div class="row">
  <div class="col-8">two thirds</div>
  <div class="col-2">one sixth</div>
  <div class="col-auto">auto size based on content and available space</div>
  <div class="col">fills remaining available space</div>
</div>
```

In the example above, `col-8` fills two thirds (2/3) of the row width, because 8/12 = 2/3 = 66%, while `col-2` occupies one sixth (2/12 = 1/6 ~ 16.67%).

CSS helper class `col-auto` makes the cell fill only the space it needs to be rendered. `col`, on the other hand, tries to fill all space available while also shrinking if needed.

CSS helper class `col-grow` makes the cell fill at least the space it needs to be rendered, with the possibility to grow when more space is available.

CSS helper class `col-shrink` makes the cell fill at most the space it needs to be rendered, with the possibility to shrink when not enough space is available.

Another example with a visual representation below it:
```html
<div class="row">
  <div class="col">1</div>
  <div class="col">1</div>
  <div class="col">1</div>
  <!--
     we have 3 children, so equivalent
     to above would be to use `col-4`
     on each of the children
  -->
</div>

<div class="row">
  <div class="col-3">1</div>
  <div class="col-6">2</div>
  <div class="col-3">1</div>
</div>
```
![Flexbox Grow](https://cdn.quasar.dev/img/flexbox-grow.svg)

It is also possible to offset a cell. For example: `offset-4` offsets a third of space (4/12 = 1/3 = 33%).

### Wrapping
Wrapping is a key feature in understanding Flex CSS classes. You are not bound to use exactly 12 points per row. You can use less or even more.

This allows you, among other things, to dynamically stack rows vertically on smaller screens while displaying them on a single line on bigger screens. Read the "Responsive Design" section.

```html
<div class="row">
  <div class="col-2">...</div>

  <!-- 2 + 6 < 12, so next element is placed on same line -->
  <div class="col-6">...</div>

  <!-- 2 + 6 + 10 > 12, so next element wraps to next line -->
  <div class="col-10">...</div>

  <!--
    10 + 3 > 12, so next element wraps to next line.
    Note that we take into consideration the current line only
    (with col-10 only, since it was wrapped to its own line).
  -->
  <div class="col-3">...</div>
</div>
```

> Note that rows are wrappable by default. Should you wish to disable this, use the `no-wrap` CSS helper class.

### Self Alignment
**An item can override the aligned specified on parent**. This allows alignment to be overridden for individual flex items. Please see the "Alignment" explanation from "Managing Parent" to understand the available values (`self-start`, `self-center`, `self-baseline`, `self-end`, `self-stretch`).

![Flexbox Self](https://cdn.quasar.dev/img/flexbox-self.svg)

### Order
**You can set the order** of child elements by using `order-first` and `order-last` CSS helper classes.

By default, flex items are laid out in source order. However, the order property controls the order in which they appear in the flex container. If you need more granularity, use `order` CSS property and assign the desired value.

Example:
```html
<div class="row">
  <div style="order: 2">Second column</div>
  <div class="order-last">Third column</div>
  <div class="order-first">First column</div>
</div>
```

Here is how the CSS `order` property works:

![Flexbox Order](https://cdn.quasar.dev/img/flexbox-order.svg)

## Responsive Design
Quasar Flex CSS classes can be applied based on the width of the screen, to help you in making a responsive UI. The 12 points grid is inspired by Bootstrap's, so there are a lot of similarities.

What we've learned so far is that, for example, we can size the columns regardless of window width. If we are to create a responsive UI, we need to dynamically change the sizing while taking window width into account. First, let's learn about some tokens that you can inject in middle of `col-*`, `offset-*` and `col-auto` helper classes (look at table below for tokens).

| Token | Max window width | Description / When it applies |
| --- | --- | --- |
| `xs` | 599px | Extra small sized window |
| `sm` | 1023px | Small sized window |
| `md` | 1439px | Medium-sized window |
| `lg` | 1919px | Large sized window |
| `xl` | Infinite | Extra large sized window |

Example: `col-md-7`, `offset-lg-3`, `col-xs-auto`.

A full example: let's say we have a row with three children. In extra small windows, we need to stack the children vertically, In small windows we need to display them side by side (each having equal width), and starting with medium windows we should display them all on same line:

```html
<div class="row">
  <div class="col-xs-12 col-sm-6 col-md-4">
    col
  </div>
  <div class="col-xs-12 col-sm-6 col-md-4">
    col
  </div>
  <div class="col-xs-12 col-sm-6 col-md-4">
    col
  </div>
</div>
```

Notice in the above example that we used `col-xs-12` (12/12 = 100% of row, so each child will take full width of the container making all children stack vertically, since rows wrap content by default), `col-sm-6` (6/12 = 50% of row) and `col-md-4` (4/12 = 33% of row).

Like previously mentioned, rows wrap content by default, so when 12 (or more) grid points are used for a row, content is wrapped to the next line. If we have two `<div>`s and we use `col-8` on both, they will also stack, since 8 + 8 = 16 and we can only display 12 points on a single line.

```html
<div class="row">
  <!--
    more than 12 grid points together,
    so second <div> will wrap on next line
  -->
  <div class="col-8">col</div>
  <div class="col-8">col</div>
</div>
```

Also check [Visibility](/style/visibility#window-width-related) Style page to see thresholds on window width and these tokens (xs, sm, md, lg, xl) used on their own to hide or show DOM elements.

## Flex Addons

When enabled (through `quasar.conf > framework > cssAddon: true`) it provides breakpoint aware versions for all flex (and display) related CSS classes.

::: warning
Note that there will be a noticeable bump in CSS footprint when enabling it. So only do it if you really need it.
:::

```
.flex-<bp>-(block|inline)
.(row|column|flex)-<bp>(|-inline)
.reverse-<bp>
.(wrap|no-wrap|reverse-wrap)-<bp>
.order-<bp>-(first|last|none)
.justify-<bp>-(start|end|center|between|around|evenly)
.items-<bp>-(start|end|center|baseline|stretch)
.content-<bp>-(start|end|center|between|around)
.self-<bp>-(start|end|center|baseline|stretch)
.flex-<bp>-center
.gutter-<bp>(|-x|-y)-(xs|sm|md|lg|xl)
.(col|offset)-<bp>(|0..12)
```

There are also responsive classes for spacing, both for padding and for margin:

```
.q-(p|m)(t|r|b|l|a|x|y)-<bp>-(none|auto|xs|sm|md|lg|xl)
.q-my-<bp>-form
```

Examples: `row-md`, `items-lg-end`, `q-pa-xs q-pa-sm-sm q-px-md-lg q-py-md-md`

## Flex Playground
To see the Flex in action, you can use the Flex Playground to interactively learn more.

<q-btn push color="brand-primary" icon-right="launch" label="Flex Playground" to="/layout/grid/flex-playground" />
