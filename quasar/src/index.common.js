import Vue from 'vue'

import vuePlugin from './vue-plugin.js'

import * as components from './components.js'
import * as directives from './directives.js'
import * as plugins from './plugins.js'
import * as utils from './utils.js'

export default {
  Quasar: vuePlugin,
  ...components,
  ...directives,
  ...plugins,
  ...utils
}
