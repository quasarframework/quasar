/**
 * client entry-point used by @quasar/vite-plugin for DEV only
 * but also pointed to as entry-point in package.json
 */

import './flags.dev.js'
import installQuasar from './install-quasar.js'
import Lang from './plugins/lang/Lang.js'
import IconSet from './plugins/icon-set/IconSet.js'

export * from './components.js'
export * from './directives.js'
export * from './plugins.js'
export * from './composables.js'
export * from './utils.js'

export const Quasar = {
  version: __QUASAR_VERSION__,
  install: installQuasar,

  // TODO: remove in Qv3 (should only be used through the plugin)
  // We provide a deprecated fallback here
  lang: Lang,

  // TODO: remove in Qv3 (should only be used through the plugin)
  // We provide a deprecated fallback here
  iconSet: IconSet
}
