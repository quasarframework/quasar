# QExpansionItem API

Type: component

Canonical documentation: https://quasar.dev/vue-components/expansion-item

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

### `model-value`

Type: `Boolean | null`

Default: `null`

Model of the component defining shown/hidden state; Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive

Examples:

- `# v-model="state"`

### `icon`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `expand-icon`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `expanded-icon`

Type: `String`

Expand icon name (following Quasar convention) for when QExpansionItem is expanded; When used, it also disables the rotation animation of the expand icon; Make sure you have the icon library installed unless you are using 'img:' prefix

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `expand-icon-class`

Type: `String | Array | Object`

Apply custom class(es) to the expand icon item section

Examples:

- `'text-purple'`

### `toggle-aria-label`

Type: `String`

Added in: v2.8.4

aria-label to be used on the expansion toggle element

Examples:

- `'Open details'`

### `label`

Type: `String`

Header label (unless using 'header' slot)

Examples:

- `'My expansion item'`

### `label-lines`

Type: `Number | String`

Apply ellipsis when there's not enough space to render on the specified number of lines; If more than one line specified, then it will only work on webkit browsers because it uses the '-webkit-line-clamp' CSS property!

Examples:

- `1`
- `'3'`

### `caption`

Type: `String`

Header sub-label (unless using 'header' slot)

Examples:

- `'Unread message: 5'`

### `caption-lines`

Type: `Number | String`

Apply ellipsis when there's not enough space to render on the specified number of lines; If more than one line specified, then it will only work on webkit browsers because it uses the '-webkit-line-clamp' CSS property!

Examples:

- `1`
- `'3'`

### `dark`

Type: `Boolean | null`

Default: `null`

Notify the component that the background is a dark color

### `dense`

Type: `Boolean`

Dense mode; occupies less space

### `duration`

Type: `Number`

Default: `300`

Animation duration (in milliseconds)

### `header-inset-level`

Type: `Number`

Apply an inset to header (unless using 'header' slot); Useful when header avatar/left side is missing but you want to align content with other items that do have a left side, or when you're building a menu

Examples:

- `1`

### `content-inset-level`

Type: `Number`

Apply an inset to content (changes content padding)

Examples:

- `1`

### `expand-separator`

Type: `Boolean`

Apply a top and bottom separator when expansion item is opened

### `default-opened`

Type: `Boolean`

Puts expansion item into open state on initial render; Overridden by v-model if used

### `hide-expand-icon`

Type: `Boolean`

Added in: v2.8.4

Do not show the expand icon

### `expand-icon-toggle`

Type: `Boolean`

Applies the expansion events to the expand icon only and not to the whole header

### `switch-toggle-side`

Type: `Boolean`

Switch expand icon side (from default 'right' to 'left')

### `dense-toggle`

Type: `Boolean`

Use dense mode for expand icon

### `group`

Type: `String`

Register expansion item into a group (unique name that must be applied to all expansion items in that group) for coordinated open/close state within the group a.k.a. 'accordion mode'

Examples:

- `'my-emails'`

### `popup`

Type: `Boolean`

Put expansion list into 'popup' mode

### `header-style`

Type: `String | Array | Object`

Apply custom style to the header

Examples:

- `'background: #ff0000'`
- `{ backgroundColor: '#ff0000' }`

### `header-class`

Type: `String | Array | Object`

Apply custom class(es) to the header

Examples:

- `'my-custom-class'`
- `{ 'my-custom-class': true }`

## Slots

### `default`

Slot used for expansion item's content

### `header`

Slot used for overriding default header

## Events

### `update:model-value`

Emitted when showing/hidden state changes; Is also used by v-model

### `show`

Emitted after component has triggered show()

### `before-show`

Emitted when component triggers show() but before it finishes doing it

### `hide`

Emitted after component has triggered hide()

### `before-hide`

Emitted when component triggers hide() but before it finishes doing it

### `after-show`

Emitted when component show animation is finished

### `after-hide`

Emitted when component hide animation is finished

## Methods

### `show`

Triggers component to show

### `hide`

Triggers component to hide

### `toggle`

Triggers component to toggle between show/hide
