# QMenu API

Type: component

Canonical documentation: https://quasar.dev/vue-components/menu

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

Type: `Boolean | null`

Default: `null`

Model of the component defining shown/hidden state; Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive

Examples:

- `# v-model="state"`

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `fit`

Type: `Boolean`

Allows the menu to match at least the full width of its target

### `cover`

Type: `Boolean`

Allows the menu to cover its target. When used, the 'self' and 'fit' props are no longer effective

### `anchor`

Type: `String`

Two values setting the starting position or anchor point of the menu relative to its target

Accepted values: `'top left'`, `'top middle'`, `'top right'`, `'top start'`, `'top end'`, `'center left'`, `'center middle'`, `'center right'`, `'center start'`, `'center end'`, `'bottom left'`, `'bottom middle'`, `'bottom right'`, `'bottom start'`, `'bottom end'`

### `self`

Type: `String`

Two values setting the menu's own position relative to its target

Accepted values: `'top left'`, `'top middle'`, `'top right'`, `'top start'`, `'top end'`, `'center left'`, `'center middle'`, `'center right'`, `'center start'`, `'center end'`, `'bottom left'`, `'bottom middle'`, `'bottom right'`, `'bottom start'`, `'bottom end'`

### `offset`

Type: `Array`

An array of two numbers to offset the menu horizontally and vertically in pixels

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

### `touch-position`

Type: `Boolean`

Allows for the target position to be set by the mouse position, when the target of the menu is either clicked or touched

### `persistent`

Type: `Boolean`

Allows the menu to not be dismissed by a click/tap outside of the menu or by hitting the ESC key; Also, an app route change won't dismiss it

### `no-esc-dismiss`

Type: `Boolean`

Added in: v2.18

User cannot dismiss the popup by hitting ESC key; No need to set it if 'persistent' prop is also set

### `no-route-dismiss`

Type: `Boolean`

Changing route app won't dismiss the popup; No need to set it if 'persistent' prop is also set

### `auto-close`

Type: `Boolean`

Allows any click/tap in the menu to close it; Useful instead of attaching events to each menu item that should close the menu on click/tap

### `separate-close-popup`

Type: `Boolean`

Separate from parent menu, marking it as a separate closing point for v-close-popup (without this, chained menus close all together)

### `square`

Type: `Boolean`

Forces content to have squared borders

### `no-refocus`

Type: `Boolean`

(Accessibility) When Menu gets hidden, do not refocus on the DOM element that previously had focus

### `no-focus`

Type: `Boolean`

(Accessibility) When Menu gets shown, do not switch focus on it

### `max-height`

Type: `String | null`

Default: `null`

The maximum height of the menu; Size in CSS units, including unit name

Examples:

- `'16px'`
- `'2rem'`

### `max-width`

Type: `String | null`

Default: `null`

The maximum width of the menu; Size in CSS units, including unit name

Examples:

- `'16px'`
- `'2rem'`

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

### `escape-key`

Emitted when ESC key is pressed; Does not get emitted if Menu is 'persistent' or it has 'no-esc-dismiss' set

## Methods

### `show`

Triggers component to show

### `hide`

Triggers component to hide

### `toggle`

Triggers component to toggle between show/hide

### `updatePosition`

There are some custom scenarios for which Quasar cannot automatically reposition the menu without significant performance drawbacks so the optimal solution is for you to call this method when you need it

### `focus`

Focus menu; if you have content with autofocus attribute, it will directly focus it

## Computed properties

### `contentEl`

Type: `Element`

Added in: v2.10.1

The DOM Element of the rendered content
