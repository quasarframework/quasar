# QImg API

Type: component

Canonical documentation: https://quasar.dev/vue-components/img

## Props

### `ratio`

Type: `String | Number`

Force the component to maintain an aspect ratio

Examples:

- `1`
- `'1.7778'`
- `# :ratio="4/3"`
- `# :ratio="16/9"`
- `# (Number format) :ratio="16/9"`
- `# (String format) ratio="1"`

### `src`

Type: `String`

Path to image

Examples:

- `# (public folder) src="img/something.png"`
- `# (assets folder) src="~@/assets/my-img.gif"`
- `# (relative path format) :src="require('./my_img.jpg')"`
- `# (URL) src="https://picsum.photos/500/300"`

### `srcset`

Type: `String`

Same syntax as <img> srcset attribute

Examples:

- `'elva-fairy-320w.jpg 320w, elva-fairy-480w.jpg 480w'`

### `sizes`

Type: `String`

Same syntax as <img> sizes attribute

Examples:

- `'(max-width: 320px) 280px, (max-width: 480px) 440px, 800px'`

### `placeholder-src`

Type: `String`

While waiting for your image to load, you can use a placeholder image

Examples:

- `# (public folder) placeholder-src="img/some-placeholder.png"`
- `# (assets folder) placeholder-src="~@/assets/my-placeholder.gif"`
- `# (relative path format) :placeholder-src="require('./placeholder.jpg')"`
- `# (URL) placeholder-src="https://picsum.photos/500/300"`

### `error-src`

Type: `String`

Added in: v2.15

In case your image fails to load, you can use an error image

Examples:

- `# (public folder) error-src="img/some-placeholder.png"`
- `# (assets folder) error-src="~@/assets/my-placeholder.gif"`
- `# (relative path format) :error-src="require('./placeholder.jpg')"`
- `# (URL) error-src="https://picsum.photos/500/300"`

### `initial-ratio`

Type: `String | Number`

Default: `1.7778`

Use it when not specifying 'ratio' but still wanting an initial aspect ratio

Examples:

- `# (Number format) :initial-ratio="16/9"`
- `# (String format) initial-ratio="1"`

### `width`

Type: `String`

Forces image width; Must also include the unit (px or %)

Examples:

- `'280px'`
- `'70%'`

### `height`

Type: `String`

Forces image height; Must also include the unit (px or %)

Examples:

- `'280px'`
- `'70%'`

### `loading`

Type: `String`

Default: `'lazy'`

Lazy or immediate load; Same syntax as <img> loading attribute

Accepted values: `'lazy'`, `'eager'`

### `loading-show-delay`

Type: `Number | String`

Default: `0`

Added in: v2.14.6

Delay showing the spinner when image changes; Gives time for the browser to load the image from cache to prevent flashing the spinner unnecessarily; Value should represent milliseconds

Examples:

- `500`
- `'700'`

### `crossorigin`

Type: `String`

Same syntax as <img> crossorigin attribute

Accepted values: `'anonymous'`, `'use-credentials'`

### `decoding`

Type: `String`

Same syntax as <img> decoding attribute

Accepted values: `'sync'`, `'async'`, `'auto'`

### `referrerpolicy`

Type: `String`

Same syntax as <img> referrerpolicy attribute

Accepted values: `'no-referrer'`, `'no-referrer-when-downgrade'`, `'origin'`, `'origin-when-cross-origin'`, `'same-origin'`, `'strict-origin'`, `'strict-origin-when-cross-origin'`, `'unsafe-url'`

### `fetchpriority`

Type: `String`

Default: `'auto'`

Added in: v2.6.6

Provides a hint of the relative priority to use when fetching the image

Accepted values: `'high'`, `'low'`, `'auto'`

### `fit`

Type: `String`

Default: `'cover'`

How the image will fit into the container; Equivalent of the object-fit prop; Can be coordinated with 'position' prop

Accepted values: `'cover'`, `'fill'`, `'contain'`, `'none'`, `'scale-down'`

### `position`

Type: `String`

Default: `'50% 50%'`

The alignment of the image into the container; Equivalent of the object-position CSS prop

Examples:

- `'0 0'`
- `'20px 50px'`

### `alt`

Type: `String`

Specifies an alternate text for the image, if the image cannot be displayed

Examples:

- `'Two cats'`

### `draggable`

Type: `Boolean`

Adds the native 'draggable' attribute

### `img-class`

Type: `String`

CSS classes to be attributed to the native img element

Examples:

- `'my-special-class'`

### `img-style`

Type: `Object`

Apply CSS to the native img element

Examples:

- `{ transform: 'rotate(45deg)' }`

### `spinner-color`

Type: `String`

Color name for default Spinner (unless using a 'loading' slot)

Examples:

- `'primary'`
- `'teal'`
- `'teal-10'`

### `spinner-size`

Type: `String`

Size in CSS units, including unit name, for default Spinner (unless using a 'loading' slot)

Examples:

- `'16px'`
- `'2rem'`

### `no-spinner`

Type: `Boolean`

Do not display the default spinner while waiting for the image to be loaded; It is overriden by the 'loading' slot when one is present

### `no-native-menu`

Type: `Boolean`

Disables the native context menu for the image

### `no-transition`

Type: `Boolean`

Disable default transition when switching between old and new image

## Slots

### `default`

Default slot can be used for captions. See examples

### `loading`

While image is loading, this slot is being displayed on top of the component; Suggestions: a spinner or text

### `error`

Optional slot to be used when image could not be loaded; make sure you assign a min-height and min-width to the component through CSS

## Events

### `load`

Emitted when image has been loaded by the browser

### `error`

Emitted when browser could not load the image
