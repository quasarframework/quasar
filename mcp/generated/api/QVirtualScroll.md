# QVirtualScroll API

Type: component

Canonical documentation: https://quasar.dev/vue-components/virtual-scroll

## Props

### `virtual-scroll-horizontal`

Type: `Boolean`

Make virtual list work in horizontal mode

### `virtual-scroll-slice-size`

Type: `Number | String | null`

Default: `10`

Minimum number of items to render in the virtual list

Examples:

- `60`
- `'60'`

### `virtual-scroll-slice-ratio-before`

Type: `Number | String`

Default: `1`

Ratio of number of items in visible zone to render before it

### `virtual-scroll-slice-ratio-after`

Type: `Number | String`

Default: `1`

Ratio of number of items in visible zone to render after it

### `virtual-scroll-item-size`

Type: `Number | String`

Default: `24`

Default size in pixels (height if vertical, width if horizontal) of an item; This value is used for rendering the initial list; Try to use a value close to the minimum size of an item

### `virtual-scroll-sticky-size-start`

Type: `Number | String`

Default: `0`

Size in pixels (height if vertical, width if horizontal) of the sticky part (if using one) at the start of the list; A correct value will improve scroll precision

### `virtual-scroll-sticky-size-end`

Type: `Number | String`

Default: `0`

Size in pixels (height if vertical, width if horizontal) of the sticky part (if using one) at the end of the list; A correct value will improve scroll precision

### `table-colspan`

Type: `Number | String`

The number of columns in the table (you need this if you use table-layout: fixed)

### `type`

Type: `String`

Default: `'list'`

The type of content: list (default) or table

Accepted values: `'list'`, `'table'`

### `items`

Type: `Array`

Default: `[]`

Available list items that will be passed to the scoped slot; For best performance freeze the list of items; Required if 'itemsFn' is not supplied

Examples:

- `['Tesla', 'iPhone']`
- `[{ label: 'Tesla', value: 'car' }, { label: 'iPhone', value: 'phone' }]`

### `items-size`

Type: `Number`

Number of available items in the list; Required and used only if 'itemsFn' is provided

Examples:

- `100000`

### `items-fn`

Type: `Function`

Function to return the scope for the items to be displayed; Should return an array for items starting from 'from' index for size length; For best performance, reference it from your scope and do not define it inline

Examples:

- `(from, size) => { const items = []; for (let i = 0; i < size; i++) { items.push('Item ' + i) }; return items }`

### `scroll-target`

Type: `Element | String`

CSS selector or DOM element to be used as a custom scroll container instead of the auto detected one

Examples:

- `.scroll-target-class`
- `#scroll-target-id`
- `$refs.scrollTarget`
- `document.body`

## Slots

### `before`

Template slot for the elements that should be rendered before the list; Suggestion: thead before a table

### `after`

Template slot for the elements that should be rendered after the list; Suggestion: tfoot after a table

### `default`

Template slot for defining the list item; Suggestion: QItem

## Events

### `virtual-scroll`

Emitted when the virtual scroll occurs

## Methods

### `scrollTo`

Scroll the virtual scroll list to the item with the specified index (0 based)

### `reset`

Resets the virtual scroll computations; Needed for custom edge-cases

### `refresh`

Refreshes the virtual scroll list; Use it after appending items
