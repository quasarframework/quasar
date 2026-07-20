# QTime API

Type: component

Canonical documentation: https://quasar.dev/vue-components/time

## Props

### `name`

Type: `String`

Used to specify the name of the control; Useful if dealing with forms submitted directly to a URL

Examples:

- `'car_id'`

### `landscape`

Type: `Boolean`

Display the component in landscape mode

### `mask`

Type: `String | null`

Default: `'HH:mm'`

Mask (formatting string) used for parsing and formatting value

Examples:

- `'HH:mm:ss'`
- `'YYYY-MM-DD HH:mm:ss'`
- `'HH:mm MMMM Do, YYYY'`

### `locale`

Type: `Object`

Locale formatting options

Examples:

- `{ monthsShort: [ 'Ian', 'Feb', 'Mar', '...' ] }`

### `calendar`

Type: `String`

Default: `'gregorian'`

Specify calendar type

Accepted values: `'gregorian'`, `'persian'`

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

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `square`

Type: `Boolean`

Removes border-radius so borders are squared

### `flat`

Type: `Boolean`

Applies a 'flat' design (no default shadow)

### `bordered`

Type: `Boolean`

Applies a default border to the component

### `readonly`

Type: `Boolean`

Put component in readonly mode

### `disable`

Type: `Boolean`

Put component in disabled mode

### `model-value`

Type: `String | null | undefined`

Required: yes

Time of the component; Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive

Examples:

- `# v-model="currentTime"`

### `format24h`

Type: `Boolean | null`

Default: `null`

Forces 24 hour time display instead of AM/PM system; If prop is not set, then the default is based on Quasar lang language being used

### `default-date`

Type: `String`

Default: `# current day`

The default date to use (in YYYY/MM/DD format) when model is unfilled (undefined or null)

Examples:

- `'1995/02/23'`

### `options`

Type: `Function`

Optionally configure what time is the user allowed to set; Overridden by 'hour-options', 'minute-options' and 'second-options' if those are set; For best performance, reference it from your scope and do not define it inline

Examples:

- `(hr, min, sec) => hr <= 6`

### `hour-options`

Type: `Array`

Optionally configure what hours is the user allowed to set; Overrides 'options' prop if that is also set

Examples:

- `[3, 6, 9]`

### `minute-options`

Type: `Array`

Optionally configure what minutes is the user allowed to set; Overrides 'options' prop if that is also set

Examples:

- `[0, 15, 30, 45]`

### `second-options`

Type: `Array`

Optionally configure what seconds is the user allowed to set; Overrides 'options' prop if that is also set

Examples:

- `[0, 7, 10, 23]`

### `with-seconds`

Type: `Boolean`

Allow the time to be set with seconds

### `now-btn`

Type: `Boolean`

Display a button that selects the current time

## Slots

### `default`

This is where additional buttons can go

## Events

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model

## Methods

### `setNow`

Change model to current moment
