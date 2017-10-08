import Vue from 'vue'

import install from './install'
import start from './start'
import * as theme from './features/theme'
import { version } from '../package.json'

import * as components from './components'
import * as directives from './directives'
import * as features from './features'
import * as globals from './globals'
import * as utils from './utils'

theme.set('mat')
Vue.use({install}, {
  components,
  directives
})

export default {
  version,
  start,

  components,
  directives,
  features,
  globals,
  utils
}
