# QScrollObserver API

Type: component

Canonical documentation: https://quasar.dev/vue-components/scroll-observer

## Props

### `debounce`

Type: `String | Number`

Debounce amount (in milliseconds)

Examples:

- `0`
- `'530'`

### `axis`

Type: `String`

Default: `'vertical'`

Axis on which to detect changes

Accepted values: `'both'`, `'vertical'`, `'horizontal'`

### `scroll-target`

Type: `Element | String`

CSS selector or DOM element to be used as a custom scroll container instead of the auto detected one

Examples:

- `.scroll-target-class`
- `#scroll-target-id`
- `$refs.scrollTarget`
- `document.body`

## Events

### `scroll`

Emitted when scroll position changes

## Methods

### `trigger`

Emit a 'scroll' event

### `getPosition`

Get current scroll details under the form of an Object: { position, direction, directionChanged, inflectionPoint }
