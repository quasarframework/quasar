# QVideo API

Type: component

Canonical documentation: https://quasar.dev/vue-components/video

## Props

### `ratio`

Type: `String | Number`

Aspect ratio for the content; If value is a String, then avoid using a computational statement (like '16/9') and instead specify the String value of the result directly (eg. '1.7777')

Examples:

- `1`
- `'1.7778'`
- `# :ratio="4/3"`
- `# :ratio="16/9"`

### `src`

Type: `String`

Required: yes

The source url to display in an iframe

Examples:

- `'https://www.youtube.com/embed/k3_tw44QsZQ'`

### `title`

Type: `String`

Added in: v2.4.3

(Accessibility) Set the native 'title' attribute value of the inner iframe being used

Examples:

- `'My Daily Marathon'`

### `fetchpriority`

Type: `String`

Default: `'auto'`

Added in: v2.6.6

Provides a hint of the relative priority to use when fetching the iframe document

Accepted values: `'high'`, `'low'`, `'auto'`

### `loading`

Type: `String`

Default: `'eager'`

Added in: v2.6.6

Indicates how the browser should load the iframe

Accepted values: `'eager'`, `'lazy'`

### `referrerpolicy`

Type: `String`

Default: `'strict-origin-when-cross-origin'`

Added in: v2.6.6

Indicates which referrer to send when fetching the frame's resource

Accepted values: `'no-referrer'`, `'no-referrer-when-downgrade'`, `'origin'`, `'origin-when-cross-origin'`, `'same-origin'`, `'strict-origin'`, `'strict-origin-when-cross-origin'`, `'unsafe-url'`
