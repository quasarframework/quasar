# QInnerLoading API

Type: component

Canonical documentation: https://quasar.dev/vue-components/inner-loading

## Props

### `transition-show`

Type: `String`

Default: `'fade'`

One of Quasar's embedded transitions

Examples:

- `'fade'`
- `'slide-down'`

### `transition-hide`

Type: `String`

Default: `'fade'`

One of Quasar's embedded transitions

Examples:

- `'fade'`
- `'slide-down'`

### `transition-duration`

Type: `String | Number`

Default: `300`

Transition duration (in milliseconds, without unit)

### `size`

Type: `String | Number`

Default: `'42px'`

Size in CSS units, including unit name, or standard size name (xs|sm|md|lg|xl), for the inner Spinner (unless using the default slot)

Examples:

- `'16px'`
- `'2rem'`
- `'xs'`
- `'md'`

### `showing`

Type: `Boolean`

State - loading or not

### `color`

Type: `String`

Color name for component from the Quasar Color Palette for the inner Spinner (unless using the default slot)

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `label`

Type: `String`

Added in: v2.2

Add a label; Gets overriden when using the default slot

Examples:

- `'Please wait...'`

### `label-class`

Type: `String`

Added in: v2.2

Add CSS class(es) to the label; Works along the 'label' prop only

Examples:

- `'text-red q-mt-xl'`

### `label-style`

Type: `String | Array | Object`

Added in: v2.2

Apply custom style to the label; Works along the 'label' prop only

Examples:

- `'font-size: 28px'`
- `{ color: '#ff0000' }`

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

## Slots

### `default`

Default slot is used for replacing default Spinner; Suggestions: a spinner or text
