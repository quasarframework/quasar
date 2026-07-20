# QPageScroller API

Type: component

Canonical documentation: https://quasar.dev/layout/page-scroller

## Props

### `position`

Type: `String`

Default: `'bottom-right'`

Page side/corner to stick to

Accepted values: `'top-right'`, `'top-left'`, `'bottom-right'`, `'bottom-left'`, `'top'`, `'right'`, `'bottom'`, `'left'`

### `offset`

Type: `Array`

Default: `[18, 18]`

An array of two numbers to offset the component horizontally and vertically in pixels

Examples:

- `[8, 8]`
- `[5, 10]`

### `expand`

Type: `Boolean`

By default the component shrinks to content's size; By using this prop you make the component fully expand horizontally or vertically, based on 'position' prop

### `scroll-offset`

Type: `Number`

Default: `1000`

Scroll offset (in pixels) from which point the component is shown on page; Measured from the top of the page (or from the bottom if in 'reverse' mode)

### `reverse`

Type: `Boolean`

Work in reverse (shows when scrolling to the top of the page and scrolls to bottom when triggered)

### `duration`

Type: `Number`

Default: `300`

Duration (in milliseconds) of the scrolling until it reaches its target

## Slots

### `default`

Default slot in the devland unslotted content of the component
