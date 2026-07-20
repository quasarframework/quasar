# QFooter API

Type: component

Canonical documentation: https://quasar.dev/layout/header-and-footer

## Props

### `model-value`

Type: `Boolean`

Default: `true`

Model of the component defining if it is shown or hidden to the user; Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive

Examples:

- `# v-model="footerState"`

### `reveal`

Type: `Boolean`

Enable 'reveal' mode; Takes into account user scroll to temporarily show/hide footer

### `bordered`

Type: `Boolean`

Applies a default border to the component

### `elevated`

Type: `Boolean`

Adds a default shadow to the footer

### `height-hint`

Type: `Number | String`

Default: `50`

When using SSR, you can optionally hint of the height (in pixels) of the QFooter

## Slots

### `default`

Default slot in the devland unslotted content of the component; Suggestion: QToolbar

## Events

### `reveal`

Emitted when 'reveal' state gets changed
