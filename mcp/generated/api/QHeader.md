# QHeader API

Type: component

Canonical documentation: https://quasar.dev/layout/header-and-footer

## Props

### `model-value`

Type: `Boolean`

Default: `true`

Model of the component defining if it is shown or hidden to the user; Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive

Examples:

- `# v-model="headerState"`

### `reveal`

Type: `Boolean`

Enable 'reveal' mode; Takes into account user scroll to temporarily show/hide header

### `reveal-offset`

Type: `Number`

Default: `250`

Amount of scroll (in pixels) that should trigger a 'reveal' state change

### `bordered`

Type: `Boolean`

Applies a default border to the component

### `elevated`

Type: `Boolean`

Adds a default shadow to the header

### `height-hint`

Type: `Number | String`

Default: `50`

When using SSR, you can optionally hint of the height (in pixels) of the QHeader

## Slots

### `default`

Default slot in the devland unslotted content of the component; Suggestion: QToolbar

## Events

### `reveal`

Emitted when 'reveal' state gets changed
