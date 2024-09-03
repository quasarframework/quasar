// Functions in this file are no-op,
//  they just take a callback function and return it
// They're used to apply typings to the callback
//  parameters and return value when using Quasar with TypeScript
// We need these in `ui` folder to make `quasar/wrapper` import work,
//  but they are useful only for Quasar CLI projects
// They are typed via module augmentation by `@quasar/app-webpack` / `@quasar/app-vite`

module.exports.boot = function (callback) {
  return callback
}

module.exports.ssrMiddleware = function (callback) {
  return callback
}

module.exports.configure = function (callback) {
  return callback
}

module.exports.preFetch = function (callback) {
  return callback
}

module.exports.route = function (callback) {
  return callback
}

module.exports.store = function (callback) {
  return callback
}

module.exports.bexBackground = function (callback) {
  return callback
}

module.exports.bexContent = function (callback) {
  return callback
}

module.exports.bexDom = function (callback) {
  return callback
}

/**
 * Below only for @quasar/app-webpack v3
 */

module.exports.ssrProductionExport = function (callback) {
  return callback
}

/**
 * Below only for @quasar/app-vite & @quasar/app-webpack v4+
 */

module.exports.ssrCreate = function (callback) {
  return callback
}

module.exports.ssrListen = function (callback) {
  return callback
}

module.exports.ssrClose = function (callback) {
  return callback
}

module.exports.ssrServeStaticContent = function (callback) {
  return callback
}

module.exports.ssrRenderPreloadTag = function (callback) {
  return callback
}
