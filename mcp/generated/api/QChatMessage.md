# QChatMessage API

Type: component

Canonical documentation: https://quasar.dev/vue-components/chat

## Props

### `sent`

Type: `Boolean`

Render as a sent message (so from current user)

### `label`

Type: `String`

Renders a label header/section only

Examples:

- `'Friday, 18th'`

### `bg-color`

Type: `String`

Color name (from the Quasar Color Palette) for chat bubble background

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `text-color`

Type: `String`

Color name (from the Quasar Color Palette) for chat bubble text

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `name`

Type: `String`

Author's name

Examples:

- `'John Doe'`

### `avatar`

Type: `String`

URL to the avatar image of the author

Examples:

- `# (public folder) src="boy-avatar.png"`
- `# (assets folder) src="~@/assets/boy-avatar.png"`
- `# (relative path format) :src="require('./my_img.jpg')"`
- `# (URL) src="https://picsum.photos/500/300"`

### `text`

Type: `Array`

Array of strings that are the message body. Strings are not sanitized (see details in docs)

Examples:

- `['How are you?']`
- `['I\'m good, thank you!', 'And you?']`

### `stamp`

Type: `String`

Creation timestamp

Examples:

- `'13:55'`
- `'Yesterday at 13:51'`

### `size`

Type: `String`

1-12 out of 12 (same as col-*)

Examples:

- `'4'`
- `'6'`
- `'12'`

### `label-html`

Type: `Boolean`

Render the label as HTML; This can lead to XSS attacks so make sure that you sanitize the message first

### `name-html`

Type: `Boolean`

Render the name as HTML; This can lead to XSS attacks so make sure that you sanitize the message first

### `text-html`

Type: `Boolean`

Render the text as HTML; This can lead to XSS attacks so make sure that you sanitize the message first

### `stamp-html`

Type: `Boolean`

Render the stamp as HTML; This can lead to XSS attacks so make sure that you sanitize the message first

## Slots

### `default`

You can use this slot to define a custom message (overrides props)

### `avatar`

Slot for avatar; Suggestion: QAvatar, img

### `name`

Slot for name; Overrides the 'name' prop

### `stamp`

Slot for stamp; Overrides the 'stamp' prop

### `label`

Slot for label; Overrides the 'label' prop
