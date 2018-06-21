import Vue from 'vue'

import install from './install'
import { version } from '../package.json'

import * as components from './components'
import * as directives from './directives'
import * as plugins from './plugins'
import * as utils from './utils'
import i18n from './i18n'
import icons from './icons'

if (Vue === void 0) {
  console.error('[ Quasar ] Vue is required to run. Please add a script tag for it before loading Quasar.')
}
else {
  Vue.use({ install }, {
    components,
    directives,
    plugins,
    config: typeof window !== 'undefined'
      ? (window.quasarConfig || {})
      : {}
  })
}

export default {
  version,
  theme: process.env.THEME,

  i18n,
  icons,
  components,
  directives,
  plugins,
  utils
}
