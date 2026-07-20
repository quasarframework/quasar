---
title: Separator
description: The QSeparator Vue component is used to separate sections of text or other components or elements. It creates a colored line across the width of the parent. It can be horizontal or vertical.
canonical: https://quasar.dev/vue-components/separator
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QSeparator](../../api/QSeparator.md)

The QSeparator component is used to separate sections of text, other components, etc... It creates a colored line across the width of the parent. It can be horizontal or vertical.

**API reference:** [QSeparator](../../api/QSeparator.md)

## Usage

Take the following just as examples. Doesn't mean you can use QSeparator only on QCard, QList or QToolbar.

**Example: Horizontal**

Source: [Horizontal.vue](../../examples/QSeparator/Horizontal.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-card flat bordered style="max-width: 250px">
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by John Doe</div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn label="Share" color="primary" flat />
          <q-btn label="Comment" color="secondary" flat />
        </q-card-actions>
      </q-card>

      <q-list
        class="bg-grey-9 text-white shadow-2 rounded-borders"
        style="max-width: 250px; width: 100%"
      >
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar6.jpg" />
            </q-avatar>
          </q-item-section>
          <q-item-section>Jane</q-item-section>
        </q-item>

        <q-separator dark />

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar3.jpg" />
            </q-avatar>
          </q-item-section>
          <q-item-section>Lily</q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
            </q-avatar>
          </q-item-section>
          <q-item-section>Mary</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
````

**Example: Horizontal with inset**

Source: [HorizontalWithInset.vue](../../examples/QSeparator/HorizontalWithInset.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-card flat bordered style="max-width: 250px">
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by John Doe</div>
        </q-card-section>

        <q-separator inset />

        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </q-card-section>
      </q-card>

      <q-list
        class="shadow-2 rounded-borders"
        style="max-width: 250px; width: 100%"
      >
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar6.jpg" />
            </q-avatar>
          </q-item-section>
          <q-item-section>Jane</q-item-section>
        </q-item>

        <q-separator inset="item" />

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar3.jpg" />
            </q-avatar>
          </q-item-section>
          <q-item-section>Lily</q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
            </q-avatar>
          </q-item-section>
          <q-item-section>Mary</q-item-section>
        </q-item>
      </q-list>

      <q-list
        class="shadow-2 rounded-borders"
        style="max-width: 250px; width: 100%"
      >
        <q-item>
          <q-item-section thumbnail>
            <img src="https://cdn.quasar.dev/img/mountains.jpg" />
          </q-item-section>
          <q-item-section>Mountains</q-item-section>
        </q-item>

        <q-separator inset="item-thumbnail" />

        <q-item>
          <q-item-section thumbnail>
            <img src="https://cdn.quasar.dev/img/parallax1.jpg" />
          </q-item-section>
          <q-item-section>Venice</q-item-section>
        </q-item>

        <q-item>
          <q-item-section thumbnail>
            <img src="https://cdn.quasar.dev/img/parallax2.jpg" />
          </q-item-section>
          <q-item-section>The Bridge</q-item-section>
        </q-item>
      </q-list>

      <q-list
        class="bg-grey-9 text-white shadow-2 rounded-borders"
        style="max-width: 250px; width: 100%"
      >
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar6.jpg" />
            </q-avatar>
          </q-item-section>
          <q-item-section>Jane</q-item-section>
        </q-item>

        <q-separator inset dark />

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar3.jpg" />
            </q-avatar>
          </q-item-section>
          <q-item-section>Lily</q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
            </q-avatar>
          </q-item-section>
          <q-item-section>Mary</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
````

**Example: Vertical**

Source: [Vertical.vue](../../examples/QSeparator/Vertical.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-toolbar class="bg-orange shadow-2 rounded-borders">
        <q-btn flat round dense icon="menu" class="q-mr-sm" />

        <q-separator vertical inset />

        <q-btn stretch flat label="Link" />

        <q-space />

        <q-btn stretch flat label="Link" />

        <q-separator vertical />

        <q-btn stretch flat label="Link" />

        <q-separator vertical />

        <q-btn stretch flat label="Link" />
      </q-toolbar>

      <q-toolbar class="bg-primary text-white shadow-2 rounded-borders">
        <q-btn flat round dense icon="menu" class="q-mr-sm" />

        <q-separator dark vertical inset />

        <q-btn stretch flat label="Link" />

        <q-space />

        <q-btn stretch flat label="Link" />

        <q-separator dark vertical />

        <q-btn stretch flat label="Link" />

        <q-separator dark vertical />

        <q-btn stretch flat label="Link" />
      </q-toolbar>
    </div>
  </div>
</template>
````

**Example: Custom colored**

Source: [Colored.vue](../../examples/QSeparator/Colored.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-list
      class="bg-grey-9 text-white shadow-2 rounded-borders"
      style="max-width: 250px; width: 100%"
    >
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar6.jpg" />
          </q-avatar>
        </q-item-section>
        <q-item-section>Jane</q-item-section>
      </q-item>

      <q-separator color="orange" inset />

      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar3.jpg" />
          </q-avatar>
        </q-item-section>
        <q-item-section>Lily</q-item-section>
      </q-item>

      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
          </q-avatar>
        </q-item-section>
        <q-item-section>Mary</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
````

## Color CSS classes

Should you need, there are four special Quasar CSS classes which apply the color of QSeparator: `text-separator`, `bg-separator`, `text-dark-separator`, `bg-dark-separator`.
