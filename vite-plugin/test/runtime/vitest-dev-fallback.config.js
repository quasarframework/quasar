import { createConfig } from './vitest.config.js'

/**
 * Dev mode (devTreeshaking disabled) through the regex-based fallback
 * transformation: exercises the consolidated-import path of
 * vueTransform() against the aliased dev bundle.
 */
export default createConfig({ astAutoImport: false, devTreeshaking: false })
