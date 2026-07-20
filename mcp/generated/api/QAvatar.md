# QAvatar API

Type: component

Canonical documentation: https://quasar.dev/vue-components/avatar

## Props

### `size`

Type: `String`

Size in CSS units, including unit name or standard size name (xs|sm|md|lg|xl)

Examples:

- `'16px'`
- `'2rem'`
- `'xs'`
- `'md'`

### `font-size`

Type: `String`

The size in CSS units, including unit name, of the content (icon, text)

Examples:

- `'18px'`
- `'2rem'`

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

### `icon`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `square`

Type: `Boolean`

Removes border-radius so borders are squared

### `rounded`

Type: `Boolean`

Applies a small standard border-radius for a squared shape of the component

## Slots

### `default`

Optional; Suggestions: one character string, <img> tag
