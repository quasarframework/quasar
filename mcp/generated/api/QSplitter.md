# QSplitter API

Type: component

Canonical documentation: https://quasar.dev/vue-components/splitter

## Props

### `model-value`

Type: `Number`

Required: yes

Model of the component defining the size of first panel (or second if using reverse) in the unit specified (for '%' it's the split ratio percent - 0.0 < x < 100.0; for 'px' it's the size in px); Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive

Examples:

- `# v-model="ratio"`

### `reverse`

Type: `Boolean`

Apply the model size to the second panel (by default it applies to the first)

### `unit`

Type: `String`

Default: `'%'`

CSS unit for the model

Accepted values: `'%'`, `'px'`

### `emit-immediately`

Type: `Boolean`

Emit model while user is panning on the separator

### `horizontal`

Type: `Boolean`

Allows the splitter to split its two panels horizontally, instead of vertically

### `limits`

Type: `Array`

Default: `# [10, 90]/[50, Infinity]`

An array of two values representing the minimum and maximum split size of the two panels; When 'px' unit is set then you can use Infinity as the second value to make it unbound on the other side; Default value: for '%' unit it is [10, 90], while for 'px' unit it is [50, Infinity]

Examples:

- `[30, 70]`
- `[0, Infinity]`

### `disable`

Type: `Boolean`

Put component in disabled mode

### `before-class`

Type: `String | Array | Object`

Class definitions to be attributed to the 'before' panel

Examples:

- `'bg-deep-orange'`
- `{ 'my-special-class': true }`

### `after-class`

Type: `String | Array | Object`

Class definitions to be attributed to the 'after' panel

Examples:

- `'bg-deep-orange'`
- `{ 'my-special-class': true }`

### `separator-class`

Type: `String | Array | Object`

Class definitions to be attributed to the splitter separator

Examples:

- `'bg-deep-orange'`
- `{ 'my-special-class': true }`

### `separator-style`

Type: `String | Array | Object`

Style definitions to be attributed to the splitter separator

Examples:

- `'background-color: #ff0000'`
- `{ backgroundColor: '#ff0000' }`

### `dark`

Type: `Boolean | null`

Default: `null`

Applies a default lighter color on the separator; To be used when background is darker; Avoid using when you are overriding through separator-class or separator-style props

## Slots

### `default`

Default slot in the devland unslotted content of the component; Suggestion: QTooltip, QMenu

### `before`

Content of the panel on left/top

### `after`

Content of the panel on right/bottom

### `separator`

Content to be placed inside the separator; By default it is centered

## Events

### `update:model-value`

Emitted when component's model value changes; Is also used by v-model
