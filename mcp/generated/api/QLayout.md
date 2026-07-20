# QLayout API

Type: component

Canonical documentation: https://quasar.dev/layout/layout

## Props

### `view`

Type: `String`

Default: `'hhh lpr fff'`

Defines how your layout components (header/footer/drawer) should be placed on screen; See docs examples

Examples:

- `'hHh lpR fFf'`

### `container`

Type: `Boolean`

Containerize the layout which means it changes the default behavior of expanding to the whole window; Useful (but not limited to) for when using on a QDialog

## Slots

### `default`

Suggestion: QHeader, QFooter, QDrawer, QPageContainer

## Events

### `resize`

Emitted when layout size (height, width) changes

### `scroll`

Emitted when user scrolls within layout

### `scroll-height`

Emitted when the scroll size of layout changes
