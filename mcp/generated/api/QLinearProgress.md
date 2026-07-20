# QLinearProgress API

Type: component

Canonical documentation: https://quasar.dev/vue-components/linear-progress

## Props

### `size`

Type: `String`

Size in CSS units, including unit name or standard size name (xs|sm|md|lg|xl)

Examples:

- `'16px'`
- `'2rem'`
- `'xs'`
- `'md'`

### `value`

Type: `Number`

Default: `0`

Progress value (0.0 < x < 1.0)

### `buffer`

Type: `Number`

Optional buffer value (0.0 < x < 1.0)

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `track-color`

Type: `String`

Color name for component's track from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `reverse`

Type: `Boolean`

Reverse direction of progress

### `stripe`

Type: `Boolean`

Draw stripes; For determinate state only (for performance reasons)

### `indeterminate`

Type: `Boolean`

Put component into indeterminate mode

### `query`

Type: `Boolean`

Put component into query mode

### `rounded`

Type: `Boolean`

Applies a small standard border-radius for a squared shape of the component

### `instant-feedback`

Type: `Boolean`

No transition when model changes

### `animation-speed`

Type: `String | Number`

Default: `2100`

Added in: v2.3

Animation speed (in milliseconds, without unit)

Examples:

- `500`
- `'1200'`

## Slots

### `default`

Suggestion: QTooltip
