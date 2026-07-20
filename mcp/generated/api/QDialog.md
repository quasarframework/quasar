# QDialog API

Type: component

Canonical documentation: https://quasar.dev/vue-components/dialog

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

### `model-value`

Type: `Boolean | null`

Default: `null`

Model of the component defining shown/hidden state; Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive

Examples:

- `# v-model="state"`

### `persistent`

Type: `Boolean`

User cannot dismiss Dialog if clicking outside of it or hitting ESC key; Also, an app route change won't dismiss it

### `no-esc-dismiss`

Type: `Boolean`

User cannot dismiss Dialog by hitting ESC key; No need to set it if 'persistent' prop is also set

### `no-backdrop-dismiss`

Type: `Boolean`

User cannot dismiss Dialog by clicking outside of it; No need to set it if 'persistent' prop is also set

### `no-route-dismiss`

Type: `Boolean`

Changing route app won't dismiss Dialog; No need to set it if 'persistent' prop is also set

### `auto-close`

Type: `Boolean`

Any click/tap inside of the dialog will close it

### `seamless`

Type: `Boolean`

Put Dialog into seamless mode; Does not use a backdrop so user is able to interact with the rest of the page too

### `backdrop-filter`

Type: `String`

Added in: v2.15

Apply a backdrop filter; The value needs to be the same as in the CSS specs for backdrop-filter; The examples are not an exhaustive list

Examples:

- `'blur(4px)'`
- `'blur(4px) saturate(150%)'`
- `'brightness(60%)'`
- `'invert(70%)'`
- `'grayscale(100%)'`
- `'contrast(40%)'`
- `'hue-rotate(120deg)'`
- `'sepia(90%)'`
- `'saturate(80%)'`
- `'none'`

### `maximized`

Type: `Boolean`

Put Dialog into maximized mode

### `full-width`

Type: `Boolean`

Dialog will try to render with same width as the window

### `full-height`

Type: `Boolean`

Dialog will try to render with same height as the window

### `position`

Type: `String`

Default: `'standard'`

Stick dialog to one of the sides (top, right, bottom or left)

Accepted values: `'standard'`, `'top'`, `'right'`, `'bottom'`, `'left'`

### `square`

Type: `Boolean`

Forces content to have squared borders

### `no-refocus`

Type: `Boolean`

(Accessibility) When Dialog gets hidden, do not refocus on the DOM element that previously had focus

### `no-focus`

Type: `Boolean`

(Accessibility) When Dialog gets shown, do not switch focus on it

### `no-shake`

Type: `Boolean`

Added in: v2.1.1

Do not shake up the Dialog to catch user's attention

### `allow-focus-outside`

Type: `Boolean`

Added in: v2.7.2

Allow elements outside of the Dialog to be focusable; By default, for accessibility reasons, QDialog does not allow outer focus

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

### `shake`

Emitted when the Dialog shakes in order to catch user's attention, unless the 'no-shake' property is set

### `escape-key`

Emitted when ESC key is pressed; Does not get emitted if Dialog is 'persistent' or it has 'no-esc-dismiss' set

## Methods

### `show`

Triggers component to show

### `hide`

Triggers component to hide

### `toggle`

Triggers component to toggle between show/hide

### `focus`

Focus dialog; if you have content with autofocus attribute, it will directly focus it

### `shake`

Shakes dialog

## Computed properties

### `contentEl`

Type: `Element`

Added in: v2.10.1

The DOM Element of the rendered content
