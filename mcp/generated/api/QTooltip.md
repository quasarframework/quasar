# QTooltip API

Type: component

Canonical documentation: https://quasar.dev/vue-components/tooltip

## Props

### `transition-show`

Type: `String`

Default: `'jump-down'`

One of Quasar's embedded transitions

Examples:

- `'fade'`
- `'slide-down'`

### `transition-hide`

Type: `String`

Default: `'jump-up'`

One of Quasar's embedded transitions

Examples:

- `'fade'`
- `'slide-down'`

### `transition-duration`

Type: `String | Number`

Default: `300`

Transition duration (in milliseconds, without unit)

### `target`

Type: `Boolean | String | Element`

Default: `true`

Configure a target element to trigger component toggle; 'true' means it enables the parent DOM element, 'false' means it disables attaching events to any DOM elements; By using a String (CSS selector) or a DOM element it attaches the events to the specified DOM element (if it exists)

Examples:

- `false`
- `.my-parent`
- `#target-id`
- `$refs.target`

### `no-parent-event`

Type: `Boolean`

Skips attaching events to the target DOM element (that trigger the element to get shown)

### `model-value`

Type: `Boolean | null`

Default: `null`

Model of the component defining shown/hidden state; Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive

Examples:

- `# v-model="state"`

### `max-height`

Type: `String | null`

Default: `null`

The maximum height of the Tooltip; Size in CSS units, including unit name

Examples:

- `'16px'`
- `'2rem'`

### `max-width`

Type: `String | null`

Default: `null`

The maximum width of the Tooltip; Size in CSS units, including unit name

Examples:

- `'16px'`
- `'2rem'`

### `anchor`

Type: `String`

Default: `'bottom middle'`

Two values setting the starting position or anchor point of the Tooltip relative to its target

Accepted values: `'top left'`, `'top middle'`, `'top right'`, `'top start'`, `'top end'`, `'center left'`, `'center middle'`, `'center right'`, `'center start'`, `'center end'`, `'bottom left'`, `'bottom middle'`, `'bottom right'`, `'bottom start'`, `'bottom end'`

### `self`

Type: `String`

Default: `'top middle'`

Two values setting the Tooltip's own position relative to its target

Accepted values: `'top left'`, `'top middle'`, `'top right'`, `'top start'`, `'top end'`, `'center left'`, `'center middle'`, `'center right'`, `'center start'`, `'center end'`, `'bottom left'`, `'bottom middle'`, `'bottom right'`, `'bottom start'`, `'bottom end'`

### `offset`

Type: `Array`

Default: `[14, 14]`

An array of two numbers to offset the Tooltip horizontally and vertically in pixels

Examples:

- `[8, 8]`
- `[5, 10]`

### `scroll-target`

Type: `Element | String`

CSS selector or DOM element to be used as a custom scroll container instead of the auto detected one

Examples:

- `.scroll-target-class`
- `#scroll-target-id`
- `$refs.scrollTarget`
- `document.body`

### `delay`

Type: `Number`

Default: `0`

Configure Tooltip to appear with delay

### `hide-delay`

Type: `Number`

Default: `0`

Configure Tooltip to disappear with delay

### `persistent`

Type: `Boolean`

Prevents Tooltip from auto-closing when app's route changes

## Slots

### `default`

Default slot in the devland unslotted content of the component

## Events

### `update:model-value`

Emitted when showing/hidden state changes; Is also used by v-model

### `show`

Emitted after component has triggered show()

### `before-show`

Emitted when component triggers show() but before it finishes doing it

### `hide`

Emitted after component has triggered hide()

### `before-hide`

Emitted when component triggers hide() but before it finishes doing it

## Methods

### `show`

Triggers component to show

### `hide`

Triggers component to hide

### `toggle`

Triggers component to toggle between show/hide

### `updatePosition`

There are some custom scenarios for which Quasar cannot automatically reposition the tooltip without significant performance drawbacks so the optimal solution is for you to call this method when you need it

## Computed properties

### `contentEl`

Type: `Element`

Added in: v2.10.1

The DOM Element of the rendered content
