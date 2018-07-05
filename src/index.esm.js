import VuePlugin from './vue-plugin.js'

import * as components from './components.js'
import * as directives from './directives.js'
import * as plugins from './plugins.js'

const Quasar = {
  ...VuePlugin,
  install (Vue, opts) {
    VuePlugin.install(Vue, {
      components,
      directives,
      plugins,
      ...opts
    })
  }
}

export default Quasar
