# QBtnToggle API

Type: component

Canonical documentation: https://quasar.dev/vue-components/button-toggle

## Props

### `name`

Type: `String`

Used to specify the name of the control; Useful if dealing with forms submitted directly to a URL

Examples:

- `'car_id'`

### `model-value`

Type: `Any`

Required: yes

Model of the component; Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive

Examples:

- `# v-model="selected"`

### `options`

Type: `Array`

Required: yes

Array of Objects defining each option

Examples:

- `[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]`

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

### `toggle-color`

Type: `String`

Default: `'primary'`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `toggle-text-color`

Type: `String`

Overrides text color (if needed); Color name from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `spread`

Type: `Boolean`

Spread horizontally to all available space

### `outline`

Type: `Boolean`

Use 'outline' design

### `flat`

Type: `Boolean`

Use 'flat' design

### `unelevated`

Type: `Boolean`

Remove shadow

### `rounded`

Type: `Boolean`

Applies a more prominent border-radius for a squared shape button

### `push`

Type: `Boolean`

Use 'push' design

### `glossy`

Type: `Boolean`

Applies a glossy effect

### `size`

Type: `String`

Button size name or a CSS unit including unit name

Examples:

- `'xs'`
- `'sm'`
- `'md'`
- `'lg'`
- `'xl'`
- `'25px'`
- `'2rem'`

### `padding`

Type: `String`

Apply custom padding (vertical [horizontal]); Size in CSS units, including unit name or standard size name (none|xs|sm|md|lg|xl); Also removes the min width and height when set

Examples:

- `'16px'`
- `'10px 5px'`
- `'2rem'`
- `'xs'`
- `'md lg'`
- `'2px 2px 5px 7px'`

### `no-caps`

Type: `Boolean`

Avoid turning label text into caps (which happens by default)

### `no-wrap`

Type: `Boolean`

Avoid label text wrapping

### `ripple`

Type: `Boolean | Object`

Default: `true`

Configure material ripple (disable it by setting it to 'false' or supply a config object)

Examples:

- `false`
- `{ early: true, center: true, color: 'teal', keyCodes: [] }`

### `dense`

Type: `Boolean`

Dense mode; occupies less space

### `readonly`

Type: `Boolean`

Put component in readonly mode

### `disable`

Type: `Boolean`

Put component in disabled mode

### `stack`

Type: `Boolean`

Stack icon and label vertically instead of on same line (like it is by default)

### `stretch`

Type: `Boolean`

When used on flexbox parent, button will stretch to parent's height

### `clearable`

Type: `Boolean`

Clears model on click of the already selected button

## Slots

### `default`

Suggestions: QTooltip, QBadge

### `...`

Any other dynamic slots to be used with 'slot' property of the 'options' prop

## Events

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model

### `clear`

When using the 'clearable' property, this event is emitted when the already selected button is clicked
