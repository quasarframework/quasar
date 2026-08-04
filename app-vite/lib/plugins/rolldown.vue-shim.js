/**
 * There are some use-cases where user imports a Vue file
 * even if this is a UI file requested in a Node context.
 */
export function quasarRolldownVueShimPlugin() {
  return {
    name: 'quasar:vue-shim',

    load: {
      // native (Rust-side) filtering
      filter: { id: /\.vue$/ },

      handler() {
        return {
          code: '',
          map: { mappings: '' }
        }
      }
    }
  }
}
