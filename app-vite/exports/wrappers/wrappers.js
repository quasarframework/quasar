// Functions in this file are no-op,
//  they just take a callback function and return it
// They're used to apply typings to the callback
//  parameters and return value when using Quasar with TypeScript

const wrapper = callback => callback

export const defineConfig = wrapper

export const defineBoot = wrapper
export const definePreFetch = wrapper
export const defineRouter = wrapper
export const defineStore = wrapper

export const defineSsrMiddleware = wrapper
export const defineSsrCreate = wrapper
export const defineSsrInjectDevMiddleware = wrapper
export const defineSsrListen = wrapper
export const defineSsrClose = wrapper
export const defineSsrServeStaticContent = wrapper
export const defineSsrRenderPreloadTag = wrapper
