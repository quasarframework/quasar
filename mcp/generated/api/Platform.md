# Platform API

Type: plugin

Canonical documentation: https://quasar.dev/options/platform-detection

## Props

### `userAgent`

Type: `String`

Client browser User Agent

Examples:

- `'mozilla/5.0 (macintosh; intel mac os x 10_14_5) applewebkit/537.36 (khtml, like gecko) chrome/75.0.3770.100 safari/537.36'`

### `is`

Type: `Object`

Client browser details (property names depend on browser)

Examples:

- `{ chrome: true, version: '71.0.3578.98', versionNumber: 71, mac: true, desktop: true, webkit: true, name: 'chrome', platform: 'mac' }`

### `has`

Type: `Object`

Client browser detectable properties

Examples:

- `{ touch: false, webStorage: true }`

### `within`

Type: `Object`

Client browser environment

Examples:

- `{ iframe: false }`

## Methods

### `parseSSR`

For SSR usage only, and only on the global import (not on $q.platform)
