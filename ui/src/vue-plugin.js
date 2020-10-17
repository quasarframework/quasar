import installQuasar from './install-quasar.js'
import { version } from '../package.json'
import lang from './lang.js'
import iconSet from './icon-set.js'

export default {
  version,
  install () {
    installQuasar.apply(this, arguments)
  },
  lang,
  iconSet
}
