import VuePlugin from './vue-plugin.js'

import * as components from './components.js'
import * as directives from './directives.js'
import * as plugins from './plugins.js'

export * from './components.js'
export * from './directives.js'
export * from './plugins.js'
export * from './utils.js'

export default {
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
