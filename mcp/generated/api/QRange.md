# QRange API

Type: component

Canonical documentation: https://quasar.dev/vue-components/range

## Props

### `name`

Type: `String`

Used to specify the name of the control; Useful if dealing with forms submitted directly to a URL

Examples:

- `'car_id'`

### `min`

Type: `Number`

Default: `0`

Minimum value of the model; Set track's minimum value

### `max`

Type: `Number`

Default: `100`

Maximum value of the model; Set track's maximum value

### `inner-min`

Type: `Number`

Added in: v2.4

Inner minimum value of the model; Use in case you need the model value to be inside of the track's min-max values; Needs to be higher or equal to 'min' prop; Defaults to 'min' prop

### `inner-max`

Type: `Number`

Added in: v2.4

Inner maximum value of the model; Use in case you need the model value to be inside of the track's min-max values; Needs to be lower or equal to 'max' prop; Defaults to 'max' prop

### `step`

Type: `Number`

Default: `1`

Specify step amount between valid values (> 0.0); When step equals to 0 it defines infinite granularity

### `snap`

Type: `Boolean`

Snap on valid values, rather than sliding freely; Suggestion: use with 'step' prop

### `reverse`

Type: `Boolean`

Work in reverse (changes direction)

### `vertical`

Type: `Boolean`

Display in vertical direction

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `track-color`

Type: `String`

Added in: v2.4

Color name for the track (can be 'transparent' too) from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `track-img`

Type: `String`

Added in: v2.4

Apply a pattern image on the track

Examples:

- `'~@/assets/my-pattern.png'`

### `inner-track-color`

Type: `String`

Added in: v2.4

Color name for the inner track (can be 'transparent' too) from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `inner-track-img`

Type: `String`

Added in: v2.4

Apply a pattern image on the inner track

Examples:

- `'~@/assets/my-pattern.png'`

### `selection-color`

Type: `String`

Added in: v2.4

Color name for the selection bar (can be 'transparent' too) from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `selection-img`

Type: `String`

Added in: v2.4

Apply a pattern image on the selection bar

Examples:

- `'~@/assets/my-pattern.png'`

### `label`

Type: `Boolean`

Popup a label when user clicks/taps on the slider thumb and moves it

### `label-color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `label-text-color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `switch-label-side`

Type: `Boolean`

Added in: v2.4

Switch the position of the label (top <-> bottom or left <-> right)

### `label-always`

Type: `Boolean`

Always display the label

### `markers`

Type: `Boolean | Number`

Display markers on the track, one for each possible value for the model or using a custom step (when specifying a Number)

Examples:

- `5`
- `true`

### `marker-labels`

Type: `Boolean | Array | Object | Function`

Added in: v2.4

Configure the marker labels (or show the default ones if 'true'); Array of definition Objects or Object with key-value where key is the model and the value is the marker label definition

Examples:

- `true`
- `[{ value: 0, label: '0%' }, { value: 5, classes: 'my-class', style: { width: '24px' } }]`
- `{ 0: '0%', 5: { label: '5%', classes: 'my-class', style: { width: '24px' } } }`
- `val => (10 * val) + '%'`
- `val => ({ label: (10 * val) + '%', classes: 'my-class', style: { width: '24px' } })`

### `marker-labels-class`

Type: `String`

Added in: v2.4

CSS class(es) to apply to the marker labels container

Examples:

- `'text-orange'`

### `switch-marker-labels-side`

Type: `Boolean`

Added in: v2.4

Switch the position of the marker labels (top <-> bottom or left <-> right)

### `track-size`

Type: `String`

Default: `'4px'`

Added in: v2.4

Track size (including CSS unit)

Examples:

- `'35px'`

### `thumb-size`

Type: `String`

Default: `'20px'`

Added in: v2.4

Thumb size (including CSS unit)

Examples:

- `'20px'`

### `thumb-color`

Type: `String`

Added in: v2.4

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `thumb-path`

Type: `String`

Default: `'M 4, 10 a 6,6 0 1,0 12,0 a 6,6 0 1,0 -12,0'`

Set custom thumb svg path

Examples:

- `'M5 5 h10 v10 h-10 v-10'`

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

### `readonly`

Type: `Boolean`

Put component in readonly mode

### `tabindex`

Type: `Number | String`

Tabindex HTML attribute value

Examples:

- `100`
- `'0'`

### `model-value`

Type: `Object | null | undefined`

Default: `{ min: null, max: null }`

Required: yes

Model of the component of type { min, max } (both values must be between global min/max); Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive

Examples:

- `# v-model="positionModel"`

### `drag-range`

Type: `Boolean`

User can drag range instead of just the two thumbs

### `drag-only-range`

Type: `Boolean`

User can drag only the range instead and NOT the two thumbs

### `left-label-color`

Type: `String`

Color name for left label background from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `left-label-text-color`

Type: `String`

Color name for left label text from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `right-label-color`

Type: `String`

Color name for right label background from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `right-label-text-color`

Type: `String`

Color name for right label text from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `left-label-value`

Type: `String | Number`

Override default label for min value

Examples:

- `# :left-label-value="model.min + 'px'"`

### `right-label-value`

Type: `String | Number`

Override default label for max value

Examples:

- `# :right-label-value="model.max + 'px'"`

### `left-thumb-color`

Type: `String`

Added in: v2.4

Color name (from the Quasar Color Palette) for left thumb

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `right-thumb-color`

Type: `String`

Added in: v2.4

Color name (from the Quasar Color Palette) for right thumb

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

## Slots

### `marker-label`

Added in: v2.4

What should the menu display after filtering options and none are left to be displayed; Suggestion: <div>

### `marker-label-group`

Added in: v2.4

What should the menu display after filtering options and none are left to be displayed; Suggestion: <div>

## Events

### `change`

Emitted on lazy model value change (after user slides then releases the thumb)

### `pan`

Triggered when user starts panning on the component

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model
