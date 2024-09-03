import installQuasar from './install-quasar.js'
import Lang from './plugins/lang/Lang.js'
import IconSet from './plugins/icon-set/IconSet.js'

export default {
  name: 'Quasar',
  version: __QUASAR_VERSION__,

  install: installQuasar,

  // TODO: remove in Qv3 (should only be used through the plugin)
  // We provide a deprecated fallback here
  lang: Lang,

  // TODO: remove in Qv3 (should only be used through the plugin)
  // We provide a deprecated fallback here
  iconSet: IconSet
}
