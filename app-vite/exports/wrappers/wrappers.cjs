// Functions in this file are no-op,
//  they just take a callback function and return it
// They're used to apply typings to the callback
//  parameters and return value when using Quasar with TypeScript

const wrapper = callback => callback

module.exports.defineConfig = wrapper

module.exports.defineBoot = wrapper
module.exports.definePreFetch = wrapper
module.exports.defineRouter = wrapper
module.exports.defineStore = wrapper

module.exports.defineSsrMiddleware = wrapper
module.exports.defineSsrInjectDevMiddleware = wrapper
module.exports.defineSsrCreate = wrapper
module.exports.defineSsrListen = wrapper
module.exports.defineSsrClose = wrapper
module.exports.defineSsrServeStaticContent = wrapper
module.exports.defineSsrRenderPreloadTag = wrapper
