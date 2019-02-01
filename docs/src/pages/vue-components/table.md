---
title: Table
---

QTable is a component that allows you to display data in a tabular manner. It packs the following main features:
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

## Defining the Columns

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
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
    // function return value:
    //   * is less than 0 then sort a to an index lower than b, i.e. a comes first
    //   * is 0 then leave a and b unchanged with respect to each other, but sorted with respect to all different elements
    //   * is greater than 0 then sort b to an index lower than a, i.e. b comes first

    // (optional) you can format the data with a function
    format: val => `${val}%`

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

<doc-example title="Basic" file="QTable/Basic" />

<doc-example title="Dark" file="QTable/Dark" />

<doc-example title="Dense" file="QTable/Dense" />

::: tip
You can use the `dense` prop along with `$q.screen` to create a responsive behavior. Example: `:dense="$q.screen.lt.md`. More info: [Screen Plugin](/options/screen-plugin).
:::

<doc-example title="Separators" file="QTable/Separators" />

<doc-example title="Custom Column" file="QTable/CustomColumn" />

<doc-example title="Custom Color" file="QTable/CustomColor" />

<doc-example title="No Header/Footer" file="QTable/NoHeaderFooter" />

::: warning
The property `name-key` must be set in order for selection to work properly.
:::

<doc-example title="Single Selection" file="QTable/SingleSelection" />

<doc-example title="Multiple Selection and Custom Selected Rows Label" file="QTable/MultipleSelection" />

<doc-example title="Visible Columns, Custom Top and Fullscreen" file="QTable/VisibleColumns" />

::: tip
Below is an example with the user being able to edit “in place” with the help of **QPopupEdit** component. Please note that we are using the `body` scoped slot. **QPopupEdit** won’t work with cell scoped slots.
:::

<doc-example title="Popup Editing" file="QTable/PopupEditing" />

In the example below:
  * We’re using a Vue scoped slot called `item` to define how each record (the equivalent of a row in non-grid mode) should look. This allows you total freedom.
  * We hide the header, but you can show it should you want – the user will be able to sort the data by columns etc.
  * We are supporting multiple selection.

<doc-example title="Grid Style with Selection and Search (Filter)" file="QTable/GridStyle" />

<doc-example title="Expanded Row and Custom Selector" file="QTable/ExpandedRow" />

<doc-example title="Before/After Slots (header/footer)" file="QTable/BeforeAfterHeaderFooter" />

::: tip
If you want to control Table’s pagination, use `pagination` prop, but don’t forget to add the `.sync` modifier
:::

::: tip
When `pagination` has a property named `rowsNumber`, then this means that you’ll be configuring Table for **server**-side pagination (& sorting & filtering). See *Synchronizing with Server* example below.
:::

<doc-example title="Pagination with Initial Sort and Rows per Page" file="QTable/Pagination" />

<doc-example title="Loading" file="QTable/Loading" />

<doc-example title="Custom Top with Add/Remove Row" file="QTable/CustomTop" />

<doc-example title="Custom Sorting" file="QTable/CustomSorting" />

### Server side pagination, filter and sorting

When your database contains a big number of rows for a Table, obviously it’s not feasible to load them all for multiple reasons (memory, UI rendering performance, …). Instead, you can load only a Table page. Whenever the user wants to navigate to another Table page, or wants to sort by a column or wants to filter the Table, a **request** is sent to the **server** to fetch the partially paged data.

1. First step to enable this behavior is to specify `pagination` prop, which MUST contain `rowsNumber`. QTable needs to know the total number of rows available in order to correctly render the pagination links. Should filtering cause the `rowsNumber` to change then it must be modified dynamically.

2. Second step is to listen for `@request` event on QTable. This event is triggered when data needs to be fetched from the **server** because either page number or sorting or filtering changed.

3. It’s best that you also specify the `loading` prop in order to notify the user that a background process is in progress.

::: tip
In the example below, steps have been taken to emulate an ajax call to a server. While the concepts are similar, if you use this code you will need to make the appropriate changes to connect to your own data source.
:::

<doc-example title="Synchronizing with Server" file="QTable/Synchronizing" />

## QTable API
<doc-api file="QTable" />

## QTh API
<doc-api file="QTh" />

## QTr API
<doc-api file="QTr" />

## QTd API
<doc-api file="QTd" />
