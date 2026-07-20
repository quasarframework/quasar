---
title: Button Group
description: The QBtnGroup Vue component groups QBtn and QBtnDropdown into a single unit.
canonical: https://quasar.dev/vue-components/button-group
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QBtnGroup](../../api/QBtnGroup.md)

You can conveniently group [QBtn](/vue-components/button) and [QBtnDropdown](/vue-components/button-dropdown) using QBtnGroup. Be sure to check those component's respective pages to see their props and methods.

**API reference:** [QBtnGroup](../../api/QBtnGroup.md)

## Usage

**Example: Examples**

Source: [Group.vue](../../examples/QBtnGroup/Group.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-y-md column items-start">
    <q-btn-group push>
      <q-btn push label="First" icon="timeline" />
      <q-btn push label="Second" icon="visibility" />
      <q-btn push label="Third" icon="update" />
    </q-btn-group>

    <q-btn-group push>
      <q-btn
        color="yellow"
        glossy
        text-color="black"
        push
        label="First"
        icon="verified_user"
      />
      <q-btn color="amber" glossy text-color="black" push label="Second" />
      <q-btn color="orange" glossy text-color="black" push label="Third" />
    </q-btn-group>

    <q-btn-group outline>
      <q-btn outline color="brown" label="First" />
      <q-btn outline color="brown" label="Second" icon-right="watch_later" />
      <q-btn outline color="brown" label="Third" />
    </q-btn-group>

    <q-btn-group>
      <q-btn color="secondary" glossy label="First" />
      <q-btn color="secondary" glossy label="Second" />
      <q-btn color="secondary" glossy label="Third" />
      <q-btn color="secondary" glossy label="Fourth" />
    </q-btn-group>

    <q-btn-group>
      <q-btn color="accent" icon="timeline" />
      <q-btn color="accent" icon="visibility" />
      <q-btn color="accent" icon="update" />
    </q-btn-group>

    <q-btn-group rounded>
      <q-btn color="amber" rounded glossy icon="timeline" />
      <q-btn color="amber" rounded glossy icon="visibility" />
      <q-btn color="amber" rounded glossy icon-right="update" label="Update" />
    </q-btn-group>
  </div>
</template>
````

::: warning
You must use same design props (flat, outline, push, ...) on both the parent QBtnGroup and the children QBtn/QBtnDropdown.
:::

**Example: Spread horizontally**

Source: [GroupSpread.vue](../../examples/QBtnGroup/GroupSpread.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn-group spread>
      <q-btn color="purple" label="First" icon="timeline" />
      <q-btn color="purple" label="Second" icon="visibility" />
    </q-btn-group>
  </div>
</template>
````

**Example: With QBtnDropdown**

Source: [WithDropdown.vue](../../examples/QBtnGroup/WithDropdown.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-btn-group rounded>
      <q-btn rounded color="primary" label="One" />

      <q-btn rounded color="primary" label="Two" />

      <q-btn-dropdown auto-close rounded color="primary" label="Three" split>
        <!-- dropdown content goes here -->
        <q-list padding style="width: 250px">
          <q-item clickable>
            <q-item-section avatar>
              <q-avatar icon="folder" color="purple" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>February 22, 2016</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section avatar>
              <q-avatar icon="folder" color="purple" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Videos</q-item-label>
              <q-item-label caption>London</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>

          <q-separator inset />
          <q-item-label header>Files</q-item-label>

          <q-item clickable>
            <q-item-section avatar>
              <q-avatar icon="assignment" color="teal" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>London</q-item-label>
              <q-item-label caption>March 1st, 2018</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section avatar>
              <q-avatar icon="assignment" color="teal" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Paris</q-item-label>
              <q-item-label caption>January 22nd, 2017</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-btn-group>
  </div>
</template>
````
