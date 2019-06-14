import VuePlugin from './vue-plugin.js'

import * as components from './components.js'
import * as directives from './directives.js'
import * as plugins from './plugins.js'
import * as utils from './utils.js'

export default {
  // for when importing all
  ...VuePlugin,
  install (Vue, opts) {
    VuePlugin.install(Vue, {
      components,
      directives,
      plugins,
      ...opts
    })
  },

  // for when cherry-picking
  Quasar: VuePlugin,

  ...components,
  ...directives,
  ...plugins,
  ...utils
}
