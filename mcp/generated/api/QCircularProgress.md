# QCircularProgress API

Type: component

Canonical documentation: https://quasar.dev/vue-components/circular-progress

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

Current progress (must be between min/max)

### `min`

Type: `Number`

Default: `0`

Minimum value defining 'no progress' (must be lower than 'max')

### `max`

Type: `Number`

Default: `100`

Maximum value defining 100% progress made (must be higher than 'min')

### `color`

Type: `String`

Color name for the arc progress from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `center-color`

Type: `String`

Color name for the center part of the component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `track-color`

Type: `String`

Color name for the track of the component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `font-size`

Type: `String`

Size of text in CSS units, including unit name. Suggestion: use 'em' units to sync with component size

Examples:

- `'1em'`
- `'16px'`
- `'2rem'`

### `rounded`

Type: `Boolean`

Added in: v2.8.4

Rounding the arc of progress

### `thickness`

Type: `Number`

Default: `0.2`

Thickness of progress arc as a ratio (0.0 < x < 1.0) of component size

### `angle`

Type: `Number`

Default: `0`

Angle to rotate progress arc by

### `indeterminate`

Type: `Boolean`

Put component into 'indeterminate' state; Ignores 'value' prop

### `show-value`

Type: `Boolean`

Enables the default slot and uses it (if available), otherwise it displays the 'value' prop as text; Make sure the text has enough space to be displayed inside the component

### `reverse`

Type: `Boolean`

Reverses the direction of progress; Only for determined state

### `instant-feedback`

Type: `Boolean`

No animation when model changes

### `animation-speed`

Type: `String | Number`

Default: `600`

Added in: v2.3

Animation speed (in milliseconds, without unit)

Examples:

- `500`
- `'1200'`

## Slots

### `default`

Used for component content only if 'show-value' prop is set; Make sure the content has enough space to be displayed inside the component
