# QRating API

Type: component

Canonical documentation: https://quasar.dev/vue-components/rating

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

Model of the component; Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive

Examples:

- `# v-model="rating"`
- `# :model-value="rating"`
- `# :model-value="2"`

### `max`

Type: `Number | String`

Default: `5`

Number of icons to display

### `icon`

Type: `String | Array`

Icon name following Quasar convention; make sure you have the icon library installed unless you are using 'img:' prefix; If an array is provided each rating value will use the corresponding icon in the array (0 based)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `icon-selected`

Type: `String | Array`

Icon name following Quasar convention to be used when selected (optional); make sure you have the icon library installed unless you are using 'img:' prefix; If an array is provided each rating value will use the corresponding icon in the array (0 based)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `icon-half`

Type: `String | Array`

Icon name following Quasar convention to be used when selected (optional); make sure you have the icon library installed unless you are using 'img:' prefix; If an array is provided each rating value will use the corresponding icon in the array (0 based)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `icon-aria-label`

Type: `String | Array`

Added in: v1.20.3

Label to be set on aria-label for Icon; If an array is provided each rating value will use the corresponding aria-label in the array (0 based); If string value is provided the rating value will be appended; If not provided the name of the icon will be used

Examples:

- `'Rating'`
- `['Bad', 'Normal', 'Good']`

### `color`

Type: `String | Array`

Color name for component from the Quasar Color Palette; v1.5.0+: If an array is provided each rating value will use the corresponding color in the array (0 based)

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`
- `['accent', 'grey-7']`

### `color-selected`

Type: `String | Array`

Color name from the Quasar Palette for selected icons

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `color-half`

Type: `String | Array`

Color name from the Quasar Palette for half selected icons

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `no-dimming`

Type: `Boolean`

Does not lower opacity for unselected icons

### `no-reset`

Type: `Boolean`

When used, disables default behavior of clicking/tapping on icon which represents current model value to reset model to 0

### `readonly`

Type: `Boolean`

Put component in readonly mode

### `disable`

Type: `Boolean`

Put component in disabled mode

## Slots

### `tip-[name]`

Slot to define the tooltip of icon at '[name]' where name is a 1-based index; Suggestion: QTooltip

## Events

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model
