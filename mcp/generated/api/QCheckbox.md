# QCheckbox API

Type: component

Canonical documentation: https://quasar.dev/vue-components/checkbox

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

Type: `Any | Array`

Default: `null`

Required: yes

Model of the component; Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive

Examples:

- `false`
- `['car', 'building']`

### `val`

Type: `Any`

Works when model ('value') is Array. It tells the component which value should add/remove when ticked/unticked

Examples:

- `'car'`

### `true-value`

Type: `Any`

Default: `true`

What model value should be considered as checked/ticked/on?

Examples:

- `'Agreed'`

### `false-value`

Type: `Any`

Default: `false`

What model value should be considered as unchecked/unticked/off?

Examples:

- `'Disagree'`

### `indeterminate-value`

Type: `Any`

Default: `null`

What model value should be considered as 'indeterminate'?

Examples:

- `0`
- `'not_answered'`

### `toggle-order`

Type: `String`

Determines toggle order of the two states ('t' stands for state of true, 'f' for state of false); If 'toggle-indeterminate' is true, then the order is: indet -> first state -> second state -> indet (and repeat), otherwise: indet -> first state -> second state -> first state -> second state -> ...

Accepted values: `'tf'`, `'ft'`

### `toggle-indeterminate`

Type: `Boolean`

When user clicks/taps on the component, should we toggle through the indeterminate state too?

### `label`

Type: `String`

Label to display along the component (or use the default slot instead of this prop)

Examples:

- `'I agree with the Terms and Conditions'`

### `left-label`

Type: `Boolean`

Label (if any specified) should be displayed on the left side of the component

### `checked-icon`

Type: `String`

Added in: v2.5

The icon to be used when the model is truthy (instead of the default design)

Examples:

- `'visibility'`

### `unchecked-icon`

Type: `String`

Added in: v2.5

The icon to be used when the toggle is falsy (instead of the default design)

Examples:

- `'visibility_off'`

### `indeterminate-icon`

Type: `String`

Added in: v2.5

The icon to be used when the model is indeterminate (instead of the default design)

Examples:

- `'help'`

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `keep-color`

Type: `Boolean`

Should the color (if specified any) be kept when the component is unticked/ off?

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

### `toggle`

Toggle the state (of the model)
