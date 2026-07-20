# QFabAction API

Type: component

Canonical documentation: https://quasar.dev/vue-components/floating-action-button

## Props

### `type`

Type: `String`

Default: `'a'`

Define the button HTML DOM type

Accepted values: `'a'`, `'submit'`, `'button'`, `'reset'`

### `outline`

Type: `Boolean`

Use 'outline' design for Fab button

### `push`

Type: `Boolean`

Use 'push' design for Fab button

### `flat`

Type: `Boolean`

Use 'flat' design for Fab button

### `unelevated`

Type: `Boolean`

Remove shadow

### `padding`

Type: `String`

Apply custom padding (vertical [horizontal]); Size in CSS units, including unit name or standard size name (none|xs|sm|md|lg|xl); Also removes the min width and height when set

Examples:

- `'16px'`
- `'10px 5px'`
- `'2rem'`
- `'xs'`
- `'md lg'`

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

### `glossy`

Type: `Boolean`

Apply the glossy effect over the button

### `external-label`

Type: `Boolean`

Display label besides the FABs, as external content

### `label`

Type: `String | Number`

Default: `''`

The label that will be shown when Fab is extended

Examples:

- `'Button Label'`

### `label-position`

Type: `String`

Default: `'right'`

Position of the label around the icon

Accepted values: `'top'`, `'right'`, `'bottom'`, `'left'`

### `hide-label`

Type: `Boolean | null`

Hide the label; Useful for animation purposes where you toggle the visibility of the label

### `label-class`

Type: `String | Array | Object`

Class definitions to be attributed to the label container

Examples:

- `'my-special-class'`
- `{ 'my-special-class': true }`

### `label-style`

Type: `String | Array | Object`

Style definitions to be attributed to the label container

Examples:

- `'background-color: #ff0000'`
- `{ backgroundColor: '#ff0000' }`

### `square`

Type: `Boolean`

Apply a rectangle aspect to the FAB

### `disable`

Type: `Boolean`

Put component in disabled mode

### `tabindex`

Type: `Number | String`

Tabindex HTML attribute value

Examples:

- `100`
- `'0'`

### `icon`

Type: `String`

Default: `''`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `anchor`

Type: `String`

How to align the Fab Action relative to Fab expand side; By default it uses the align specified in QFab

Accepted values: `'start'`, `'center'`, `'end'`

### `to`

Type: `String | Object`

Equivalent to Vue Router <router-link> 'to' property

Examples:

- `'/home/dashboard'`
- `{ name: 'my-route-name' }`

### `replace`

Type: `Boolean`

Equivalent to Vue Router <router-link> 'replace' property

## Slots

### `default`

Suggestion for this slot: QTooltip

### `icon`

Added in: v2.4

Slot for icon; Suggestion: QIcon

### `label`

Added in: v2.4

Slot for label

## Events

### `click`

Emitted when user clicks/taps on the component

## Methods

### `click`

Emulate click on QFabAction
