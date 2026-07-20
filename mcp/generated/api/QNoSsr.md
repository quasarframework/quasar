# QNoSsr API

Type: component

Canonical documentation: https://quasar.dev/vue-components/no-ssr

## Props

### `tag`

Type: `String`

Default: `'div'`

HTML tag to use

Examples:

- `'div'`
- `'span'`
- `'blockquote'`

### `placeholder`

Type: `String`

Text to display on server-side render (unless using 'placeholder' slot)

Examples:

- `'This is server-side only'`

## Slots

### `default`

Default slot is used to render content on client-side

### `placeholder`

Slot used as placeholder on server-side render, which gets replaced by the default slot on client-side; overrides 'placeholder' prop
