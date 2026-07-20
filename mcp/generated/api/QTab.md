# QTab API

Type: component

Canonical documentation: https://quasar.dev/vue-components/tabs

## Props

### `icon`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `label`

Type: `Number | String`

A number or string to label the tab

Examples:

- `'Home'`

### `alert`

Type: `Boolean | String`

Adds an alert symbol to the tab, notifying the user there are some updates; If its value is not a Boolean, then you can specify a color

Examples:

- `'purple'`

### `alert-icon`

Type: `String`

Adds a floating icon to the tab, notifying the user there are some updates; It's displayed only if 'alert' is set; Can use the color specified by 'alert' prop

Examples:

- `'alarm_on'`

### `name`

Type: `Number | String`

Default: `# a random UUID`

Panel name

Examples:

- `'home'`
- `1`

### `no-caps`

Type: `Boolean`

Turns off capitalizing all letters within the tab (which is the default)

### `content-class`

Type: `String`

Class definitions to be attributed to the content wrapper

Examples:

- `'my-special-class'`

### `ripple`

Type: `Boolean | Object`

Default: `true`

Configure material ripple (disable it by setting it to 'false' or supply a config object)

Examples:

- `false`
- `{ early: true, center: true, color: 'teal', keyCodes: [] }`

### `tabindex`

Type: `Number | String`

Tabindex HTML attribute value

Examples:

- `100`
- `'0'`

### `disable`

Type: `Boolean`

Put component in disabled mode

## Slots

### `default`

Suggestion: QMenu, QTooltip
