---
title: Grid Gutter
---

In the hope that you've previously read the [Introduction to Flexbox](/layout/grid/introduction-to-flexbox) theory, let's get deeper into Gutters.

Gutter Quasar CSS classes offer an easy way to space out elements (especially in a [Grid Row](/layout/grid/row)) one from each other at equal distance.

## Types
There are two main types of gutters depending on your use-case: `q-gutter-{size}` and `q-col-gutter-{size}`. The first is to be used when the elements that you want to distance one from each other don't use `col-*` classes, and the latter is to be used when they do have `col-*` classes.

::: tip
Suffixes (`-none`, `-xs`, `-sm`, `-md`, `-lg`, `-xl`) do not refer to device screen size, but to the size of gutter between elements.
:::

## Classes "q-gutter-{size}"

<doc-example title="Sizes for q-gutter" file="grid/GutterSize" />

There's also the `q-gutter-none` class (equivalent to: no gutter applied) which wasn't included in the example above.

<doc-example title="Horizontal only q-gutter" file="grid/GutterHorizontal" />

<doc-example title="Vertical only q-gutter" file="grid/GutterVertical" />

<doc-example title="Mixed horizontal and vertical q-gutter" file="grid/GutterMixed" />

## Classes "q-col-gutter-{size}"

<doc-example title="Sizes for q-col-gutter" file="grid/ColGutterSize" />

<doc-example title="Horizontal only q-col-gutter" file="grid/ColGutterHorizontal" />

<doc-example title="Vertical only q-col-gutter" file="grid/ColGutterVertical" />

<doc-example title="Mixed horizontal and vertical q-col-gutter" file="grid/ColGutterMixed" />
