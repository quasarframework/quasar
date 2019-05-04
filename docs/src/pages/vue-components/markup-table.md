---
title: Markup Table
related:
  - /vue-components/table
---

The QMarkupTable is a way for you to simply wrap a native `<table>` in order to make it look like a Material Design table.

::: tip
For advanced functionality like pagination, sorting, filtering, and many more, you may want to check out [QTable](/vue-components/table) component instead.
:::

## Installation
<doc-installation components="QMarkupTable" />

## Usage
::: tip
Notice that the content of `QMarkupTable` reflects an accurate markup representation of a native HTML `<table>`, having a `<thead>` and `<tbody>` to wrap header and table body. This is required.
:::
::: warning IMPORTANT NOTE!
This component will *NOT* work within the UMD version of Quasar. This is due to the autocorrection facility built into browsers for table HTML. 
:::

<doc-example title="Basic" file="QMarkupTable/Basic" no-edit />

<doc-example title="Separators" file="QMarkupTable/Separators" no-edit />

<doc-example title="Dark" file="QMarkupTable/Dark" no-edit />

<doc-example title="Customization" file="QMarkupTable/Customization" no-edit />

## QMarkupTable API
<doc-api file="QMarkupTable" />
