---
title: Table
desc: The QTable Vue component allows you to display data in a tabular manner and it's packed with a lot of related features. It's generally called a datatable.
related:
  - /vue-components/markup-table
  - /vue-components/pagination
---

QTable is a component that allows you to display data in a tabular manner. It's generally called a datatable. It packs the following main features:
  * Filtering
  * Sorting
  * Single / Multiple rows selection with custom selection actions
  * Pagination (including server-side if required)
  * Grid mode (you can use for example QCards to display data in a non-tabular manner)
  * Total customization of rows and cells through scoped slots
  * Ability to add additional row(s) at top or bottom of data rows
  * Column picker (through QTableColumns component described in one of the sections)
  * Custom top and/or bottom Table controls
  * Responsive design

::: tip
If you don't need pagination, sorting, filtering, and all other features of QTable, then you may want to check out [QMarkupTable](/vue-components/markup-table) component instead.
:::

## Installation
<doc-installation :components="['QTable', 'QTh', 'QTr', 'QTd']" />

## Defining the columns

Let’s take an example of configuring the `columns` property. We are going to tell QTable that `row-key` is ‘name’, which **must** be unique. If this was data fetched from a database we would likely use the row **id**.

```js
columns: [ // array of Objects
  // column Object definition
  {
    // unique id (used by row-key, pagination.sortBy, ...)
    name: 'desc',

    // label for header
    label: 'Dessert (100g serving)',

    // row Object property to determine value for this column
    field: 'name',
    // OR field: row => row.some.nested.prop

    // (optional) if we use visible-columns, this col will always be visible
    required: true,

    // (optional) alignment
    align: 'left',

    // (optional) tell QTable you want this column sortable
    sortable: true,

    // (optional) compare function if you have
    // some custom data or want a specific way to compare two rows
    sort: (a, b, rowA, rowB) => parseInt(a, 10) - parseInt(b, 10)
    // function return value:
    //   * is less than 0 then sort a to an index lower than b, i.e. a comes first
    //   * is 0 then leave a and b unchanged with respect to each other, but sorted with respect to all different elements
    //   * is greater than 0 then sort b to an index lower than a, i.e. b comes first

    // (optional) you can format the data with a function
    format: (val, row) => `${val}%`

    // v0.17.9+; if using scoped slots, apply this yourself instead
    style: 'width: 500px',
    classes: 'my-special-class'
  },
  { name: 'calories', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
]
```

## Usage


### Basic

<doc-example title="Basic" file="QTable/Basic" />

<doc-example title="Dark" file="QTable/Dark" />

<doc-example title="Dense" file="QTable/Dense" />

::: tip
You can use the `dense` prop along with `$q.screen` to create a responsive behavior. Example: `:dense="$q.screen.lt.md`. More info: [Screen Plugin](/options/screen-plugin).
:::

### Sticky header/column

::: warning
Sticky headers and columns are achieved through CSS with `position: sticky`. This is NOT supported on all browsers. Check [caniuse.com](https://caniuse.com/#search=sticky) before using this technique.
:::

<doc-example title="Sticky header" file="QTable/StickyHeader" />

<doc-example title="Sticky column" file="QTable/StickyColumn" />

<doc-example title="Sticky header and column" file="QTable/StickyHeaderAndColumn" />

### Separators

<doc-example title="Separators" file="QTable/Separators" />

### Styling

<doc-example title="Custom column" file="QTable/CustomColumn" />

<doc-example title="Custom coloring" file="QTable/CustomColor" />

<doc-example title="No header/footer" file="QTable/NoHeaderFooter" />

### Selection

::: warning
The property `row-key` must be set in order for selection to work properly.
:::

<doc-example title="Single selection" file="QTable/SingleSelection" />

<doc-example title="Multiple selection and custom selected rows label" file="QTable/MultipleSelection" />

### Visible columns, custom top, fullscreen

<doc-example title="Visible columns, custom top and fullscreen" file="QTable/VisibleColumns" />

Another example:

<doc-example title="Visible columns" file="QTable/VisibleColumns2" />

### Popup editing

::: tip
Below is an example with the user being able to edit “in place” with the help of **QPopupEdit** component. Please note that we are using the `body` scoped slot. **QPopupEdit** won’t work with cell scoped slots.
:::

<doc-example title="Popup editing" file="QTable/PopupEditing" />

### Grid style

::: tip
You can use the `grid` prop along with `$q.screen` to create a responsive behavior. Example: `:grid="$q.screen.lt.md`. More info: [Screen Plugin](/options/screen-plugin).
:::

In the example below, we let QTable deal with displaying the grid mode (not using the specific slot):

<doc-example title="Grid style" file="QTable/GridStyle" />

<doc-example title="Colored grid style" file="QTable/GridStyleColored" />

However, if you want to fully customize the content, check the example below, where:
  * We are using a Vue scoped slot called `item` to define how each record (the equivalent of a row in non-grid mode) should look. This allows you total freedom.
  * We are using multiple selection.

<doc-example title="Grid style with slot" file="QTable/GridStyleSlot" />

### Expanding rows

<doc-example title="Expanded row and custom selector" file="QTable/ExpandedRow" />

### Before/after slots

<doc-example title="Before/After slots (header/footer)" file="QTable/BeforeAfterHeaderFooter" />

### Pagination

::: tip
If you want to control Table’s pagination, use `pagination` prop, but don’t forget to add the `.sync` modifier
:::

::: tip
When `pagination` has a property named `rowsNumber`, then this means that you’ll be configuring Table for **server**-side pagination (& sorting & filtering). See *Synchronizing with Server* example below.
:::

<doc-example title="Pagination with initial sort and rows per page" file="QTable/Pagination" />

### Loading state

<doc-example title="Loading" file="QTable/Loading" />

### Custom top

<doc-example title="Custom top with add/remove row" file="QTable/CustomTop" />

### Body slots

The example below shows how you can use a slot to customize the entire row:

<doc-example title="Body slot" file="QTable/SlotBody" />

Bellow, we use a slot which gets applied to each body cell:

<doc-example title="Body-cell slot" file="QTable/SlotBodyCell" />

We can also customize only one particular column only. The syntax for this slot is `body-cell-[name]`, where `[name]` should be replaced by the property of each row which is used as the row-key.

<doc-example title="Body-cell-[name] slot" file="QTable/SlotBodyCellName" />

### Header slots

The example below shows how you can use a slot to customize the entire header row:

<doc-example title="Header slot" file="QTable/SlotHeader" />

Bellow, we use a slot which gets applied to each header cell:

<doc-example title="Header-cell slot" file="QTable/SlotHeaderCell" />

Starting with **v1.1.1+**, we can also customize only one particular header cell only. The syntax for this slot is `header-cell-[name]`, where `[name]` should be replaced by the property of each row which is used as the row-key.

<doc-example title="Header-cell-[name] slot" file="QTable/SlotHeaderCellName" />

### No data

<doc-example title="No Data Label" file="QTable/NoData" />

Starting with **v1.1.1+**, there is also a "no-data" scoped slot (see below) that you can also to customize the messages for both when a filter doesn't returns any results or the table has no data to display. Also type something into the "Search" input.

<doc-example title="No Data Slot" file="QTable/NoDataSlot" />

### Custom sorting

<doc-example title="Custom sorting" file="QTable/CustomSorting" />

### Responsive tables

In order to create responsive tables, we have two tools at our disposal: `dense` and `grid` properties. We can connect these with `$q.screen`. More info: [Screen Plugin](/options/screen-plugin).

First example below uses `$q.screen.lt.md` (for enabling dense mode) and the second examples uses `$q.screen.xs` to enable grid mode, so play with browser width to see them in action.

<doc-example title="Using dense prop" file="QTable/ResponsiveDense" />

<doc-example title="Using grid prop" file="QTable/ResponsiveGrid" />

The example above is essentially mimicking the earlier Quasar versions of the table behavior.

### Server side pagination, filter and sorting

When your database contains a big number of rows for a Table, obviously it’s not feasible to load them all for multiple reasons (memory, UI rendering performance, …). Instead, you can load only a Table page. Whenever the user wants to navigate to another Table page, or wants to sort by a column or wants to filter the Table, a **request** is sent to the **server** to fetch the partially paged data.

1. First step to enable this behavior is to specify `pagination` prop, which MUST contain `rowsNumber`. QTable needs to know the total number of rows available in order to correctly render the pagination links. Should filtering cause the `rowsNumber` to change then it must be modified dynamically.

2. Second step is to listen for `@request` event on QTable. This event is triggered when data needs to be fetched from the **server** because either page number or sorting or filtering changed.

3. It’s best that you also specify the `loading` prop in order to notify the user that a background process is in progress.

::: tip
In the example below, steps have been taken to emulate an ajax call to a server. While the concepts are similar, if you use this code you will need to make the appropriate changes to connect to your own data source.
:::

<doc-example title="Synchronizing with server" file="QTable/Synchronizing" />

## QTable API
<doc-api file="QTable" />

## QTh API
<doc-api file="QTh" />

## QTr API
<doc-api file="QTr" />

## QTd API
<doc-api file="QTd" />
