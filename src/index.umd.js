import Vue from 'vue'

import install from './install'
import start from './start'
import { version } from '../package.json'

import * as components from './components'
import * as directives from './directives'
import * as features from './features'
import * as globals from './globals'
import * as utils from './utils'

Vue.use({ install }, {
  components,
  directives
})

export default {
  version,
  start,
  theme: __THEME__,

  components,
  directives,
  features,
  globals,
  utils
}
