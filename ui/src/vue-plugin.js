import installQuasar from './install-quasar.js'
import lang from './plugins/private.lang/Lang.js'
import iconSet from './plugins/private.icon-set/IconSet.js'

export default {
  version: __QUASAR_VERSION__,
  install: installQuasar,
  lang,
  iconSet
}
