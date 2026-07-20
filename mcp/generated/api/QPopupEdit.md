# QPopupEdit API

Type: component

Canonical documentation: https://quasar.dev/vue-components/popup-edit

## Props

### `model-value`

Type: `Any`

Required: yes

Model of the component; Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive

Examples:

- `# v-model="myValue"`

### `title`

Type: `String`

Optional title (unless 'title' slot is used)

Examples:

- `'Calories'`

### `buttons`

Type: `Boolean`

Show Set and Cancel buttons

### `label-set`

Type: `String`

Override Set button label

Examples:

- `'OK'`

### `label-cancel`

Type: `String`

Override Cancel button label

Examples:

- `'Cancel'`

### `auto-save`

Type: `Boolean`

Automatically save the model (if changed) when user clicks/taps outside of the popup; It does not apply to ESC key

### `color`

Type: `String`

Default: `'primary'`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `validate`

Type: `Function`

Default: `() => true`

Validates model then triggers 'save' and closes Popup; Returns a Boolean ('true' means valid, 'false' means abort); Syntax: validate(value); For best performance, reference it from your scope and do not define it inline

Examples:

- `value => value !== 0`

### `disable`

Type: `Boolean`

Put component in disabled mode

### `fit`

Type: `Boolean`

Allows the menu to match at least the full width of its target

### `cover`

Type: `Boolean`

Default: `true`

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

### `touch-position`

Type: `Boolean`

Allows for the target position to be set by the mouse position, when the target of the menu is either clicked or touched

### `persistent`

Type: `Boolean`

Avoid menu closing by hitting ESC key or by clicking/tapping outside of the Popup

### `separate-close-popup`

Type: `Boolean`

Separate from parent menu, marking it as a separate closing point for v-close-popup (without this, chained menus close all together)

### `square`

Type: `Boolean`

Forces menu to have squared borders

### `max-height`

Type: `String`

The maximum height of the menu; Size in CSS units, including unit name

Examples:

- `'16px'`
- `'2rem'`

### `max-width`

Type: `String`

The maximum width of the menu; Size in CSS units, including unit name

Examples:

- `'16px'`
- `'2rem'`

## Slots

### `default`

Used for injecting the form component; Do NOT destructure it

## Events

### `update:model-value`

Emitted when Popup gets cancelled in order to reset model to its initial value; Is also used by v-model

### `before-show`

Emitted right before Popup gets shown

### `show`

Emitted right after Popup gets shown

### `before-hide`

Emitted right before Popup gets dismissed

### `hide`

Emitted right after Popup gets dismissed

### `save`

Emitted when value has been successfully validated and it should be saved

### `cancel`

Emitted when user cancelled the change (hit ESC key or clicking outside of Popup or hit 'Cancel' button)

## Methods

### `set`

Trigger a model update; Validates model (and emits 'save' event if it's the case) then closes Popup

### `cancel`

Triggers a model reset to its initial value ('cancel' event is emitted) then closes Popup

### `show`

Triggers component to show

### `hide`

Triggers component to hide

### `updatePosition`

There are some custom scenarios for which Quasar cannot automatically reposition the component without significant performance drawbacks so the optimal solution is for you to call this method when you need it
