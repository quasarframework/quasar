import { createConfig } from './vitest.config.js'

/**
 * Runs the whole runtime suite the way a real dev server runs by
 * default (devTreeshaking disabled): the "quasar" package stays
 * aliased to its dev bundle and the AST auto-import emits a single
 * coalesced named import per template.
 */
export default createConfig({ devTreeshaking: false })
