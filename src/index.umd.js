import Vue from 'vue'

import install from './install'
import { version } from '../package.json'

import * as components from './components'
import * as directives from './directives'
import * as plugins from './plugins'
import * as utils from './utils'
import i18n from './i18n'
import icons from './icons'

Vue.use({ install }, {
  components,
  directives,
  plugins
})

export default {
  version,
  theme: __THEME__,

  i18n,
  icons,
  components,
  directives,
  utils
}
