# QSlideItem API

Type: component

Canonical documentation: https://quasar.dev/vue-components/slide-item

## Props

### `left-color`

Type: `String`

Color name for left-side background from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `right-color`

Type: `String`

Color name for right-side background from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `top-color`

Type: `String`

Color name for top-side background from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `bottom-color`

Type: `String`

Color name for bottom-side background from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

## Slots

### `default`

This is where item's sections go; Suggestion: QItemSection

### `left`

Left side content when sliding

### `right`

Right side content when sliding

### `top`

Top side content when sliding

### `bottom`

Bottom side content when sliding

## Events

### `left`

Emitted when user finished sliding the item to the left

### `right`

Emitted when user finished sliding the item to the right

### `top`

Emitted when user finished sliding the item up

### `bottom`

Emitted when user finished sliding the item down

### `slide`

Emitted while user is sliding the item to one of the available sides

### `action`

Emitted when user finished sliding the item to either sides

## Methods

### `reset`

Reset to initial state (not swiped to any side)
