# QBtn API

Type: component

Canonical documentation: https://quasar.dev/vue-components/button

## Props

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

### `round`

Type: `Boolean`

Makes a circle shaped button

### `percentage`

Type: `Number`

Percentage (0.0 < x < 100.0); To be used along 'loading' prop; Display a progress bar on the background

### `dark-percentage`

Type: `Boolean`

Progress bar on the background should have dark color; To be used along with 'percentage' and 'loading' props

## Slots

### `default`

Use for custom content, instead of relying on 'icon' and 'label' props

### `loading`

Override the default QSpinner when in 'loading' state

## Events

### `click`

Emitted when the component is clicked

## Methods

### `click`

Emulate click on QBtn
