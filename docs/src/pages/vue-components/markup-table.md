---
title: Markup Table
desc: The QMarkupTable Vue component is a helper wrapper which styles a native table.
keys: QMarkupTable
examples: QMarkupTable
related:
  - /vue-components/table
---

The QMarkupTable is a way for you to simply wrap a native `<table>` in order to make it look like a Material Design table.

::: tip
For advanced functionality like pagination, sorting, filtering, and many more, you may want to check out [QTable](/vue-components/table) component instead.
:::

<DocApi file="QMarkupTable" />

## Usage

::: warning
Notice that the content of `QMarkupTable` reflects an accurate markup representation of a native HTML `<table>`, having a `<thead>` and `<tbody>` to wrap header and table body. This is required.
:::

::: warning UMD developers
This component will *NOT* work as-is within the UMD version of Quasar. Browsers parse the template HTML before Vue kicks in and renders it, so the markup needs to be correct. `<q-markup-table> <thead>` or `<q-markup-table> <tbody>` is not. The solution is to wrap the content in a `<template>` like the following:

<br>

```html
<q-markup-table>
  <template>
    <!-- your content -->
  </template>
</q-markup-table>
```
:::

<DocExample title="Basic" file="Basic" no-edit />

<DocExample title="Separators" file="Separators" no-edit />

<DocExample title="Force dark mode" file="Dark" no-edit />

<DocExample title="Customization" file="Customization" no-edit />

::: tip
If you want to remove the hover effect on some rows or some cells add a `q-tr--no-hover` or `q-td--no-hover` class to them.
:::
