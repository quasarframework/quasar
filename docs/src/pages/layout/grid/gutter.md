---
title: Grid Gutter
desc: How to use the Quasar grid for gutter spaces.
examples: grid
related:
  - /layout/grid/introduction-to-flexbox
  - /layout/grid/row
  - /layout/grid/column
  - /layout/grid/flex-playground
---

In the hope that you've previously read the [Introduction to Flexbox](/layout/grid/introduction-to-flexbox) theory, let's get deeper into Gutters.

Gutter Quasar CSS classes offer an easy way to space out elements (especially in a [Grid Row](/layout/grid/row)) one from each other at equal distance.

## Types
There are two main types of gutters depending on your use-case: `q-gutter-{size}` and `q-col-gutter-{size}`. The first is to be used when the elements that you want to distance one from each other don't use `col-*` or `offset-*` classes that specify a width, and the latter is to be used when they do have `col-*` or `offset-*` classes specifying a width.

::: tip
Suffixes (`-none`, `-xs`, `-sm`, `-md`, `-lg`, `-xl`) do not refer to device screen size, but to the size of gutter between elements.
:::

## Classes "q-gutter-{size}"

::: warning
The `q-gutter-*` classes apply a **negative top and left margins** to the parent and a **positive top and left margins** to the children. Take this into account when working with the other [Spacing classes](/style/spacing) so as to not to break the gutter's css.
:::

These classes are to be used when the direct children don't have `col-*` or `offset-*` classes specifying a width.

<doc-example title="Sizes for q-gutter" file="GutterSize" />

There's also the `q-gutter-none` class (equivalent to: no gutter applied) which wasn't included in the example above.

<doc-example title="Horizontal only q-gutter" file="GutterHorizontal" />

<doc-example title="Vertical only q-gutter" file="GutterVertical" />

<doc-example title="Mixed horizontal and vertical q-gutter" file="GutterMixed" />

## Classes "q-col-gutter-{size}"

::: warning
The `q-col-gutter-*` classes apply a **negative top and left margins** to the parent and a **positive top and left paddings** to the children. Take this into account when working with the other [Spacing classes](/style/spacing) so as to not to break the gutter's css.
:::

These classes are to be used when the direct children have `col-*` or `offset-*` classes that specify a width.

<doc-example title="Sizes for q-col-gutter" file="ColGutterSize" />

<doc-example title="Horizontal only q-col-gutter" file="ColGutterHorizontal" />

<doc-example title="Vertical only q-col-gutter" file="ColGutterVertical" />

<doc-example title="Mixed horizontal and vertical q-col-gutter" file="ColGutterMixed" />

## Pros, cons and how to workaround problems - "q-gutter-{size}" vs. "q-col-gutter-{size}"

Both set of classes have pros and cons.

::: warning
Because both `q-gutter-*` and `q-col-gutter-*` classes apply a **negative top and left margins** to the parent you should not apply styling targeting background, margin or border related properties on the parent.

Instead you need to wrap them in a container, apply the styling on the container, and add `overflow-auto` or `row` class **on the container**
:::

<doc-example title="Parent styling" file="ParentStyling" />

::: tip
The `q-gutter-*` classes **do not change** the internal dimensions of the children, so you can use `background` or `border` directly on children.
:::

::: warning
The `q-gutter-*` classes **do change** the external dimensions of the children, so you cannot use `col-*` or `offset-*` classes specifying a width on children anymore.
:::

<doc-example title="Children size compare" file="ChildrenSizeCompare" />

::: warning
Because `q-col-gutter-*` classes apply a **negative top and left padding** to the children you should not apply styling targeting background, padding or border related properties on the children. Instead you need to put the styled element inside the child and apply the styling on that element.
:::

<doc-example title="Children styling" file="ChildrenStyling" />

## Flex Grid Playground
To see the Flex in action, you can use the Flex Playground to interactively learn more.

<q-btn icon-right="launch" label="Flex Playground" to="/layout/grid/flex-playground" />
