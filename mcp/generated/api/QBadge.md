# QBadge API

Type: component

Canonical documentation: https://quasar.dev/vue-components/badge

## Props

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `text-color`

Type: `String`

Overrides text color (if needed); Color name from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `floating`

Type: `Boolean`

Tell QBadge if it should float to the top right side of the relative positioned parent element or not

### `transparent`

Type: `Boolean`

Applies a 0.8 opacity; Useful especially for floating QBadge

### `multi-line`

Type: `Boolean`

Content can wrap to multiple lines

### `label`

Type: `String | Number`

Badge's content as string; overrides default slot if specified

Examples:

- `'John Doe'`
- `22`

### `align`

Type: `String`

Sets vertical-align CSS prop

Accepted values: `'top'`, `'middle'`, `'bottom'`

### `outline`

Type: `Boolean`

Use 'outline' design (colored text and borders only)

### `rounded`

Type: `Boolean`

Makes a rounded shaped badge

## Slots

### `default`

This is where QBadge content goes, if not using 'label' property
