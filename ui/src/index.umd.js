import Vue from 'vue'

import install from './install.js'
import { version } from '../package.json'

import * as components from './components.js'
import * as directives from './directives.js'
import * as plugins from './plugins.js'
import * as utils from './utils.js'
import lang from './lang.js'
import iconSet from './icon-set.js'

Vue.use({ install }, {
  components,
  directives,
  plugins,
  config: window.quasarConfig || {}
})

export default {
  version,
  lang,
  iconSet,
  components,
  directives,
  plugins,
  utils,
  ...components,
  ...directives,
  ...plugins,
  ...utils
}
