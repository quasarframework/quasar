---
title: Grid Gutter
description: How to use the Quasar grid for gutter spaces.
canonical: https://quasar.dev/layout/grid/gutter
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

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

**Example: Sizes for q-gutter**

Source: [GutterSize.vue](../../../examples/grid/GutterSize.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 500px">
    <p>q-gutter-xs</p>
    <div class="q-gutter-xs">
      <q-btn color="brown" label="Button" v-for="n in 7" :key="`xs-${n}`" />
    </div>

    <p class="q-mt-md">q-gutter-sm</p>
    <div class="q-gutter-sm">
      <q-btn color="teal" label="Button" v-for="n in 7" :key="`sm-${n}`" />
    </div>

    <p class="q-mt-md">q-gutter-md</p>
    <div class="q-gutter-md">
      <q-btn color="accent" label="Button" v-for="n in 7" :key="`md-${n}`" />
    </div>

    <p class="q-mt-md">q-gutter-lg</p>
    <div class="q-gutter-lg">
      <q-btn color="red" label="Button" v-for="n in 7" :key="`lg-${n}`" />
    </div>

    <p class="q-mt-md">q-gutter-xl</p>
    <div class="q-gutter-xl">
      <q-btn color="indigo" label="Button" v-for="n in 7" :key="`xl-${n}`" />
    </div>
  </div>
</template>
````

There's also the `q-gutter-none` class (equivalent to: no gutter applied) which wasn't included in the example above.

**Example: Horizontal only q-gutter**

Source: [GutterHorizontal.vue](../../../examples/grid/GutterHorizontal.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-x-md">
      <q-btn color="primary" label="Button" v-for="n in 3" :key="n" />
    </div>
  </div>
</template>
````

**Example: Vertical only q-gutter**

Source: [GutterVertical.vue](../../../examples/grid/GutterVertical.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 500px">
    <div class="q-gutter-y-md">
      <q-btn color="teal" label="Button" v-for="n in 10" :key="n" />
    </div>
  </div>
</template>
````

**Example: Mixed horizontal and vertical q-gutter**

Source: [GutterMixed.vue](../../../examples/grid/GutterMixed.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 400px">
    <div class="q-gutter-x-xs q-gutter-y-lg">
      <q-btn color="purple" label="Button" v-for="n in 10" :key="n" />
    </div>
  </div>
</template>
````

## Classes "q-col-gutter-{size}"

::: warning
The `q-col-gutter-*` classes apply a **negative top and left margins** to the parent and a **positive top and left paddings** to the children. Take this into account when working with the other [Spacing classes](/style/spacing) so as to not to break the gutter's css.
:::

These classes are to be used when the direct children have `col-*` or `offset-*` classes that specify a width.

**Example: Sizes for q-col-gutter**

Source: [ColGutterSize.vue](../../../examples/grid/ColGutterSize.vue)

````vue
<template>
  <div class="q-pa-md example-col-gutter-size">
    <div class="row q-col-gutter-none">
      <div class="col-4" v-for="n in 5" :key="`none-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>

    <q-separator spaced />

    <div class="row q-col-gutter-xs">
      <div class="col-4" v-for="n in 5" :key="`xs-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>

    <q-separator spaced />

    <div class="row q-col-gutter-sm">
      <div class="col-4" v-for="n in 5" :key="`sm-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>

    <q-separator spaced />

    <div class="row q-col-gutter-md">
      <div class="col-4" v-for="n in 5" :key="`md-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>

    <q-separator spaced />

    <div class="row q-col-gutter-lg">
      <div class="col-4" v-for="n in 5" :key="`lg-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>

    <q-separator spaced />

    <div class="row q-col-gutter-xl">
      <div class="col-4" v-for="n in 5" :key="`xl-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-col-gutter-size
  .my-content
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
</style>
````

**Example: Horizontal only q-col-gutter**

Source: [ColGutterHorizontal.vue](../../../examples/grid/ColGutterHorizontal.vue)

````vue
<template>
  <div class="q-pa-md example-col-gutter-horizontal">
    <div class="row q-col-gutter-x-md">
      <div class="col-4" v-for="n in 5" :key="`none-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-col-gutter-horizontal
  .my-content
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
</style>
````

**Example: Vertical only q-col-gutter**

Source: [ColGutterVertical.vue](../../../examples/grid/ColGutterVertical.vue)

````vue
<template>
  <div class="q-pa-md example-col-gutter-vertical">
    <div class="row q-col-gutter-y-md">
      <div class="col-4" v-for="n in 5" :key="`none-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-col-gutter-vertical
  .my-content
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
</style>
````

**Example: Mixed horizontal and vertical q-col-gutter**

Source: [ColGutterMixed.vue](../../../examples/grid/ColGutterMixed.vue)

````vue
<template>
  <div class="q-pa-md example-col-gutter-mixed">
    <div class="row q-col-gutter-x-xs q-col-gutter-y-lg">
      <div class="col-4" v-for="n in 5" :key="`none-${n}`">
        <div class="my-content">&nbsp;</div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.example-col-gutter-mixed
  .my-content
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
</style>
````

## Pros, cons and how to workaround problems - "q-gutter-{size}" vs. "q-col-gutter-{size}"

Both set of classes have pros and cons.

::: warning
Because both `q-gutter-*` and `q-col-gutter-*` classes apply a **negative top and left margins** to the parent you should not apply styling targeting background, margin or border related properties on the parent.

Instead you need to wrap them in a container, apply the styling on the container, and add `overflow-auto` or `row` class **on the container**
:::

**Example: Parent styling**

Source: [ParentStyling.vue](../../../examples/grid/ParentStyling.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 500px">
    <div class="row">
      <div class="offset-1 col-3 column justify-between">
        <p>Styling on parent</p>
        <div class="text-dark">
          <div class="bg-amber q-pa-sm">Amber block</div>
          <div class="row q-gutter-lg bg-blue-4">
            <div class="q-pa-md bg-blue-10 text-white" v-for="n in 4" :key="n"
              >C</div
            >
          </div>
        </div>
      </div>
      <div class="offset-1 col-3 column justify-between">
        <p>Styling on wrapper - .row</p>
        <div class="text-dark">
          <div class="bg-amber q-pa-sm">Amber block</div>
          <div class="bg-blue-4 row">
            <div class="row q-gutter-lg">
              <div class="q-pa-md bg-blue-10 text-white" v-for="n in 4" :key="n"
                >C</div
              >
            </div>
          </div>
        </div>
      </div>
      <div class="offset-1 col-3 column justify-between">
        <p>Styling on wrapper - .overflow-auto</p>
        <div class="text-dark">
          <div class="bg-amber q-pa-sm">Amber block</div>
          <div class="bg-blue-4 overflow-auto">
            <div class="row q-gutter-lg">
              <div class="q-pa-md bg-blue-10 text-white" v-for="n in 4" :key="n"
                >C</div
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
````

::: tip
The `q-gutter-*` classes **do not change** the internal dimensions of the children, so you can use `background` or `border` directly on children.
:::

::: warning
The `q-col-gutter-*` classes **do change** the external dimensions of the children, so you cannot use `col-*` or `offset-*` classes specifying a width on children anymore.
:::

**Example: Children size compare**

Source: [ChildrenSizeCompare.vue](../../../examples/grid/ChildrenSizeCompare.vue)

````vue
<template>
  <div class="q-px-xl q-py-md" style="max-width: 500px">
    <p>.q-gutter and unsized children</p>
    <div class="row text-dark">
      <div class="col bg-amber">
        <div class="row q-gutter-lg">
          <div :class="`bg-blue-${n + 1}`" v-for="n in 7" :key="n"> Child </div>
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p>.q-col-gutter and unsized children</p>
    <div class="row text-black">
      <div class="col bg-amber q-mt-lg">
        <div class="row q-col-gutter-lg">
          <div
            class="semi-transparent"
            :class="`bg-blue-${n + 1}`"
            v-for="n in 7"
            :key="n"
          >
            Child
          </div>
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p
      >.q-gutter and .col-6 sized children - 2 .col-6 adds up to
      <strong>more than 100%</strong></p
    >
    <div class="row text-dark">
      <div class="col bg-amber">
        <div class="row q-gutter-lg">
          <div
            class="col-6"
            :class="`bg-blue-${n + 1}`"
            v-for="n in 5"
            :key="n"
          >
            Child
          </div>
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p
      >.q-col-gutter and .col-6 sized children - 2 .col-6 adds up to
      <strong>100%</strong></p
    >
    <div class="row text-dark">
      <div class="col bg-amber q-mt-lg">
        <div class="row q-col-gutter-lg">
          <div
            class="semi-transparent col-6"
            :class="`bg-blue-${n + 1}`"
            v-for="n in 5"
            :key="n"
          >
            Child
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.semi-transparent
  opacity: .7
</style>
````

::: warning
Because `q-col-gutter-*` classes apply a **negative top and left padding** to the children you should not apply styling targeting background, padding or border related properties on the children. Instead you need to put the styled element inside the child and apply the styling on that element.
:::

**Example: Children styling**

Source: [ChildrenStyling.vue](../../../examples/grid/ChildrenStyling.vue)

````vue
<template>
  <div class="q-px-xl q-py-md" style="max-width: 500px">
    <p>.q-col-gutter with styling on children</p>
    <div class="row text-dark">
      <div class="col bg-amber q-mt-lg">
        <div class="row q-col-gutter-lg">
          <div
            class="semi-transparent col-6 q-pa-md text-center"
            :class="`bg-blue-${n + 1}`"
            v-for="n in 5"
            :key="n"
          >
            Child
          </div>
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p>.q-col-gutter with styling on the element inside children</p>
    <div class="row text-dark">
      <div class="col bg-amber">
        <div class="row q-col-gutter-lg">
          <div class="col-6" v-for="n in 5" :key="n">
            <div class="q-pa-md text-center" :class="`bg-blue-${n + 1}`">
              Child
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p>.q-col-gutter with direct QBtn children</p>
    <div class="row text-dark rounded-borders">
      <div class="col bg-amber q-mt-lg">
        <div class="row q-col-gutter-lg">
          <q-btn
            class="semi-transparent col-6"
            color="primary"
            label="Button"
            v-for="n in 5"
            :key="`md-${n}`"
          />
        </div>
      </div>
    </div>

    <q-separator class="q-my-md" />

    <p>.q-col-gutter with QBtn inside children</p>
    <div class="row text-dark rounded-borders">
      <div class="col bg-amber">
        <div class="row q-col-gutter-lg">
          <div class="col-6" v-for="n in 5" :key="n">
            <q-btn class="full-width" color="primary" label="Button" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.semi-transparent
  opacity: .7
</style>
````

## Flex Grid Playground

To see the Flex in action, you can use the Flex Playground to interactively learn more.

<q-btn icon-right="launch" label="Flex Playground" to="/layout/grid/flex-playground" />
