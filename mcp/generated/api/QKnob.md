# QKnob API

Type: component

Canonical documentation: https://quasar.dev/vue-components/knob

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

Type: `Number`

Required: yes

Any number to indicate the given value of the knob. Either use this property (along with a listener for 'update:modelValue' event) OR use the v-model directive

Examples:

- `# v-model="myValue"`

### `min`

Type: `Number`

Default: `0`

The minimum value that the model (the knob value) should start at

### `max`

Type: `Number`

Default: `100`

The maximum value that the model (the knob value) should go to

### `inner-min`

Type: `Number`

Added in: v2.5.4

Inner minimum value of the model; Use in case you need the model value to be inside of the track's min-max values; Needs to be higher or equal to 'min' prop; Defaults to 'min' prop

### `inner-max`

Type: `Number`

Added in: v2.5.4

Inner maximum value of the model; Use in case you need the model value to be inside of the track's min-max values; Needs to be lower or equal to 'max' prop; Defaults to 'max' prop

### `step`

Type: `Number`

Default: `1`

A number representing steps in the value of the model, while adjusting the knob

### `reverse`

Type: `Boolean`

Reverses the direction of progress

### `instant-feedback`

Type: `Boolean`

No animation when model changes

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `center-color`

Type: `String`

Color name for the center part of the component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `track-color`

Type: `String`

Color name for the track of the component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `font-size`

Type: `String`

Size of text in CSS units, including unit name. Suggestion: use 'em' units to sync with component size

Examples:

- `'1em'`
- `'16px'`
- `'2rem'`

### `rounded`

Type: `Boolean`

Added in: v2.8.4

Rounding the arc of progress

### `thickness`

Type: `Number`

Default: `0.2`

Thickness of progress arc as a ratio (0.0 < x < 1.0) of component size

### `angle`

Type: `Number`

Default: `0`

Angle to rotate progress arc by

### `show-value`

Type: `Boolean`

Enables the default slot and uses it (if available), otherwise it displays the 'value' prop as text; Make sure the text has enough space to be displayed inside the component

### `tabindex`

Type: `Number | String`

Default: `0`

Tabindex HTML attribute value

Examples:

- `100`
- `'0'`

### `disable`

Type: `Boolean`

Put component in disabled mode

### `readonly`

Type: `Boolean`

Put component in readonly mode

## Slots

### `default`

Default slot in the devland unslotted content of the component

## Events

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model

### `change`

Fires at the end of a knob's adjustment and offers the value of the model

### `drag-value`

The value of the model while dragging is still in progress
