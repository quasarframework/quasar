# QIntersection API

Type: component

Canonical documentation: https://quasar.dev/vue-components/intersection

## Props

### `tag`

Type: `String`

Default: `'div'`

HTML tag to use

Examples:

- `'div'`
- `'span'`
- `'blockquote'`

### `once`

Type: `Boolean`

Get triggered only once

### `ssr-prerender`

Type: `Boolean`

Pre-render content on server side if using SSR (use it to pre-render above the fold content)

### `root`

Type: `Element | null`

Default: `null`

[Intersection API root prop] Lets you define an alternative to the viewport as your root (through its DOM element); It is important to keep in mind that root needs to be an ancestor of the observed element

Examples:

- `document.getElementById('myTable')`
- `$refs.myTable.$el`

### `margin`

Type: `String`

[Intersection API rootMargin prop] Allows you to specify the margins for the root, effectively allowing you to either grow or shrink the area used for intersections

Examples:

- `'-20px 0px'`
- `'10px 20px 30px 40px'`

### `threshold`

Type: `Array | Number`

[Intersection API threshold prop] Threshold(s) at which to trigger, specified as a ratio, or list of ratios, of (visible area / total area) of the observed element

Examples:

- `[0, 0.25, 0.5, 0.75, 1]`
- `1`

### `transition`

Type: `String`

One of Quasar's embedded transitions

Examples:

- `'fade'`
- `'slide-down'`

### `transition-duration`

Type: `String | Number`

Default: `300`

Added in: v2.3.1

Transition duration (in milliseconds, without unit)

### `disable`

Type: `Boolean`

Disable visibility observable (content will remain as it was, visible or hidden)

## Slots

### `default`

Default slot in the devland unslotted content of the component

### `hidden`

Added in: v2.12

Slot for content to render when component is not on screen; Example: a text that the user can search for with the browser's search function

## Events

### `visibility`

Fires when visibility changes
