/**
 * Functions in this file are no-op,
 *  they just take a callback function and return it
 * They're used to apply typings to the callback
 *  parameters and return value when using Quasar with TypeScript
 */

const wrapper = callback => callback

/**
 * Define the function that returns your Quasar configuration object.
 */
export const defineConfig = wrapper

/**
 * Define the boot function.
 */
export const defineBoot = wrapper
/**
 * Define the preFetch function.
 */
export const definePreFetch = wrapper
/**
 * Define the function that creates the Vue Router instance.
 */
export const defineRouter = wrapper
/**
 * Define the function that creates the Pinia instance.
 */
export const defineStore = wrapper

/**
 * Define the SSR middleware function.
 */
export const defineSsrMiddleware = wrapper
/**
 * Define the SSR create function.
 */
export const defineSsrCreate = wrapper
/**
 * Define the SSR injectDevMiddleware function.
 */
export const defineSsrInjectDevMiddleware = wrapper
/**
 * Define the SSR listen function.
 */
export const defineSsrListen = wrapper
/**
 * Define the SSR close function.
 */
export const defineSsrClose = wrapper
/**
 * Define the SSR serve static content function.
 */
export const defineSsrServeStaticContent = wrapper
/**
 * Define the SSR render preload tag function.
 */
export const defineSsrRenderPreloadTag = wrapper

/**
 * Define the SSG render preload tag function.
 */
export const defineSsgRenderPreloadTag = wrapper
/**
 * Define the SSG get pages function.
 */
export const defineSsgGetPages = wrapper

/**
 * Define the function that creates the install script.
 */
export const defineInstallScript = wrapper
/**
 * Define the function that creates the uninstall script.
 */
export const defineUninstallScript = wrapper
/**
 * Define the function that creates the prompts script.
 */
export const definePromptsScript = wrapper
/**
 * Define the function that creates the index script.
 */
export const defineIndexScript = wrapper
