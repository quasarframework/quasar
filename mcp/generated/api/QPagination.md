# QPagination API

Type: component

Canonical documentation: https://quasar.dev/vue-components/pagination

## Props

### `model-value`

Type: `Number`

Required: yes

Current page (must be between min/max)

### `min`

Type: `Number | String`

Default: `1`

Minimum page (must be lower than 'max')

### `max`

Type: `Number | String`

Required: yes

Number of last page (must be higher than 'min')

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color (useful when you are using it along with the 'input' prop)

### `size`

Type: `String`

Button size in CSS units, including unit name

Examples:

- `'20px'`

### `disable`

Type: `Boolean`

Put component in disabled mode

### `input`

Type: `Boolean`

Use an input instead of buttons

### `icon-prev`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `icon-next`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `icon-first`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `icon-last`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `to-fn`

Type: `Function`

Generate link for page buttons; For best performance, reference it from your scope and do not define it inline

Examples:

- `page => ({ query: { page } })`

### `boundary-links`

Type: `Boolean | null`

Default: `null`

Show boundary button links

### `boundary-numbers`

Type: `Boolean | null`

Default: `null`

Always show first and last page buttons (if not using 'input')

### `direction-links`

Type: `Boolean | null`

Default: `null`

Show direction buttons

### `ellipses`

Type: `Boolean | null`

Default: `null`

Show ellipses (...) when pages are available

### `max-pages`

Type: `Number | String`

Default: `0`

Maximum number of page links to display at a time; 0 means Infinite

### `flat`

Type: `Boolean`

Use 'flat' design for non-active buttons (it's the default option)

### `outline`

Type: `Boolean`

Use 'outline' design for non-active buttons

### `unelevated`

Type: `Boolean`

Remove shadow for non-active buttons

### `push`

Type: `Boolean`

Use 'push' design for non-active buttons

### `color`

Type: `String`

Default: `'primary'`

Color name from the Quasar Color Palette for the non-active buttons

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `text-color`

Type: `String`

Text color name from the Quasar Color Palette for the ACTIVE buttons

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `active-design`

Type: `String`

Default: `''`

Added in: v2.10

The design of the ACTIVE button, similar to the flat/outline/push/unelevated props (but those are used for non-active buttons)

Accepted values: `'flat'`, `'outline'`, `'push'`, `'unelevated'`, `''`

### `active-color`

Type: `String`

Default: `'primary'`

Color name from the Quasar Color Palette for the ACTIVE button

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `active-text-color`

Type: `String`

Text color name from the Quasar Color Palette for the ACTIVE button

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `round`

Type: `Boolean`

Makes a circle shaped button for all buttons

### `rounded`

Type: `Boolean`

Applies a more prominent border-radius for a squared shape button for all buttons

### `glossy`

Type: `Boolean`

Applies a glossy effect for all buttons

### `gutter`

Type: `String`

Default: `'2px'`

Added in: v2.10

Apply custom gutter; Size in CSS units, including unit name or standard size name (none|xs|sm|md|lg|xl)

Examples:

- `'16px'`
- `'10px 5px'`
- `'2rem'`
- `'xs'`
- `'md lg'`
- `'2px 2px 5px 7px'`

### `padding`

Type: `String`

Default: `'3px 2px'`

Apply custom padding (vertical [horizontal]); Size in CSS units, including unit name or standard size name (none|xs|sm|md|lg|xl); Also removes the min width and height when set

Examples:

- `'16px'`
- `'10px 5px'`
- `'2rem'`
- `'xs'`
- `'md lg'`
- `'2px 2px 5px 7px'`

### `input-style`

Type: `String | Array | Object`

Style definitions to be attributed to the input (if using one)

Examples:

- `'background-color: #ff0000'`
- `{ backgroundColor: '#ff0000' }`

### `input-class`

Type: `String | Array | Object`

Class definitions to be attributed to the input (if using one)

Examples:

- `'my-special-class'`
- `{ 'my-special-class': true }`

### `ripple`

Type: `Boolean | Object | null`

Default: `true`

Configure buttons material ripple (disable it by setting it to 'false' or supply a config object); Does not applies to boundary and ellipsis buttons

Examples:

- `false`
- `{ early: true, center: true, color: 'teal', keyCodes: [] }`

## Events

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model

## Methods

### `set`

Go directly to the specified page

### `setByOffset`

Increment/Decrement current page by offset
