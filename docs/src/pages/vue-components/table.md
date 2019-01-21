---
title: Table
---

QTable is a component that allows you to display data in a tabular manner. It packs the following main features:
  * Filtering
  * Sorting
  * Single / Multiple rows selection with custom selection actions
  * Pagination (including server-side if required)
  * Grid mode (you can use for example QCards to display data in a non tabular manner)

::: tip
If you don't need pagination, sorting, filtering, and all other features of QTable, then you may want to check out [QMarkupTable](/vue-components/markup-table) component instead.
:::

## Installation
<doc-installation :components="['QTable', 'QTh', 'QTr', 'QTd']" />

## Usage
<doc-example title="Standard" file="QTable/Standard" />

### Server side backend

## API
<doc-api file="QTable" />
