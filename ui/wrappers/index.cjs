// Functions in this file are no-op,
//  they just take a callback function and return it
// They're used to apply typings to the callback
//  parameters and return value when using Quasar with TypeScript
// We need these in `ui` folder to make `quasar/wrapper` import work,
//  but they are useful only for Quasar CLI projects
// They are typed via module augmentation by `@quasar/app-webpack` / `@quasar/app-vite`

/*******************************************************
 * Warning!
 * All these are deprecated starting with
 *    @quasar/app-vite v2
 *    @quasar/app-webpack v4
 *
 * Use the new wrappers from #q-app/wrappers
 *******************************************************/

module.exports.boot = function boot(callback) {
  return callback
}

module.exports.ssrMiddleware = function ssrMiddleware(callback) {
  return callback
}

module.exports.configure = function configure(callback) {
  return callback
}

module.exports.preFetch = function preFetch(callback) {
  return callback
}

module.exports.route = function route(callback) {
  return callback
}

module.exports.store = function store(callback) {
  return callback
}

/**
 * Below only for @quasar/app-webpack v3
 */

module.exports.ssrProductionExport = function ssrProductionExport(callback) {
  return callback
}

/**
 * Below only for @quasar/app-vite & @quasar/app-webpack v4+
 */

module.exports.ssrCreate = function ssrCreate(callback) {
  return callback
}

module.exports.ssrListen = function ssrListen(callback) {
  return callback
}

module.exports.ssrClose = function ssrClose(callback) {
  return callback
}

module.exports.ssrServeStaticContent = function ssrServeStaticContent(
  callback
) {
  return callback
}

module.exports.ssrRenderPreloadTag = function ssrRenderPreloadTag(callback) {
  return callback
}

/**
 * Below only for legacy @quasar/app-vite v1 & @quasar/app-webpack v3
 */

module.exports.bexBackground = function bexBackground(callback) {
  return callback
}

module.exports.bexContent = function bexContent(callback) {
  return callback
}

module.exports.bexDom = function bexDom(callback) {
  return callback
}
