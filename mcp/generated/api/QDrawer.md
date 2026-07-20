# QDrawer API

Type: component

Canonical documentation: https://quasar.dev/layout/drawer

## Props

### `model-value`

Type: `Boolean | null`

Default: `null`

Model of the component defining shown/hidden state; Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive

Examples:

- `# v-model="state"`

### `side`

Type: `String`

Default: `'left'`

Side to attach to

Accepted values: `'left'`, `'right'`

### `overlay`

Type: `Boolean`

Puts drawer into overlay mode (does not occupy space on screen, narrowing the page)

### `width`

Type: `Number`

Default: `300`

Width of drawer (in pixels)

### `mini`

Type: `Boolean`

Puts drawer into mini mode

### `mini-width`

Type: `Number`

Default: `57`

Width of drawer (in pixels) when in mini mode

### `mini-to-overlay`

Type: `Boolean`

Mini mode will expand as an overlay

### `no-mini-animation`

Type: `Boolean`

Added in: v2.12

Disables animation of the drawer when toggling mini mode

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `breakpoint`

Type: `Number`

Default: `1023`

Breakpoint (in pixels) of layout width up to which mobile mode is used

Examples:

- `1200`

### `behavior`

Type: `String`

Default: `'default'`

Overrides the default dynamic mode into which the drawer is put on

Accepted values: `'default'`, `'desktop'`, `'mobile'`

### `bordered`

Type: `Boolean`

Applies a default border to the component

### `elevated`

Type: `Boolean`

Adds a default shadow to the header

### `persistent`

Type: `Boolean`

Prevents drawer from auto-closing when app's route changes; Also, an app route change won't hide it

### `show-if-above`

Type: `Boolean`

Forces drawer to be shown on screen on initial render if the layout width is above breakpoint, regardless of v-model; This is the default behavior when SSR is taken over by client on initial render

### `no-swipe-open`

Type: `Boolean`

Disables the default behavior where drawer can be swiped into view; Useful for iOS platforms where it might interfere with Safari's 'swipe to go to previous/next page' feature

### `no-swipe-close`

Type: `Boolean`

Disables the default behavior where drawer can be swiped out of view (applies to drawer content only); Useful for iOS platforms where it might interfere with Safari's 'swipe to go to previous/next page' feature

### `no-swipe-backdrop`

Type: `Boolean`

Disables the default behavior where drawer backdrop can be swiped

## Slots

### `default`

Default slot in the devland unslotted content of the component (overridden by 'mini' slot if used and drawer is in mini mode)

### `mini`

Content to show when in mini mode (overrides 'default' slot)

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

### `on-layout`

Emitted when drawer toggles between occupying space on page or not

### `click`

Emitted when user clicks/taps on the component; Useful for when taking a decision to toggle mini mode

### `mouseover`

Emitted when user moves mouse cursor over the component; Useful for when taking a decision to toggle mini mode

### `mouseout`

Emitted when user moves mouse cursor out of the component; Useful for when taking a decision to toggle mini mode

### `mini-state`

Emitted when drawer changes the mini-mode state (sometimes it is forced to do so)

## Methods

### `show`

Triggers component to show

### `hide`

Triggers component to hide

### `toggle`

Triggers component to toggle between show/hide
