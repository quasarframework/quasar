# QAjaxBar API

Type: component

Canonical documentation: https://quasar.dev/vue-components/ajax-bar

## Props

### `position`

Type: `String`

Default: `'top'`

Position within window of where QAjaxBar should be displayed

Accepted values: `'top'`, `'right'`, `'bottom'`, `'left'`

### `size`

Type: `String`

Default: `'2px'`

Size in CSS units, including unit name

Examples:

- `'16px'`
- `'2rem'`

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `reverse`

Type: `Boolean`

Reverse direction of progress

### `skip-hijack`

Type: `Boolean`

Skip Ajax hijacking (not a reactive prop)

### `hijack-filter`

Type: `Function`

Added in: v2.4.5

Filter which URL should trigger start() + stop()

## Events

### `start`

Emitted when bar is triggered to appear

### `stop`

Emitted when bar has finished its job

## Methods

### `start`

Notify bar you are waiting for a new process to finish

### `increment`

Manually trigger a bar progress increment

### `stop`

Notify bar that one process you were waiting has finished
