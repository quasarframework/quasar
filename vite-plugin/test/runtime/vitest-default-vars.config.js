import { createConfig } from './vitest.config.js'

/**
 * Runs the runtime suite without a custom variables file (the
 * sassVariables: true default): the framework css gets served from
 * the prebuilt dist/quasar.css through the plugin's alias, and the
 * targeted variables injection works from the precomputed parse alone.
 */
export default createConfig({ customVariables: false })
