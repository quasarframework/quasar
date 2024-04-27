/**
 * There are some use-cases where user imports a Vue file
 * even if this is a UI file requested in a Node context.
 */
module.exports.quasarEsbuildVueShimPlugin = {
  name: 'quasar:vue-shim',
  setup (build) {
    build.onLoad({ filter: /\.vue$/ }, () => ({ contents: '' }))
  }
}
