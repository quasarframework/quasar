---
title: Breakpoints
desc: Quasar's list of CSS breakpoints.
related:
  - /style/spacing
---

Quasar uses the following CSS breakpoints:

| Window Size | Name | Width threshold in pixels |
| --- | --- | --- |
| Extra Small | `xs` | Up to 599px |
| Small | `sm` | Up to 1023px |
| Medium | `md` | Up to 1439px |
| Large | `lg` | Up to 1919px |
| Extra Large | `xl` | Bigger than 1920px |

To learn how to use them, please visit the [Visibility](/style/visibility) page.

You might also want to take a look at the [Introduction to Flexbox](/layout/grid/introduction-to-flexbox#responsive-design) on the "Responsive Design" section.

### Sass and Stylus

You can also use the breakpoints in Stylus:

```
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

Starting with **Quasar v1.5.3+**, [if enabled (only)](/options/screen-plugin#how-to-enable-body-classes), you can also style your content based on a particular set of CSS classes applied to document.body: `screen--xs`, `screen--sm`, ..., `screen--xl`.

```css
// v1.5.3+

.my-div
  body.screen--xs &
    color: #000
  body.screen--sm &
    color: #fff
```
