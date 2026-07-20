# QScrollArea API

Type: component

Canonical documentation: https://quasar.dev/vue-components/scroll-area

## Props

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `vertical-offset`

Type: `Array`

Default: `# [0, 0]`

Added in: v2.17

Adds [top, bottom] offset to vertical thumb

### `horizontal-offset`

Type: `Array`

Default: `# [0, 0]`

Added in: v2.17

Adds [left, right] offset to horizontal thumb

### `bar-style`

Type: `String | Array | Object`

Object with CSS properties and values for custom styling the scrollbars (both vertical and horizontal)

Examples:

- `{ borderRadius: '5px', background: 'red', opacity: 1 }`

### `vertical-bar-style`

Type: `String | Array | Object`

Object with CSS properties and values for custom styling the vertical scrollbar; Is applied on top of 'bar-style' prop

Examples:

- `{ right: '4px', borderRadius: '5px', background: 'red', width: '10px', opacity: 1 }`

### `horizontal-bar-style`

Type: `String | Array | Object`

Object with CSS properties and values for custom styling the horizontal scrollbar; Is applied on top of 'bar-style' prop

Examples:

- `{ bottom: '4px', borderRadius: '5px', background: 'red', height: '10px', opacity: 1 }`

### `thumb-style`

Type: `Object`

Object with CSS properties and values for custom styling the thumb of scrollbars (both vertical and horizontal)

Examples:

- `{ right: '4px', borderRadius: '5px', background: 'red', width: '10px', opacity: 1 }`

### `vertical-thumb-style`

Type: `Object`

Object with CSS properties and values for custom styling the thumb of the vertical scrollbar; Is applied on top of 'thumb-style' prop

Examples:

- `{ right: '4px', borderRadius: '5px', background: 'red', width: '10px', opacity: 1 }`

### `horizontal-thumb-style`

Type: `Object`

Object with CSS properties and values for custom styling the thumb of the horizontal scrollbar; Is applied on top of 'thumb-style' prop

Examples:

- `{ bottom: '4px', borderRadius: '5px', background: 'red', height: '10px', opacity: 1 }`

### `content-style`

Type: `String | Array | Object`

Object with CSS properties and values for styling the container of QScrollArea

Examples:

- `{ backgroundColor: '#C0C0C0' }`

### `content-active-style`

Type: `String | Array | Object`

Object with CSS properties and values for styling the container of QScrollArea when scroll area becomes active (is mouse hovered)

Examples:

- `{ backgroundColor: 'white' }`

### `visible`

Type: `Boolean | null`

Default: `null`

Manually control the visibility of the scrollbar; Overrides default mouse over/leave behavior

### `delay`

Type: `Number | String`

Default: `1000`

When content changes, the scrollbar appears; this delay defines the amount of time (in milliseconds) before scrollbars disappear again (if component is not hovered)

### `tabindex`

Type: `Number | String`

Tabindex HTML attribute value

Examples:

- `100`
- `'0'`

## Slots

### `default`

Default slot in the devland unslotted content of the component

## Events

### `scroll`

Emitted when scroll information changes (and listener is configured)

## Methods

### `getScrollTarget`

Get the scrolling DOM element target

### `getScroll`

Get the current scroll information

### `getScrollPosition`

Get current scroll position

### `getScrollPercentage`

Get current scroll position in percentage (0.0 <= x <= 1.0)

### `setScrollPosition`

Set scroll position to an offset; If a duration (in milliseconds) is specified then the scroll is animated

### `setScrollPercentage`

Set scroll position to a percentage (0.0 <= x <= 1.0) of the total scrolling size; If a duration (in milliseconds) is specified then the scroll is animated
