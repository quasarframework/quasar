/**
 * UMD entry-point
 */

import installQuasar from './install-quasar.js'
import lang from './lang.js'
import iconSet from './icon-set.js'

import * as components from './components.js'
import * as directives from './directives.js'
import * as plugins from './plugins.js'
import * as utils from './utils.js'
import * as composables from './composables.js'

if (window.Vue === void 0) {
  console.error('[ Quasar ] Vue is required to run. Please add a script tag for it before loading Quasar.')
}

window.Quasar = {
  version: __QUASAR_VERSION__,
  install (app, opts) {
    installQuasar(app, {
      components,
      directives,
      plugins,
      ...opts
    })
  },
  lang,
  iconSet,
  ...components,
  ...directives,
  ...plugins,
  ...composables,
  ...utils
}
