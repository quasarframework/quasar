# QColor API

Type: component

Canonical documentation: https://quasar.dev/vue-components/color-picker

## Props

### `name`

Type: `String`

Used to specify the name of the control; Useful if dealing with forms submitted directly to a URL

Examples:

- `'car_id'`

### `model-value`

Type: `String | null | undefined`

Required: yes

Model of the component; Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive

Examples:

- `# v-model="myColor"`

### `default-value`

Type: `String`

The default value to show when the model doesn't have one

Examples:

- `'#c0c0c0'`

### `default-view`

Type: `String`

Default: `'spectrum'`

The default view of the picker

Accepted values: `'spectrum'`, `'tune'`, `'palette'`

### `format-model`

Type: `String`

Default: `'auto'`

Forces a certain model format upon the model

Accepted values: `'auto'`, `'hex'`, `'rgb'`, `'hexa'`, `'rgba'`

### `palette`

Type: `Array`

Default: `# hard-coded palette`

Use a custom palette of colors for the palette tab

Examples:

- `['#019A9D', '#D9B801', 'rgb(23,120,0)', '#B2028A']`

### `square`

Type: `Boolean`

Removes border-radius so borders are squared

### `flat`

Type: `Boolean`

Applies a 'flat' design (no default shadow)

### `bordered`

Type: `Boolean`

Applies a default border to the component

### `no-header`

Type: `Boolean`

Do not render header

### `no-header-tabs`

Type: `Boolean`

Added in: v2.2

Do not render header tabs (only the input)

### `no-footer`

Type: `Boolean`

Do not render footer; Useful when you want a specific view ('default-view' prop) and don't want the user to be able to switch it

### `disable`

Type: `Boolean`

Put component in disabled mode

### `readonly`

Type: `Boolean`

Put component in readonly mode

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

## Events

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model

### `change`

Emitted on lazy model value change (after user finishes selecting a color)
