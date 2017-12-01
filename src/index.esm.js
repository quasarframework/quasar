import install from './install'
import { version } from '../package.json'

export * from './components'
export * from './directives'
export * from './plugins'
export * from './utils'
import i18n from './i18n'

export default {
  version,
  install,
  i18n,
  theme: __THEME__
}
