# QBreadcrumbs API

Type: component

Canonical documentation: https://quasar.dev/vue-components/breadcrumbs

## Props

### `separator`

Type: `String`

Default: `'/'`

The string used to separate the breadcrumbs

Examples:

- `'-'`
- `'|'`
- `'>'`

### `active-color`

Type: `String`

Default: `'primary'`

The color of the active breadcrumb, which can be any color from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `gutter`

Type: `String`

Default: `'sm'`

The gutter value allows you control over the space between the breadcrumb elements.

Accepted values: `'none'`, `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'`

### `separator-color`

Type: `String`

The color used to color the separator, which can be any color from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `align`

Type: `String`

Default: `'left'`

Specify how to align the breadcrumbs horizontally

Accepted values: `'left'`, `'center'`, `'right'`, `'between'`, `'around'`, `'evenly'`

## Slots

### `default`

Default slot in the devland unslotted content of the component

### `separator`

HTML or component you can slot in to separate the breadcrumbs
