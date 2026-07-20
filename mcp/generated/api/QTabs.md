# QTabs API

Type: component

Canonical documentation: https://quasar.dev/vue-components/tabs

## Props

### `model-value`

Type: `Number | String | null | undefined`

Model of the component defining current panel name; Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive

Examples:

- `# v-model="selectedTab"`

### `vertical`

Type: `Boolean`

Use vertical design (tabs one on top of each other rather than one next to the other horizontally)

### `outside-arrows`

Type: `Boolean`

Reserve space for arrows to place them on each side of the tabs (the arrows fade when inactive)

### `mobile-arrows`

Type: `Boolean`

Force display of arrows (if needed) on mobile

### `align`

Type: `String`

Default: `'center'`

Horizontal alignment the tabs within the tabs container

Accepted values: `'left'`, `'center'`, `'right'`, `'justify'`

### `breakpoint`

Type: `Number | String`

Default: `600`

Breakpoint (in pixels) of tabs container width at which the tabs automatically turn to a justify alignment

### `active-color`

Type: `String`

The color to be attributed to the text of the active tab

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `active-bg-color`

Type: `String`

The color to be attributed to the background of the active tab

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `indicator-color`

Type: `String`

The color to be attributed to the indicator (the underline) of the active tab

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `content-class`

Type: `String`

Class definitions to be attributed to the content wrapper

Examples:

- `'my-special-class'`

### `active-class`

Type: `String`

Added in: v2.1.4

The class to be set on the active tab

Examples:

- `'my-active-class'`

### `left-icon`

Type: `String`

The name of an icon to replace the default arrow used to scroll through the tabs to the left, when the tabs extend past the width of the tabs container

Examples:

- `'arrow_left'`

### `right-icon`

Type: `String`

The name of an icon to replace the default arrow used to scroll through the tabs to the right, when the tabs extend past the width of the tabs container

Examples:

- `'arrow_right'`

### `stretch`

Type: `Boolean`

When used on flexbox parent, tabs will stretch to parent's height

### `shrink`

Type: `Boolean`

By default, QTabs is set to grow to the available space; However, you can reverse that with this prop; Useful (and required) when placing the component in a QToolbar

### `switch-indicator`

Type: `Boolean`

Switches the indicator position (on left of tab for vertical mode or above the tab for default horizontal mode)

### `narrow-indicator`

Type: `Boolean`

Allows the indicator to be the same width as the tab's content (text or icon), instead of the whole width of the tab

### `inline-label`

Type: `Boolean`

Allows the text to be inline with the icon, should one be used

### `no-caps`

Type: `Boolean`

Turns off capitalizing all letters within the tab (which is the default)

### `dense`

Type: `Boolean`

Dense mode; occupies less space

## Slots

### `default`

Default slot in the devland unslotted content of the component

## Events

### `update:model-value`

Emitted when the component needs to change the model; Is also used by v-model
