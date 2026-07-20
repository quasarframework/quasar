# QRouteTab API

Type: component

Canonical documentation: https://quasar.dev/vue-components/tabs

## Props

### `to`

Type: `String | Object`

Equivalent to Vue Router <router-link> 'to' property; Superseded by 'href' prop if used

Examples:

- `'/home/dashboard'`
- `{ name: 'my-route-name' }`

### `exact`

Type: `Boolean`

Equivalent to Vue Router <router-link> 'exact' property; Superseded by 'href' prop if used

### `replace`

Type: `Boolean`

Equivalent to Vue Router <router-link> 'replace' property; Superseded by 'href' prop if used

### `active-class`

Type: `String`

Default: `'q-router-link--active'`

Equivalent to Vue Router <router-link> 'active-class' property; Superseded by 'href' prop if used

Examples:

- `'my-active-class'`

### `exact-active-class`

Type: `String`

Default: `'q-router-link--exact-active'`

Equivalent to Vue Router <router-link> 'active-class' property; Superseded by 'href' prop if used

Examples:

- `'my-exact-active-class'`

### `href`

Type: `String`

Added in: v2.4

Native <a> link href attribute; Has priority over the 'to'/'exact'/'replace'/'active-class'/'exact-active-class' props

Examples:

- `'https://quasar.dev'`

### `target`

Type: `String`

Added in: v2.4

Native <a> link target attribute; Use it only along with 'href' prop; Has priority over the 'to'/'exact'/'replace'/'active-class'/'exact-active-class' props

Examples:

- `'_blank'`
- `'_self'`
- `'_parent'`
- `'_top'`

### `disable`

Type: `Boolean`

Put component in disabled mode

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

## Slots

### `default`

Suggestion: QMenu, QTooltip

## Events

### `click`

Emitted when the component is clicked
