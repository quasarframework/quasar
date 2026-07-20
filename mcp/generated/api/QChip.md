# QChip API

Type: component

Canonical documentation: https://quasar.dev/vue-components/chip

## Props

### `dense`

Type: `Boolean`

Dense mode; occupies less space

### `size`

Type: `String`

QChip size name or a CSS unit including unit name

Examples:

- `'xs'`
- `'sm'`
- `'md'`
- `'lg'`
- `'xl'`
- `'25px'`
- `'2rem'`

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `icon`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `icon-right`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `icon-remove`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `icon-selected`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `label`

Type: `String | Number`

Chip's content as string; overrides default slot if specified

Examples:

- `'John Doe'`
- `'Book'`

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

### `model-value`

Type: `Boolean`

Default: `true`

Model of the component determining if QChip should be rendered or not

### `selected`

Type: `Boolean | null`

Default: `null`

Model for QChip if it's selected or not

Examples:

- `# v-model:selected="myState"`

### `square`

Type: `Boolean`

Sets a low value for border-radius instead of the default one, making it close to a square

### `outline`

Type: `Boolean`

Display using the 'outline' design

### `clickable`

Type: `Boolean`

Is QChip clickable? If it's the case, then it will add hover effects and emit 'click' events

### `removable`

Type: `Boolean`

If set, then it displays a 'remove' icon that when clicked the QChip emits 'remove' event

### `ripple`

Type: `Boolean | Object`

Default: `true`

Configure material ripple (disable it by setting it to 'false' or supply a config object)

Examples:

- `false`
- `{ early: true, center: true, color: 'teal', keyCodes: [] }`

### `remove-aria-label`

Type: `String`

Added in: v2.8.4

aria-label to be used on the remove icon

Examples:

- `'Remove item'`

### `tabindex`

Type: `Number | String`

Tabindex HTML attribute value

Examples:

- `100`
- `'0'`

### `disable`

Type: `Boolean`

Put component in disabled mode

## Slots

### `default`

This is where QChip content goes, if not using 'label' property

## Events

### `click`

Emitted on QChip click if 'clickable' property is set

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model

### `update:selected`

Used by Vue on 'v-model:selected' for updating its value

### `remove`

Works along with 'value' and 'removable' prop. Emitted when toggling rendering state of the QChip
