# QPage API

Type: component

Canonical documentation: https://quasar.dev/layout/page

## Props

### `padding`

Type: `Boolean`

Applies a default responsive page padding

### `style-fn`

Type: `Function`

Override default CSS style applied to the component (sets minHeight); Function(offset: Number) => CSS props/value: Object; For best performance, reference it from your scope and do not define it inline

Examples:

- `(offset, height) => ({ minHeight: offset + 'px' })`

## Slots

### `default`

Default slot in the devland unslotted content of the component
