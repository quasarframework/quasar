---
title: QSpace
description: The QSpace Vue component fills all the available space inside of a flexbox DOM element.
canonical: https://quasar.dev/vue-components/space
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QSpace](../../api/QSpace.md)

The purpose of QSpace (has no props) is to simply fill all available space inside of a flexbox DOM element.

As a sidenote, all Quasar components use flexbox. So what this means, for example (there are numerous examples, just mentioning one), is that you can use QSpace in a QToolbar.

## Usage

These are only two examples so you can get a glimpse on how to use it.

**Example: Basic**

Source: [Basic.vue](../../examples/QSpace/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="menu" />

      <q-space />

      <q-btn flat round dense icon="apps" class="q-mr-xs" />
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>

    <div
      class="row no-wrap items-center q-mt-md q-pa-sm bg-grey-9 text-white rounded-borders"
    >
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg" />
      </q-avatar>

      <q-space />

      <div>
        Quasar <q-badge>v{{ $q.version }}</q-badge>
      </div>
    </div>
  </div>
</template>
````
