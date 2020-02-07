// Functions in this file are no-op,
//  they just take a callback function and return it
// They're used to apply typings to the callback
//  parameters and return value when using Quasar with TypeScript

module.exports.boot = function (callback) {
  return callback
}

module.exports.configure = function (callback) {
  return callback
}
