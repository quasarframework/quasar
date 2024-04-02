import installQuasar from './install-quasar.js'
import lang from './plugins/private.lang/Lang.js'
import IconSet from './plugins/icon-set/IconSet.js'

export default {
  version: __QUASAR_VERSION__,

  install: installQuasar,

  lang,

  // TODO: remove in Qv3 (should only be used through the plugin)
  iconSet: IconSet
}
