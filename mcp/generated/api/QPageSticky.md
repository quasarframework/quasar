# QPageSticky API

Type: component

Canonical documentation: https://quasar.dev/layout/page-sticky

## Props

### `position`

Type: `String`

Default: `'bottom-right'`

Page side/corner to stick to

Accepted values: `'top-right'`, `'top-left'`, `'bottom-right'`, `'bottom-left'`, `'top'`, `'right'`, `'bottom'`, `'left'`

### `offset`

Type: `Array`

An array of two numbers to offset the component horizontally and vertically in pixels

Examples:

- `[8, 8]`
- `[5, 10]`

### `expand`

Type: `Boolean`

By default the component shrinks to content's size; By using this prop you make the component fully expand horizontally or vertically, based on 'position' prop

## Slots

### `default`

Default slot in the devland unslotted content of the component
