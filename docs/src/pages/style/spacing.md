---
title: CSS Spacing Classes
desc: The list of CSS classes supplied by Quasar to simplify the specification of responsive paddings and margins.
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
      auto (ONLY for specific margins: q-ml-*, q-mr-*, q-mx-*),
      xs (extra small),
      sm (small),
      md (medium),
      lg (large),
      xl (extra large)
```

## Examples

```html
<!-- small padding in all directions -->
<div class="q-pa-sm">...</div>

<!-- medium margin to top, small margin to right -->
<q-card class="q-mt-md q-mr-sm">...</q-card>
```

## Flex Addons
When enabled (through `quasar.conf.js > framework > cssAddon: true`) it provides breakpoint aware versions for all spacing related CSS classes.

> Note that there will be a noticeable bump in CSS footprint when enabling it. So only do it if you really need it.

```
.q-(p|m)(t|r|b|l|a|x|y)-<bp>-(none|auto|xs|sm|md|lg|xl)
```

Examples: `q-pa-xs-md q-pa-sm-sm q-px-md-lg q-py-md-md`

::: tip
See more details about the [Flex Addons](/layout/grid/introduction-to-flexbox#Flex-Addons).
:::
