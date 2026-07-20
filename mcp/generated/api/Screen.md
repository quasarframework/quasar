# Screen API

Type: plugin

Canonical documentation: https://quasar.dev/options/screen-plugin

## Props

### `width`

Type: `Number`

Screen width (in pixels)

Examples:

- `452`

### `height`

Type: `Number`

Screen height (in pixels)

Examples:

- `721`

### `name`

Type: `String`

Tells current window breakpoint

Accepted values: `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'`

### `sizes`

Type: `Object`

Breakpoints (in pixels)

Examples:

- `{ sm: 600, md: 1024, lg: 1440, xl: 1920 }`

### `lt`

Type: `Object`

Tells if current screen width is lower than breakpoint-name

Examples:

- `{ sm: false, md: true, lg: true, xl: true }`

### `gt`

Type: `Object`

Tells if current screen width is greater than breakpoint-name

Examples:

- `{ xs: true, sm: true, md: false, lg: false, xl: false }`

### `xs`

Type: `Boolean`

Current screen width fits exactly 'xs' breakpoint

### `sm`

Type: `Boolean`

Current screen width fits exactly 'sm' breakpoint

### `md`

Type: `Boolean`

Current screen width fits exactly 'md' breakpoint

### `lg`

Type: `Boolean`

Current screen width fits exactly 'lg' breakpoint

### `xl`

Type: `Boolean`

Current screen width fits exactly 'xl' breakpoint

## Methods

### `setSizes`

Override default breakpoint sizes

### `setDebounce`

Debounce update of all props when screen width/height changes
