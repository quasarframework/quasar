---
title: Markup Table
desc: The QMarkupTable Vue component is a helper wrapper which styles a native table.
keys: QMarkupTable
related:
  - /vue-components/table
---

The QMarkupTable is a way for you to simply wrap a native `<table>` in order to make it look like a Material Design table.

::: tip
For advanced functionality like pagination, sorting, filtering, and many more, you may want to check out [QTable](/vue-components/table) component instead.
:::

## QMarkupTable API

<doc-api file="QMarkupTable" />

## Usage

::: warning
Notice that the content of `QMarkupTable` reflects an accurate markup representation of a native HTML `<table>`, having a `<thead>` and `<tbody>` to wrap header and table body. This is required.
:::

::: warning UMD developers
This component will *NOT* work as-is within the UMD version of Quasar. Browsers parse the template HTML before Vue kicks in and renders it, so the markup needs to be correct. `<q-markup-table> <thead>` or `<q-markup-table> <tbody>` is not. The solution is to directly use the QMarkupTable Vue rendered tag (`<table class="....`).
:::

<doc-example title="Basic" file="QMarkupTable/Basic" no-edit />

<doc-example title="Separators" file="QMarkupTable/Separators" no-edit />

<doc-example title="Dark" file="QMarkupTable/Dark" no-edit />

<doc-example title="Customization" file="QMarkupTable/Customization" no-edit />

::: tip
If you want to remove the hover effect on some rows or some cells add a `q-tr--no-hover` or `q-td--no-hover` class to them.
:::
