# QRadio API

Type: component

Canonical documentation: https://quasar.dev/vue-components/radio

## Props

### `name`

Type: `String`

Used to specify the name of the control; Useful if dealing with forms submitted directly to a URL

Examples:

- `'car_id'`

### `size`

Type: `String`

Size in CSS units, including unit name or standard size name (xs|sm|md|lg|xl)

Examples:

- `'16px'`
- `'2rem'`
- `'xs'`
- `'md'`

### `model-value`

Type: `Any`

Required: yes

Model of the component; Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive

Examples:

- `# v-model="option"`

### `val`

Type: `Any`

Required: yes

The actual value of the option with which model value is changed

Examples:

- `'opt1'`
- `50`

### `label`

Type: `String`

Label to display along the radio control (or use the default slot instead of this prop)

Examples:

- `'Option 1'`

### `left-label`

Type: `Boolean`

Label (if any specified) should be displayed on the left side of the checkbox

### `checked-icon`

Type: `String`

Added in: v2.5

The icon to be used when selected (instead of the default design)

Examples:

- `'visibility'`

### `unchecked-icon`

Type: `String`

Added in: v2.5

The icon to be used when un-selected (instead of the default design)

Examples:

- `'visibility_off'`

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `keep-color`

Type: `Boolean`

Should the color (if specified any) be kept when checkbox is unticked?

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `dense`

Type: `Boolean`

Dense mode; occupies less space

### `disable`

Type: `Boolean`

Put component in disabled mode

### `tabindex`

Type: `Number | String`

Tabindex HTML attribute value

Examples:

- `100`
- `'0'`

## Slots

### `default`

Default slot can be used as label, unless 'label' prop is specified; Suggestion: string

## Events

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model

## Methods

### `set`

Sets the Radio's v-model to equal the val
