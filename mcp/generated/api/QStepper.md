# QStepper API

Type: component

Canonical documentation: https://quasar.dev/vue-components/stepper

## Props

### `model-value`

Type: `Any`

Required: yes

Model of the component defining the current panel's name; If a Number is used, it does not define the panel's index, but rather the panel's name which can also be an Integer; Either use this property (along with a listener for 'update:model-value' event) OR use the v-model directive.

Examples:

- `# v-model="panelName"`

### `keep-alive`

Type: `Boolean`

Equivalent to using Vue's native <keep-alive> component on the content

### `keep-alive-include`

Type: `String | Array | RegExp`

Equivalent to using Vue's native include prop for <keep-alive>; Values must be valid Vue component names

Examples:

- `'a,b'`
- `/a|b/`
- `['a', 'b']`

### `keep-alive-exclude`

Type: `String | Array | RegExp`

Equivalent to using Vue's native exclude prop for <keep-alive>; Values must be valid Vue component names

Examples:

- `'a,b'`
- `/a|b/`
- `['a', 'b']`

### `keep-alive-max`

Type: `Number`

Equivalent to using Vue's native max prop for <keep-alive>

### `animated`

Type: `Boolean`

Enable transitions between panel (also see 'transition-prev' and 'transition-next' props)

### `infinite`

Type: `Boolean`

Makes component appear as infinite (when reaching last panel, next one will become the first one)

### `swipeable`

Type: `Boolean`

Enable swipe events (may interfere with content's touch/mouse events)

### `vertical`

Type: `Boolean`

Put Stepper in vertical mode (instead of horizontal by default)

### `transition-prev`

Type: `String`

Default: `# slide-right/slide-down`

One of Quasar's embedded transitions (has effect only if 'animated' prop is set)

Examples:

- `'fade'`
- `'slide-down'`

### `transition-next`

Type: `String`

Default: `# slide-left/slide-up`

One of Quasar's embedded transitions (has effect only if 'animated' prop is set)

Examples:

- `'fade'`
- `'slide-down'`

### `transition-duration`

Type: `String | Number`

Default: `300`

Added in: v2.2

Transition duration (in milliseconds, without unit)

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `flat`

Type: `Boolean`

Applies a 'flat' design (no default shadow)

### `bordered`

Type: `Boolean`

Applies a default border to the component

### `alternative-labels`

Type: `Boolean`

Use alternative labels - stacks the icon on top of the label (applies only to horizontal stepper)

### `header-nav`

Type: `Boolean`

Allow navigation through the header

### `contracted`

Type: `Boolean`

Hide header labels on narrow windows

### `inactive-icon`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `inactive-color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `done-icon`

Type: `String`

Icon name following Quasar convention; If 'none' (String) is used as value, then it will defer to prefix or the regular icon for this state; Make sure you have the icon library installed unless you are using 'img:' prefix

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `done-color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `active-icon`

Type: `String`

Icon name following Quasar convention; If 'none' (String) is used as value, then it will defer to prefix or the regular icon for this state; Make sure you have the icon library installed unless you are using 'img:' prefix

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `active-color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `error-icon`

Type: `String`

Icon name following Quasar convention; If 'none' (String) is used as value, then it will defer to prefix or the regular icon for this state; Make sure you have the icon library installed unless you are using 'img:' prefix

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `error-color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `header-class`

Type: `String`

Class definitions to be attributed to the header

Examples:

- `'my-special-class'`

## Slots

### `default`

Suggestion: QStep

### `navigation`

Slot specific for the global navigation; Suggestion: QStepperNavigation

### `message`

Slot specific for putting a message on top of each step (if horizontal stepper) or above steps (if vertical); Suggestion: QBanner, div.q-pa-lg

## Events

### `update:model-value`

Emitted when the component changes the model; This event _isn't_ fired if the model is changed externally; Is also used by v-model

### `before-transition`

Emitted before transitioning to a new panel

### `transition`

Emitted after component transitioned to a new panel

## Methods

### `next`

Go to next panel

### `previous`

Go to previous panel

### `goTo`

Go to specific panel
