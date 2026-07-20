# QBtnDropdown API

Type: component

Canonical documentation: https://quasar.dev/vue-components/button-dropdown

## Props

### `transition-show`

Type: `String`

Default: `'fade'`

One of Quasar's embedded transitions

Examples:

- `'fade'`
- `'slide-down'`

### `transition-hide`

Type: `String`

Default: `'fade'`

One of Quasar's embedded transitions

Examples:

- `'fade'`
- `'slide-down'`

### `transition-duration`

Type: `String | Number`

Default: `300`

Transition duration (in milliseconds, without unit)

### `model-value`

Type: `Boolean`

Model of the component defining shown/hidden state; Either use this property (along with a listener for 'update:model-value' event) OR use v-model directive

Examples:

- `# v-model="state"`

### `size`

Type: `String`

Size in CSS units, including unit name or standard size name (xs|sm|md|lg|xl)

Examples:

- `'16px'`
- `'2rem'`
- `'xs'`
- `'md'`

### `type`

Type: `String`

Default: `'button'`

1) Define the button native type attribute (submit, reset, button) or 2) render component with <a> tag so you can access events even if disable or 3) Use 'href' prop and specify 'type' as a media tag

Examples:

- `'a'`
- `'submit'`
- `'button'`
- `'reset'`
- `'image/png'`
- `# href="https://quasar.dev" target="_blank"`

### `to`

Type: `String | Object`

Equivalent to Vue Router <router-link> 'to' property; Superseded by 'href' prop if used

Examples:

- `'/home/dashboard'`
- `{ name: 'my-route-name' }`

### `replace`

Type: `Boolean`

Equivalent to Vue Router <router-link> 'replace' property; Superseded by 'href' prop if used

### `href`

Type: `String`

Added in: v2.4

Native <a> link href attribute; Has priority over the 'to' and 'replace' props

Examples:

- `'https://quasar.dev'`
- `# href="https://quasar.dev" target="_blank"`

### `target`

Type: `String`

Added in: v2.4

Native <a> link target attribute; Use it only with 'to' or 'href' props

Examples:

- `'_blank'`
- `'_self'`
- `'_parent'`
- `'_top'`

### `label`

Type: `String | Number`

The text that will be shown on the button

Examples:

- `'Button Label'`

### `icon`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `icon-right`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `outline`

Type: `Boolean`

Use 'outline' design

### `flat`

Type: `Boolean`

Use 'flat' design

### `unelevated`

Type: `Boolean`

Remove shadow

### `rounded`

Type: `Boolean`

Applies a more prominent border-radius for a squared shape button

### `push`

Type: `Boolean`

Use 'push' design

### `square`

Type: `Boolean`

Added in: v2.7.6

Removes border-radius so borders are squared

### `glossy`

Type: `Boolean`

Applies a glossy effect

### `fab`

Type: `Boolean`

Makes button size and shape to fit a Floating Action Button

### `fab-mini`

Type: `Boolean`

Makes button size and shape to fit a small Floating Action Button

### `padding`

Type: `String`

Apply custom padding (vertical [horizontal]); Size in CSS units, including unit name or standard size name (none|xs|sm|md|lg|xl); Also removes the min width and height when set

Examples:

- `'16px'`
- `'10px 5px'`
- `'2rem'`
- `'xs'`
- `'md lg'`
- `'2px 2px 5px 7px'`

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `text-color`

Type: `String`

Overrides text color (if needed); Color name from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `no-caps`

Type: `Boolean`

Avoid turning label text into caps (which happens by default)

### `no-wrap`

Type: `Boolean`

Avoid label text wrapping

### `dense`

Type: `Boolean`

Dense mode; occupies less space

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

### `align`

Type: `String`

Default: `'center'`

Label or content alignment

Accepted values: `'left'`, `'right'`, `'center'`, `'around'`, `'between'`, `'evenly'`

### `stack`

Type: `Boolean`

Stack icon and label vertically instead of on same line (like it is by default)

### `stretch`

Type: `Boolean`

When used on flexbox parent, button will stretch to parent's height

### `loading`

Type: `Boolean | null`

Default: `null`

Put button into loading state (displays a QSpinner -- can be overridden by using a 'loading' slot)

### `disable`

Type: `Boolean`

Put component in disabled mode

### `split`

Type: `Boolean`

Split dropdown icon into its own button

### `dropdown-icon`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `disable-main-btn`

Type: `Boolean`

Disable main button (useful along with 'split' prop)

### `disable-dropdown`

Type: `Boolean`

Disables dropdown (dropdown button if using along 'split' prop)

### `no-icon-animation`

Type: `Boolean`

Disables the rotation of the dropdown icon when state is toggled

### `content-style`

Type: `String | Array | Object`

Style definitions to be attributed to the menu

Examples:

- `'background-color: #ff0000'`
- `{ backgroundColor: '#ff0000' }`

### `content-class`

Type: `String | Array | Object`

Class definitions to be attributed to the menu

Examples:

- `'my-special-class'`
- `{ 'my-special-class': true }`

### `cover`

Type: `Boolean`

Allows the menu to cover the button. When used, the 'menu-self' prop is no longer effective

### `persistent`

Type: `Boolean`

Allows the menu to not be dismissed by a click/tap outside of the menu or by hitting the ESC key; Also, an app route change won't dismiss it

### `no-esc-dismiss`

Type: `Boolean`

Added in: v2.18

User cannot dismiss the popup by hitting ESC key; No need to set it if 'persistent' prop is also set

### `no-route-dismiss`

Type: `Boolean`

Changing route app won't dismiss the popup; No need to set it if 'persistent' prop is also set

### `auto-close`

Type: `Boolean`

Allows any click/tap in the menu to close it; Useful instead of attaching events to each menu item that should close the menu on click/tap

### `no-refocus`

Type: `Boolean`

Added in: v2.18

(Accessibility) When the dropdown gets hidden, do not refocus on the DOM element that previously had focus

### `no-focus`

Type: `Boolean`

Added in: v2.18

(Accessibility) When the dropdown gets shown, do not switch focus on it

### `menu-anchor`

Type: `String`

Default: `'bottom end'`

Two values setting the starting position or anchor point of the menu relative to its target

Accepted values: `'top left'`, `'top middle'`, `'top right'`, `'top start'`, `'top end'`, `'center left'`, `'center middle'`, `'center right'`, `'center start'`, `'center end'`, `'bottom left'`, `'bottom middle'`, `'bottom right'`, `'bottom start'`, `'bottom end'`

### `menu-self`

Type: `String`

Default: `'top end'`

Two values setting the menu's own position relative to its target

Accepted values: `'top left'`, `'top middle'`, `'top right'`, `'top start'`, `'top end'`, `'center left'`, `'center middle'`, `'center right'`, `'center start'`, `'center end'`, `'bottom left'`, `'bottom middle'`, `'bottom right'`, `'bottom start'`, `'bottom end'`

### `menu-offset`

Type: `Array`

An array of two numbers to offset the menu horizontally and vertically in pixels

Examples:

- `[8, 8]`
- `[5, 10]`

### `toggle-aria-label`

Type: `String`

Added in: v2.8.4

aria-label to be used on the dropdown toggle element

Examples:

- `'Open menu'`

## Slots

### `default`

Default slot in the devland unslotted content of the component

### `label`

Customize main button's content through this slot, unless you're using the 'icon' and 'label' props

### `loading`

Added in: v2.8

Override the default QSpinner when in 'loading' state

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

### `click`

Emitted when user clicks/taps on the main button (not the icon one, if using 'split')

## Methods

### `show`

Triggers component to show

### `hide`

Triggers component to hide

### `toggle`

Triggers component to toggle between show/hide
