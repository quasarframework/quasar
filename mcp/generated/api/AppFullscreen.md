# AppFullscreen API

Type: plugin

Canonical documentation: https://quasar.dev/quasar-plugins/app-fullscreen

## Props

### `isCapable`

Type: `Boolean`

Does browser support it?

### `isActive`

Type: `Boolean`

Is Fullscreen active?

### `activeEl`

Type: `Element | null`

The DOM element used as root for fullscreen, otherwise 'null'

Examples:

- `document.fullscreenElement`
- `null`

## Methods

### `request`

Request going into Fullscreen (with optional target)

### `exit`

Request exiting out of Fullscreen mode

### `toggle`

Request toggling Fullscreen mode (with optional target if requesting going into Fullscreen only)
