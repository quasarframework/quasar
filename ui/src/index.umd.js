import installQuasar from './install.js'
import { version } from '../package.json'

import * as components from './components.js'
import * as directives from './directives.js'
import * as plugins from './plugins.js'
import * as utils from './utils.js'
import lang from './lang.js'
import iconSet from './icon-set.js'

export default {
  version,
  lang,
  install (app, opts) {
    installQuasar.call(this, app, {
      components,
      directives,
      plugins,
      ...opts
    })
  },
  iconSet,
  ...components,
  ...directives,
  ...plugins,
  ...utils
}
