# QSeparator API

Type: component

Canonical documentation: https://quasar.dev/vue-components/separator

## Props

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `spaced`

Type: `Boolean | String`

If set to true, the corresponding direction margins will be set to 8px; It can also be set to a size in CSS units, including unit name, or one of the xs|sm|md|lg|xl predefined sizes

Examples:

- `'12px'`
- `'sm'`
- `'md'`

### `inset`

Type: `Boolean | String`

If set to Boolean true, the left and right margins will be set to 16px. If set to 'item' then it will match a QItem's design. If set to 'item-thumbnail' then it will match the design of a QItem with a thumbnail on the left side

Accepted values: `true`, `false`, `'item'`, `'item-thumbnail'`

### `vertical`

Type: `Boolean`

If set to true, the separator will be vertical.

### `size`

Type: `String`

Size in CSS units, including unit name

Examples:

- `'16px'`
- `'2rem'`

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`
