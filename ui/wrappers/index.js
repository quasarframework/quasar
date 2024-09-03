// Functions in this file are no-op,
//  they just take a callback function and return it
// They're used to apply typings to the callback
//  parameters and return value when using Quasar with TypeScript
// We need these in `ui` folder to make `quasar/wrapper` import work,
//  but they are useful only for Quasar CLI projects
// They are typed via module augmentation by `@quasar/app-webpack` / `@quasar/app-vite`

export function boot (callback) {
  return callback
}

export function configure (callback) {
  return callback
}

export function preFetch (callback) {
  return callback
}

export function route (callback) {
  return callback
}

export function store (callback) {
  return callback
}

export function ssrMiddleware (callback) {
  return callback
}

export function bexBackground (callback) {
  return callback
}

export function bexContent (callback) {
  return callback
}

export function bexDom (callback) {
  return callback
}

/**
 * Below only for @quasar/app-webpack v3
 */

export function ssrProductionExport (callback) {
  return callback
}

/**
 * Below only for @quasar/app-vite & @quasar/app-webpack v4+
 */

export function ssrCreate (callback) {
  return callback
}

export function ssrListen (callback) {
  return callback
}

export function ssrClose (callback) {
  return callback
}

export function ssrServeStaticContent (callback) {
  return callback
}

export function ssrRenderPreloadTag (callback) {
  return callback
}
