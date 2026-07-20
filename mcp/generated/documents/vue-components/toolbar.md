---
title: Toolbar
description: The QToolbar and QToolbarTitle Vue components are usually part of QHeader or QFooter, but it can be used anywhere on the page.
canonical: https://quasar.dev/vue-components/toolbar
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QToolbar](../../api/QToolbar.md)
- [QToolbarTitle](../../api/QToolbarTitle.md)

QToolbar is a component usually part of Layout Header and Footer, but it can be used anywhere on the page.

**API reference:** [QToolbar](../../api/QToolbar.md)

**API reference:** [QToolbarTitle](../../api/QToolbarTitle.md)

## Usage

**Example: Basic**

Source: [Basic.vue](../../examples/QToolbar/Basic.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-y-sm">
    <q-toolbar class="text-primary">
      <q-btn flat round dense icon="menu" />
      <q-toolbar-title> Toolbar </q-toolbar-title>
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>

    <q-toolbar class="bg-grey-9 text-white">
      <q-btn flat round dense>
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title> Toolbar </q-toolbar-title>
      <q-btn flat round dense>
        <q-icon name="more_vert" />
      </q-btn>
    </q-toolbar>

    <q-toolbar class="bg-purple text-white">
      <q-btn flat round dense icon="assignment_ind" />
      <q-toolbar-title> Toolbar </q-toolbar-title>
      <q-btn flat round dense icon="apps" class="q-mr-xs" />
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>

    <q-toolbar class="bg-black text-white">
      <q-btn flat round dense icon="assignment_ind">
        <q-badge floating color="red">2</q-badge>
      </q-btn>
      <q-toolbar-title> Toolbar </q-toolbar-title>
      <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
      <q-btn flat round dense icon="gamepad" />
    </q-toolbar>
  </div>
</template>
````

**Example: With Avatar**

Source: [Avatar.vue](../../examples/QToolbar/Avatar.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="menu" class="q-mr-sm" />
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
      </q-avatar>

      <q-toolbar-title>Quasar Framework</q-toolbar-title>

      <q-btn flat round dense icon="whatshot" />
    </q-toolbar>
  </div>
</template>
````

You can use the `glossy` class to make the toolbar glossy.

**Example: Glossy**

Source: [Glossy.vue](../../examples/QToolbar/Glossy.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-primary glossy text-white">
      <q-btn flat round dense icon="menu" class="q-mr-sm" />
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
      </q-avatar>

      <q-toolbar-title>Quasar Framework</q-toolbar-title>

      <q-btn flat round dense icon="whatshot" />
    </q-toolbar>
  </div>
</template>
````

**Example: Grouped vertically**

Source: [GroupedVertically.vue](../../examples/QToolbar/GroupedVertically.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-y-sm">
    <div class="bg-orange text-white">
      <q-toolbar>
        <q-btn flat round dense icon="menu" class="q-mr-sm" />
        <q-space />
        <q-btn flat round dense icon="search" class="q-mr-xs" />
        <q-btn flat round dense icon="group_add" />
      </q-toolbar>
      <q-toolbar inset>
        <q-toolbar-title><strong>Quasar</strong> Framework</q-toolbar-title>
      </q-toolbar>
    </div>

    <div class="bg-cyan text-white">
      <q-toolbar>
        <q-btn flat round dense icon="assignment_ind" />

        <q-space />

        <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
        <q-btn flat round dense icon="gamepad" />
      </q-toolbar>

      <q-toolbar inset>
        <q-breadcrumbs active-color="white" style="font-size: 16px">
          <q-breadcrumbs-el label="Home" icon="home" />
          <q-breadcrumbs-el label="Components" icon="widgets" />
          <q-breadcrumbs-el label="Toolbar" />
        </q-breadcrumbs>
      </q-toolbar>
    </div>
  </div>
</template>
````

**Example: Grouped horizontally**

Source: [GroupedHorizontally.vue](../../examples/QToolbar/GroupedHorizontally.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row no-wrap shadow-1">
      <q-toolbar
        class="col-8"
        :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-3'"
      >
        <q-btn flat round dense icon="menu" />
        <q-toolbar-title>Title</q-toolbar-title>
        <q-btn flat round dense icon="search" />
      </q-toolbar>
      <q-toolbar class="col-4 bg-primary text-white">
        <q-space />
        <q-btn flat round dense icon="bluetooth" class="q-mr-sm" />
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>
    </div>
  </div>
</template>
````

**Example: With Tabs**

Source: [WithTabs.vue](../../examples/QToolbar/WithTabs.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-purple text-white shadow-2 rounded-borders">
      <q-btn flat label="Homepage" />
      <q-space />

      <!--
        notice shrink property since we are placing it
        as child of QToolbar
      -->
      <q-tabs v-model="tab" shrink>
        <q-tab name="tab1" label="Tab 1" />
        <q-tab name="tab2" label="Tab 2" />
        <q-tab name="tab3" label="Tab 3" />
      </q-tabs>
    </q-toolbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('')
</script>
````

**Example: With Button Dropdown**

Source: [WithDropdown.vue](../../examples/QToolbar/WithDropdown.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-primary text-white q-my-md shadow-2">
      <q-btn flat round dense icon="menu" class="q-mr-sm" />
      <q-separator dark vertical inset />
      <q-btn stretch flat label="Link" />

      <q-space />

      <q-btn-dropdown stretch flat label="Dropdown">
        <q-list>
          <q-item-label header>Folders</q-item-label>
          <q-item
            v-for="n in 3"
            :key="`x.${n}`"
            clickable
            v-close-popup
            tabindex="0"
          >
            <q-item-section avatar>
              <q-avatar icon="folder" color="secondary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>February 22, 2016</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" />
            </q-item-section>
          </q-item>
          <q-separator inset spaced />
          <q-item-label header>Files</q-item-label>
          <q-item
            v-for="n in 3"
            :key="`y.${n}`"
            clickable
            v-close-popup
            tabindex="0"
          >
            <q-item-section avatar>
              <q-avatar icon="assignment" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Vacation</q-item-label>
              <q-item-label caption>February 22, 2016</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-separator dark vertical />
      <q-btn stretch flat label="Link" />
      <q-separator dark vertical />
      <q-btn stretch flat label="Link" />
    </q-toolbar>
  </div>
</template>
````

**Example: With Button Toggle**

Source: [WithBtnToggle.vue](../../examples/QToolbar/WithBtnToggle.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-secondary text-white q-my-md shadow-2">
      <q-btn flat round dense icon="menu" class="q-mr-sm" />

      <q-space />

      <q-btn-toggle
        v-model="model"
        flat
        stretch
        toggle-color="yellow"
        :options="options"
      />
    </q-toolbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('one')
const options = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
  { label: 'Three', value: 'three' }
]
</script>
````
