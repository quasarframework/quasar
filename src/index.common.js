import install from './install'
import start from './start'
import * as theme from './features/theme'
import { version } from '../package.json'

import * as Components from './components'
import * as Directives from './directives'
import * as Features from './features'
import * as Globals from './globals'
import * as Utils from './utils'

export default {
  version,
  install,
  start,
  theme,

  ...Components,
  ...Directives,
  ...Features,
  ...Globals,
  Utils
}
