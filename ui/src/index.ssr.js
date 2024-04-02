/**
 * SSR server prod entry-point
 */

import installQuasar from './install-quasar.js'
import Lang from './plugins/lang/Lang.js'
import IconSet from './plugins/icon-set/IconSet.js'

import * as components from './components.js'
import * as directives from './directives.js'

export * from './components.js'
export * from './directives.js'
export * from './plugins.js'
export * from './composables.js'
export * from './utils.js'

export const Quasar = {
  version: __QUASAR_VERSION__,

  install (app, opts, ssrContext) {
    installQuasar(
      app,
      { components, directives, ...opts },
      ssrContext
    )
  },

  // TODO: remove in Qv3 (should only be used through the plugin)
  // We provide a deprecated fallback here
  lang: Lang,

  // TODO: remove in Qv3 (should only be used through the plugin)
  // We provide a deprecated fallback here
  iconSet: IconSet
}
