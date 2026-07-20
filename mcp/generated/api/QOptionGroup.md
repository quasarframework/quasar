# QOptionGroup API

Type: component

Canonical documentation: https://quasar.dev/vue-components/option-group

## Props

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

- `# v-model="group"`

### `options`

Type: `Array`

Default: `[]`

Array of objects that the binary components will be created from. For best performance reference a variable in your scope. Canonical form of each object is with 'label' (String), 'value' (Any) and optional 'disable' (Boolean) props (can be customized with options-value/option-label/option-disable props) along with any other props from QToggle, QCheckbox, or QRadio.

Examples:

- `[{ label: 'Option 1', value: 'op1' }, { label: 'Option 2', value: 'op2' }, { label: 'Option 3', value: 'op3', disable: true }]`

### `option-value`

Type: `Function | String`

Default: `'value'`

Added in: v2.17

Property of option which holds the 'value'; If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `'modelNumber'`
- `item => (item === null ? null : item.modelNumber)`

### `option-label`

Type: `Function | String`

Default: `'label'`

Added in: v2.17

Property of option which holds the 'label'; If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `'itemName'`
- `item => (item === null ? 'Null value' : item.itemName)`

### `option-disable`

Type: `Function | String`

Default: `'disable'`

Added in: v2.17

Property of option which tells it's disabled; The value of the property must be a Boolean; If using a function then for best performance, reference it from your scope and do not define it inline

Examples:

- `item => (item === null ? true : item.cannotSelect)`
- `# option-disable="cannotSelect"`

### `name`

Type: `String`

Used to specify the name of the controls; Useful if dealing with forms submitted directly to a URL

Examples:

- `'car_id'`

### `type`

Type: `String`

Default: `'radio'`

The type of input component to be used

Accepted values: `'radio'`, `'checkbox'`, `'toggle'`

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `keep-color`

Type: `Boolean`

Should the color (if specified any) be kept when input components are unticked?

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `dense`

Type: `Boolean`

Dense mode; occupies less space

### `left-label`

Type: `Boolean`

Label (if any specified) should be displayed on the left side of the input components

### `inline`

Type: `Boolean`

Show input components as inline-block rather than each having their own row

### `disable`

Type: `Boolean`

Put component in disabled mode

## Slots

### `label`

Added in: v2.2

Generic slot for all labels

### `label-[name]`

Added in: v2.2

Slot to define the specific label for the option at '[name]' where name is a 0-based index; Overrides the generic 'label' slot if used

## Events

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model
