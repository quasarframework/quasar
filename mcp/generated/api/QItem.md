# QItem API

Type: component

Canonical documentation: https://quasar.dev/vue-components/list-and-list-items

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

### `active`

Type: `Boolean | null`

Default: `null`

Put item into 'active' state

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `clickable`

Type: `Boolean`

Is QItem clickable? If it's the case, then it will add hover effects and emit 'click' events

### `dense`

Type: `Boolean`

Dense mode; occupies less space

### `inset-level`

Type: `Number`

Apply an inset; Useful when avatar/left side is missing but you want to align content with other items that do have a left side, or when you're building a menu

Examples:

- `1`

### `tabindex`

Type: `Number | String`

Tabindex HTML attribute value

Examples:

- `100`
- `'0'`

### `tag`

Type: `String`

Default: `'div'`

HTML tag to render; Suggestion: use 'label' when encapsulating a QCheckbox/QRadio/QToggle so that when user clicks/taps on the whole item it will trigger a model change for the mentioned components

Examples:

- `'a'`
- `'label'`
- `'div'`

### `manual-focus`

Type: `Boolean`

Put item into a manual focus state; Enables 'focused' prop which will determine if item is focused or not, rather than relying on native hover/focus states

### `focused`

Type: `Boolean`

Determines focus state, ONLY if 'manual-focus' is enabled / set to true

## Slots

### `default`

This is where QItem's content goes

## Events

### `click`

Emitted when the component is clicked
