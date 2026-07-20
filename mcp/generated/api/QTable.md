# QTable API

Type: component

Canonical documentation: https://quasar.dev/vue-components/table

## Props

### `fullscreen`

Type: `Boolean`

Fullscreen mode

Examples:

- `# v-model:fullscreen="isFullscreen"`

### `no-route-fullscreen-exit`

Type: `Boolean`

Changing route app won't exit fullscreen

### `rows`

Type: `Array`

Required: yes

Rows of data to display

Examples:

- `# :rows="myData"`

### `row-key`

Type: `String | Function`

Default: `'id'`

Property of each row that defines the unique key of each row (the result must be a primitive, not Object, Array, etc); The value of property must be string or a function taking a row and returning the desired (nested) key in the row; If supplying a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `'name'`
- `row => row.name`

### `virtual-scroll`

Type: `Boolean`

Display data using QVirtualScroll (for non-grid mode only)

### `virtual-scroll-target`

Type: `Element | String`

CSS selector or DOM element to be used as a custom scroll container instead of the auto detected one

Examples:

- `.scroll-target-class`
- `#scroll-target-id`
- `$refs.scrollTarget`
- `document.body`

### `virtual-scroll-slice-size`

Type: `Number | String | null`

Default: `10`

Minimum number of rows to render in the virtual list

### `virtual-scroll-slice-ratio-before`

Type: `Number | String`

Default: `1`

Ratio of number of rows in visible zone to render before it

### `virtual-scroll-slice-ratio-after`

Type: `Number | String`

Default: `1`

Ratio of number of rows in visible zone to render after it

### `virtual-scroll-item-size`

Type: `Number | String`

Default: `# 48/24`

Default size in pixels of a row; This value is used for rendering the initial table; Try to use a value close to the minimum size of a row; Default value: 48 (24 if dense)

### `virtual-scroll-sticky-size-start`

Type: `Number | String`

Default: `0`

Size in pixels of the sticky header (if using one); A correct value will improve scroll precision; Will be also used for non-virtual-scroll tables for fixing top alignment when using scrollTo method

### `virtual-scroll-sticky-size-end`

Type: `Number | String`

Default: `0`

Size in pixels of the sticky footer part (if using one); A correct value will improve scroll precision

### `table-colspan`

Type: `Number | String`

The number of columns in the table (you need this if you use table-layout: fixed)

### `color`

Type: `String`

Default: `'grey-8'`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `icon-first-page`

Type: `String`

Icon name following Quasar convention for stepping to first page; Make sure you have the icon library installed unless you are using 'img:' prefix

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `icon-prev-page`

Type: `String`

Icon name following Quasar convention for stepping to previous page; Make sure you have the icon library installed unless you are using 'img:' prefix

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `icon-next-page`

Type: `String`

Icon name following Quasar convention for stepping to next page; Make sure you have the icon library installed unless you are using 'img:' prefix

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `icon-last-page`

Type: `String`

Icon name following Quasar convention for stepping to last page; Make sure you have the icon library installed unless you are using 'img:' prefix

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `grid`

Type: `Boolean`

Display data as a grid instead of the default table

### `grid-header`

Type: `Boolean`

Display header for grid-mode also

### `dense`

Type: `Boolean`

Dense mode; Connect with $q.screen for responsive behavior

### `columns`

Type: `Array`

The column definitions (Array of Objects)

Examples:

- `# :columns="tableColumns"`

### `visible-columns`

Type: `Array`

Array of Strings defining column names ('name' property of each column from 'columns' prop definitions); Columns marked as 'required' are not affected by this property

Examples:

- `['desc', 'carbs', 'protein']`
- `# :visible-columns="myCols"`

### `loading`

Type: `Boolean`

Put Table into 'loading' state; Notify the user something is happening behind the scenes

### `title`

Type: `String`

Table title

Examples:

- `'Device list'`

### `hide-header`

Type: `Boolean`

Hide table header layer

### `hide-bottom`

Type: `Boolean`

Hide table bottom layer regardless of what it has to display

### `hide-selected-banner`

Type: `Boolean`

Hide the selected rows banner (if any)

### `hide-no-data`

Type: `Boolean`

Hide the default no data bottom layer

### `hide-pagination`

Type: `Boolean`

Hide the pagination controls at the bottom

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `flat`

Type: `Boolean`

Applies a 'flat' design (no default shadow)

### `bordered`

Type: `Boolean`

Applies a default border to the component

### `square`

Type: `Boolean`

Removes border-radius so borders are squared

### `separator`

Type: `String`

Default: `'horizontal'`

Use a separator/border between rows, columns or all cells

Accepted values: `'horizontal'`, `'vertical'`, `'cell'`, `'none'`

### `wrap-cells`

Type: `Boolean`

Wrap text within table cells

### `binary-state-sort`

Type: `Boolean`

Skip the third state (unsorted) when user toggles column sort direction

### `column-sort-order`

Type: `String`

Default: `'ad'`

Set column sort order: 'ad' (ascending-descending) or 'da' (descending-ascending); It gets applied to all columns unless a column has its own sortOrder specified in the 'columns' definition prop

Accepted values: `'ad'`, `'da'`

### `no-data-label`

Type: `String`

Override default text to display when no data is available

Examples:

- `'No devices available'`

### `no-results-label`

Type: `String`

Override default text to display when user filters the table and no matched results are found

Examples:

- `'No matched records'`

### `loading-label`

Type: `String`

Override default text to display when table is in loading state (see 'loading' prop)

Examples:

- `'Loading devices...'`

### `selected-rows-label`

Type: `Function`

Text to display when user selected at least one row; For best performance, reference it from your scope and do not define it inline

Examples:

- `(numberOfRows) => `Selected: ${ numberOfRows } entries``

### `rows-per-page-label`

Type: `String`

Text to override default rows per page label at bottom of table

Examples:

- `'Records per page:'`

### `pagination-label`

Type: `Function`

Text to override default pagination label at bottom of table (unless 'pagination' scoped slot is used); For best performance, reference it from your scope and do not define it inline

Examples:

- `(start, end, total) => `${ start }-${ end } of ${ total }``

### `table-style`

Type: `String | Array | Object`

CSS style to apply to native HTML <table> element's wrapper (which is a DIV)

Examples:

- `'background-color: #ff0000'`
- `{ backgroundColor: '#ff0000' }`

### `table-class`

Type: `String | Array | Object`

CSS classes to apply to native HTML <table> element's wrapper (which is a DIV)

Examples:

- `'my-special-class'`
- `{ 'my-special-class': true }`

### `table-header-style`

Type: `String | Array | Object`

CSS style to apply to header of native HTML <table> (which is a TR)

Examples:

- `'background-color: #ff0000'`
- `{ backgroundColor: '#ff0000' }`

### `table-header-class`

Type: `String | Array | Object`

CSS classes to apply to header of native HTML <table> (which is a TR)

Examples:

- `'my-special-class'`
- `{ 'my-special-class': true }`

### `table-row-style-fn`

Type: `Function`

Added in: v2.18

CSS style to apply to the table rows (which are TR elements); For best performance, reference it from your scope and do not define it inline

### `table-row-class-fn`

Type: `Function`

Added in: v2.18

CSS class(es) to apply the table rows (which are TR elements); For best performance, reference it from your scope and do not define it inline

### `card-container-style`

Type: `String | Array | Object`

CSS style to apply to the cards container (when in grid mode)

Examples:

- `'background-color: #ff0000'`
- `{ backgroundColor: '#ff0000' }`

### `card-container-class`

Type: `String | Array | Object`

CSS classes to apply to the cards container (when in grid mode)

Examples:

- `'my-special-class'`
- `'justify-center'`
- `{ 'my-special-class': true }`

### `card-style`

Type: `String | Array | Object`

CSS style to apply to the card (when in grid mode) or container card (when not in grid mode)

Examples:

- `'background-color: #ff0000'`
- `{ backgroundColor: '#ff0000' }`

### `card-class`

Type: `String | Array | Object`

CSS classes to apply to the card (when in grid mode) or container card (when not in grid mode)

Examples:

- `'my-special-class'`
- `{ 'my-special-class': true }`

### `card-style-fn`

Type: `Function`

Added in: v2.18

(Grid mode only) CSS style to apply to the row/record card; Has no effect when the 'item' slot is used; For best performance, reference it from your scope and do not define it inline

### `card-class-fn`

Type: `Function`

Added in: v2.18

(Grid mode only) CSS class(es) to apply the row/record card; Has no effect when the 'item' slot is used; For best performance, reference it from your scope and do not define it inline

### `title-class`

Type: `String | Array | Object`

CSS classes to apply to the title (if using 'title' prop)

Examples:

- `'my-special-class'`
- `'text-h1'`
- `{ 'text-h1': true }`

### `filter`

Type: `String | Object`

String/Object to filter table with; When using an Object it requires 'filter-method' to also be specified since it will be a custom filtering

Examples:

- `'car'`

### `filter-method`

Type: `Function`

The actual filtering mechanism; For best performance, reference it from your scope and do not define it inline

Examples:

- `# see source code`

### `pagination`

Type: `Object`

Pagination object; You can also use the 'v-model:pagination' for synching; When not synching it simply initializes the pagination on first render

Examples:

- `# :pagination="myInitialPagination"`
- `# v-model:pagination="myPagination"`

### `rows-per-page-options`

Type: `Array`

Default: `[5, 7, 10, 15, 20, 25, 50, 0]`

Options for user to pick (Numbers); Number 0 means 'Show all rows in one page'

Examples:

- `[10, 20]`

### `selection`

Type: `String`

Default: `'none'`

Selection type

Accepted values: `'single'`, `'multiple'`, `'none'`

### `selected`

Type: `Array`

Default: `[]`

Keeps the user selection array

Examples:

- `# v-model:selected="selection"`

### `expanded`

Type: `Array`

Keeps the array with expanded rows keys

Examples:

- `# v-model:expanded="expanded"`

### `sort-method`

Type: `Function`

The actual sort mechanism. Function (rows, sortBy, descending) => sorted rows; For best performance, reference it from your scope and do not define it inline

Examples:

- `# see source code`

## Slots

### `loading`

Override default effect when table is in loading state; Suggestion: QInnerLoading

### `item`

Slot to use for defining an item when in 'grid' mode; Suggestion: QCard

### `body`

Slot to define how a body row looks like; Suggestion: QTr + Td

### `body-cell`

Slot to define how all body cells look like; Suggestion: QTd

### `body-cell-[name]`

Slot to define how a specific column cell looks like; replace '[name]' with column name (from columns definition object)

### `header`

Slot to define how header looks like; Suggestion: QTr + QTh

### `header-cell`

Slot to define how each header cell looks like; Suggestion: QTh

### `header-cell-[name]`

Slot to define how a specific header cell looks like; replace '[name]' with column name (from columns definition object)

### `body-selection`

Slot to define how body selection column looks like; Suggestion: QCheckbox

### `header-selection`

Slot to define how header selection column looks like (available only for multiple selection mode); Suggestion: QCheckbox

### `top-row`

Slot to define how top extra row looks like

### `bottom-row`

Slot to define how bottom extra row looks like

### `top`

Slot to define how table top looks like

### `bottom`

Slot to define how table bottom looks like

### `pagination`

Slot to override default pagination label and buttons

### `top-left`

Slot to define how left part of the table top looks like

### `top-right`

Slot to define how right part of the table top looks like

### `top-selection`

Slot to define how top table section looks like when user has selected at least one row

### `no-data`

Slot to define how the bottom will look like when is nothing to display

## Events

### `fullscreen`

Emitted when fullscreen state changes

### `update:fullscreen`

Used by Vue on 'v-model:fullscreen' prop for updating its value

### `row-click`

Emitted when user clicks/taps on a row; Is not emitted when using body/row/item scoped slots

### `row-dblclick`

Emitted when user quickly double clicks/taps on a row; Is not emitted when using body/row/item scoped slots; Please check JS dblclick event support before using

### `row-contextmenu`

Emitted when user right clicks/long taps on a row; Is not emitted when using body/row/item scoped slots

### `request`

Emitted when a server request is triggered

### `selection`

Emitted when user selects/unselects row(s)

### `update:pagination`

Used by Vue on 'v-model:pagination' for updating its value

### `update:selected`

Used by Vue on 'v-model:selected' prop for updating its value

### `update:expanded`

Used by Vue on 'v-model:expanded' prop for updating its value

### `virtual-scroll`

Emitted when the virtual scroll occurs, if using virtual scroll

## Methods

### `toggleFullscreen`

Toggles fullscreen mode

### `setFullscreen`

Enter the fullscreen view

### `exitFullscreen`

Leave the fullscreen view

### `requestServerInteraction`

Trigger a server request (emits 'request' event)

### `setPagination`

Unless using an external pagination Object (through 'v-model:pagination' prop), you can use this method and force the internal pagination to change

### `firstPage`

Navigates to first page

### `prevPage`

Navigates to previous page, if available

### `nextPage`

Navigates to next page, if available

### `lastPage`

Navigates to last page

### `isRowSelected`

Determine if a row has been selected by user

### `clearSelection`

Clears user selection (emits 'update:selected' with empty array)

### `isRowExpanded`

Determine if a row is expanded or not

### `setExpanded`

Sets the expanded rows keys array; Especially useful if not using an external 'expanded' state otherwise just emits 'update:expanded' with the value

### `sort`

Trigger a table sort

### `resetVirtualScroll`

Resets the virtual scroll (if using it) computations; Needed for custom edge-cases

### `scrollTo`

Scroll the table to the row with the specified index in page (0 based)

### `getCellValue`

Type: `Function`

Added in: v2.21

Method to get a cell value

## Computed properties

### `filteredSortedRows`

Type: `Array`

The filtered and sorted rows (same as the rows prop if using server-side fetching)

Examples:

- `[{ name: 'Ice Cream Sandwich', calories: 237, fat: 9.0, carbs: 37, protein: 4.3, sodium: 129, calcium: 8, iron: 1 }, ...]`

### `computedRows`

Type: `Array`

Paginated, filtered, and sorted rows (same as the rows prop if using server-side fetching)

Examples:

- `[{ name: 'Ice Cream Sandwich', calories: 237, fat: 9.0, carbs: 37, protein: 4.3, sodium: 129, calcium: 8, iron: 1 }, ...]`

### `computedRowsNumber`

Type: `Number`

The number of computed rows
