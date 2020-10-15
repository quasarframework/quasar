import installQuasar from './install-quasar.js'
import { version } from '../package.json'
import lang from './lang.js'
import iconSet from './icon-set.js'
import ssrUpdate from './ssr-update.js'

export default {
  version,
  install (app, opts) {
    installQuasar.call(this, app, opts)
  },
  lang,
  iconSet,
  ssrUpdate
}
