# QParallax API

Type: component

Canonical documentation: https://quasar.dev/vue-components/parallax

## Props

### `src`

Type: `String`

Path to image (unless a 'media' slot is used)

Examples:

- `# (public folder) src="img/something.png"`
- `# (assets folder) src="~@/assets/my-img.png"`
- `# (relative path format) :src="require('./my_img.jpg')"`
- `# (URL) src="https://some-site.net/some-img.jpg"`

### `height`

Type: `Number`

Default: `500`

Height of component (in pixels)

### `speed`

Type: `Number`

Default: `1`

Speed of parallax effect (0.0 < x < 1.0)

### `scroll-target`

Type: `Element | String`

CSS selector or DOM element to be used as a custom scroll container instead of the auto detected one

Examples:

- `.scroll-target-class`
- `#scroll-target-id`
- `$refs.scrollTarget`
- `document.body`

## Slots

### `default`

Default slot can be used for content that gets displayed on top of the component

### `media`

Slot for describing <img> or <video> tags

### `content`

Scoped slot for describing content that gets displayed on top of the component; If specified, it overrides the default slot

## Events

### `scroll`

Emitted when scrolling occurs
