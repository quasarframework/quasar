# QTimelineEntry API

Type: component

Canonical documentation: https://quasar.dev/vue-components/timeline

## Props

### `heading`

Type: `Boolean`

Defines a heading timeline item

### `tag`

Type: `String`

Default: `'h3'`

Tag to use, if of type 'heading' only

Examples:

- `'h1'`

### `side`

Type: `String`

Default: `'right'`

Side to place the timeline entry; Works only if QTimeline layout is loose.

Accepted values: `'left'`, `'right'`

### `icon`

Type: `String`

Icon name following Quasar convention; Make sure you have the icon library installed unless you are using 'img:' prefix; If 'none' (String) is used as value then no icon is rendered (but screen real estate will still be used for it)

Examples:

- `'map'`
- `'ion-add'`
- `'img:https://cdn.quasar.dev/logo-v2/svg/logo.svg'`
- `'img:path/to/some_image.png'`

### `avatar`

Type: `String`

URL to the avatar image; Icon takes precedence if used, so it replaces avatar

Examples:

- `# (public folder) src="img/my-bg.png"`
- `# (assets folder) src="~@/assets/my-img.png"`
- `# (relative path format) :src="require('./my_img.jpg')"`
- `# (URL) src="https://picsum.photos/500/300"`

### `color`

Type: `String`

Color name for component from the Quasar Color Palette

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `title`

Type: `String`

Title of timeline entry; Is overridden if using 'title' slot

Examples:

- `'December party'`

### `subtitle`

Type: `String`

Subtitle of timeline entry; Is overridden if using 'subtitle' slot

Examples:

- `'All invited'`

### `body`

Type: `String`

Body content of timeline entry; Use this prop or the default slot

Examples:

- `'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'`

## Slots

### `default`

Timeline entry content (body)

### `title`

Optional slot for title; When used, it overrides 'title' prop

### `subtitle`

Optional slot for subtitle; When used, it overrides 'subtitle' prop
