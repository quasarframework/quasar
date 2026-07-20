# QCarousel API

Type: component

Canonical documentation: https://quasar.dev/vue-components/carousel

## Props

### `fullscreen`

Type: `Boolean`

Fullscreen mode

Examples:

- `# v-model:fullscreen="isFullscreen"`

### `no-route-fullscreen-exit`

Type: `Boolean`

Changing route app won't exit fullscreen

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

Default transitions and swipe actions will be on the vertical axis

### `transition-prev`

Type: `String`

Default: `'fade'`

One of Quasar's embedded transitions (has effect only if 'animated' prop is set)

Examples:

- `'fade'`
- `'slide-down'`

### `transition-next`

Type: `String`

Default: `'fade'`

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

### `height`

Type: `String`

Height of Carousel in CSS units, including unit name

Examples:

- `'16px'`
- `'2rem'`

### `padding`

Type: `Boolean`

Applies a default padding to each slide, according to the usage of 'arrows' and 'navigation' props

### `control-color`

Type: `String`

Color name for QCarousel button controls (arrows, navigation) from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `control-text-color`

Type: `String`

Color name for text color of QCarousel button controls (arrows, navigation) from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `control-type`

Type: `String`

Default: `'flat'`

Type of button to use for controls (arrows, navigation)

Accepted values: `'regular'`, `'flat'`, `'outline'`, `'push'`, `'unelevated'`

### `autoplay`

Type: `Number | Boolean`

Jump to next slide (if 'true' or val > 0) or previous slide (if val < 0) at fixed time intervals (in milliseconds); 'false' disables autoplay, 'true' enables it for 5000ms intervals

Examples:

- `true`
- `false`
- `2500`

### `arrows`

Type: `Boolean`

Show navigation arrow buttons

### `prev-icon`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `next-icon`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `navigation`

Type: `Boolean`

Show navigation dots

### `navigation-position`

Type: `String`

Default: `# 'bottom'/'right'`

Side to stick navigation to

Accepted values: `'top'`, `'right'`, `'bottom'`, `'left'`

### `navigation-icon`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `navigation-active-icon`

Type: `String`

Icon name following Quasar convention for the active (current slide) navigation icon; Make sure you have the icon library installed unless you are using 'img:' prefix

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `thumbnails`

Type: `Boolean`

Show thumbnails

## Slots

### `default`

Suggestion: QCarouselSlide

### `control`

Slot specific for QCarouselControl

### `navigation-icon`

Slot for navigation icon/btn; Suggestion: QBtn

## Events

### `fullscreen`

Emitted when fullscreen state changes

### `update:fullscreen`

Used by Vue on 'v-model:fullscreen' prop for updating its value

### `update:model-value`

Emitted when the component changes the model; This event _isn't_ fired if the model is changed externally; Is also used by v-model

### `before-transition`

Emitted before transitioning to a new panel

### `transition`

Emitted after component transitioned to a new panel

## Methods

### `toggleFullscreen`

Toggle the view to be fullscreen or not fullscreen

### `setFullscreen`

Enter the fullscreen view

### `exitFullscreen`

Leave the fullscreen view

### `next`

Go to next panel

### `previous`

Go to previous panel

### `goTo`

Go to specific panel
