---
title: Breakpoints
desc: Quasar's list of CSS breakpoints.
related:
  - /style/spacing
---

Quasar uses the following CSS breakpoints:

| Window Size | Name | Min-width threshold in pixels | Max-width threshold in pixels |
| --- | --- | --- | --- |
| Extra Small | `xs` | 0px | 599.99px |
| Small | `sm` | 600px | 1023.99px |
| Medium | `md` | 1024px | 1439.99px |
| Large | `lg` | 1440px | 1919.99px |
| Extra Large | `xl` | 1920px | Infinity |

To learn how to use them, please visit the [Visibility](/style/visibility) page.

You might also want to take a look at the [Introduction to Flexbox](/layout/grid/introduction-to-flexbox#responsive-design) on the "Responsive Design" section.

### Sass

You can also use the breakpoints in Sass:

```sass
@media (max-width: $breakpoint-xs-max)
  font-size: 10px
```

The syntax for these variables is shown below, where `<breakpoint>` is to be replaced by "xs", "sm", "md", "lg" or "xl":

```
$breakpoint-<breakpoint>-min
$breakpoint-<breakpoint>-max
```

There's also:

```
$sizes.<breakpoint>
// replace <breakpoint> with xs, sm, md, lg or xl
```

[If enabled (only)](/options/screen-plugin#how-to-enable-body-classes), you can also style your content based on a particular set of CSS classes applied to document.body: `screen--xs`, `screen--sm`, ..., `screen--xl`.

```sass
.my-div
  body.screen--xs &
    color: #000
  body.screen--sm &
    color: #fff
```
