# QTimeline API

Type: component

Canonical documentation: https://quasar.dev/vue-components/timeline

## Props

### `color`

Type: `String`

Default: `'primary'`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `side`

Type: `String`

Default: `'right'`

Side to place the timeline entries in dense and comfortable layout; For loose layout it gets overridden by QTimelineEntry side prop

Accepted values: `'left'`, `'right'`

### `layout`

Type: `String`

Default: `'dense'`

Layout of the timeline. Dense keeps content and labels on one side. Comfortable keeps content on one side and labels on the opposite side. Loose puts content on both sides.

Accepted values: `'dense'`, `'comfortable'`, `'loose'`

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

## Slots

### `default`

Used for content of component
