# QSkeleton API

Type: component

Canonical documentation: https://quasar.dev/vue-components/skeleton

## Props

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `type`

Type: `String`

Default: `'rect'`

Type of skeleton placeholder

Accepted values: `'text'`, `'rect'`, `'circle'`, `'QBtn'`, `'QBadge'`, `'QChip'`, `'QToolbar'`, `'QCheckbox'`, `'QRadio'`, `'QToggle'`, `'QSlider'`, `'QRange'`, `'QInput'`, `'QAvatar'`

### `animation`

Type: `String`

Default: `'wave'`

The animation effect of the skeleton placeholder

Accepted values: `'wave'`, `'pulse'`, `'pulse-x'`, `'pulse-y'`, `'fade'`, `'blink'`, `'none'`

### `animation-speed`

Type: `String | Number`

Default: `1500`

Added in: v2.2

Animation speed (in milliseconds, without unit)

Examples:

- `500`
- `'1200'`

### `square`

Type: `Boolean`

Removes border-radius so borders are squared

### `bordered`

Type: `Boolean`

Applies a default border to the component

### `size`

Type: `String`

Size in CSS units, including unit name; Overrides 'height' and 'width' props and applies the value to both height and width

Examples:

- `'16px'`
- `'2rem'`

### `width`

Type: `String`

Width in CSS units, including unit name; Apply custom width; Use this prop or through CSS; Overridden by 'size' prop if used

Examples:

- `'16px'`
- `'2rem'`

### `height`

Type: `String`

Height in CSS units, including unit name; Apply custom height; Use this prop or through CSS; Overridden by 'size' prop if used

Examples:

- `'16px'`
- `'2rem'`

### `tag`

Type: `String`

Default: `'div'`

HTML tag to use

Examples:

- `'div'`
- `'span'`

## Slots

### `default`

Default slot in the devland unslotted content of the component
