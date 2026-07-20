# QPullToRefresh API

Type: component

Canonical documentation: https://quasar.dev/vue-components/pull-to-refresh

## Props

### `color`

Type: `String`

Color name for the icon from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `bg-color`

Type: `String`

Color name for background of the icon container from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `icon`

Type: `String`

Icon to display when refreshing the content

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `no-mouse`

Type: `Boolean`

Don't listen for mouse events

### `disable`

Type: `Boolean`

Put component in disabled mode

### `scroll-target`

Type: `Element | String`

CSS selector or DOM element to be used as a custom scroll container instead of the auto detected one

Examples:

- `.scroll-target-class`
- `#scroll-target-id`
- `$refs.scrollTarget`
- `document.body`

## Slots

### `default`

Content (area controlled by the component) goes here

## Events

### `refresh`

Called whenever a refresh is triggered; at this time, your function should load more data

## Methods

### `trigger`

Triggers a refresh

### `updateScrollTarget`

Updates the scroll target; Useful when the parent elements change so that the scrolling target also changes
