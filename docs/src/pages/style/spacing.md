---
title: CSS Spacing Classes
---
There are CSS classes supplied by Quasar to help you with spacing for DOM elements or components.

## Syntax
```
q-[p|m][t|r|b|l|a|x|y]-[none|auto|xs|sm|md|lg|xl]
    T       D                   S

T - type
  - values: p (padding), m (margin)

D - direction
  - values:
      t (top), r (right), b (bottom), l (left),
      a (all), x (both left & right), y (both top & bottom)

S - size
  - values:
      none,
      auto (just for margin),
      xs (extra small),
      sm (small),
      md (medium),
      lg (large),
      xl (extra large)

q-my-form - applies the default vertical margins for form controls, according to material specification.
```

## Examples

```html
<!-- small padding in all directions -->
<div class="q-pa-sm">...</div>

<!-- medium margin to top, small margin to right -->
<q-card class="q-mt-md q-mr-sm">...</q-card>
```

## Flex Addons
When enabled (through `quasar.conf > framework > cssAddon: true`) it provides breakpoint aware versions for all spacing related CSS classes.

> Note that there will be a noticeable bump in CSS footprint when enabling it. So only do it if you really need it.

```
.q-(p|m)(t|r|b|l|a|x|y)-<bp>-(none|auto|xs|sm|md|lg|xl)
.q-my-<bp>-form
```

Examples: `q-pa-xs q-pa-sm-sm q-px-md-lg q-py-md-md`

::: tip
See more details about the [Flex Addons](/layout/flex-css-grid#Flex-Addons).
:::
