# QPopupProxy API

Type: component

Canonical documentation: https://quasar.dev/vue-components/popup-proxy

## Props

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

### `context-menu`

Type: `Boolean`

Allows the component to behave like a context menu, which opens with a right mouse click (or long tap on mobile)

### `model-value`

Type: `Boolean`

Defines the state of the component (shown/hidden); Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive

### `breakpoint`

Type: `Number | String`

Default: `450`

Breakpoint (in pixels) of window width/height (whichever is smaller) from where a Menu will get to be used instead of a Dialog

## Slots

### `default`

Default slot in the devland unslotted content of the component

## Events

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model

### `before-show`

Emitted when component triggers show() but before it finishes doing it

### `show`

Emitted after component has triggered show()

### `before-hide`

Emitted when component triggers hide() but before it finishes doing it

### `hide`

Emitted after component has triggered hide()

## Methods

### `show`

Triggers component to show

### `hide`

Triggers component to hide

### `toggle`

Triggers component to toggle between show/hide

## Computed properties

### `currentComponent`

Type: `Object`

Access current underlying component (QMenu or QDialog)
