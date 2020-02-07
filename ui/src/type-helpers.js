// Functions in this file are no-op,
//  they just take a callback function and return it
// They're used to apply typings to the callback
//  parameters and return value when using Quasar with TypeScript

function boot (callback) {
  return callback
}

function configure (callback) {
  return callback
}

export { boot, configure }
