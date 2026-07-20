# QInfiniteScroll API

Type: component

Canonical documentation: https://quasar.dev/vue-components/infinite-scroll

## Props

### `offset`

Type: `Number`

Default: `500`

Offset (pixels) to bottom of Infinite Scroll container from which the component should start loading more content in advance

### `debounce`

Type: `String | Number`

Default: `100`

Debounce amount (in milliseconds)

### `initial-index`

Type: `Number`

Default: `0`

Initialize the pagination index (used for the @load event)

### `scroll-target`

Type: `Element | String`

CSS selector or DOM element to be used as a custom scroll container instead of the auto detected one

Examples:

- `.scroll-target-class`
- `#scroll-target-id`
- `$refs.scrollTarget`
- `document.body`

### `disable`

Type: `Boolean`

Put component in disabled mode

### `reverse`

Type: `Boolean`

Scroll area should behave like a messenger - starting scrolled to bottom and loading when reaching the top

## Slots

### `default`

Default slot in the devland unslotted content of the component

### `loading`

Slot displaying something while loading content; Example: QSpinner

## Events

### `load`

Emitted when Infinite Scroll needs to load more data

## Methods

### `poll`

Checks scroll position and loads more content if necessary

### `trigger`

Tells Infinite Scroll to load more content, regardless of the scroll position

### `reset`

Resets calling index to 0

### `stop`

Stops working, regardless of scroll position

### `resume`

Starts working. Checks scroll position upon call and if trigger is hit, it loads more content

### `setIndex`

Overwrite the current pagination index

### `updateScrollTarget`

Updates the scroll target; Useful when the parent elements change so that the scrolling target also changes
