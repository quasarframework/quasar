import install from './install'
import { version } from '../package.json'
import i18n from './i18n'
import icons from './icons'
import ssrUpdate from './ssr-update'

export * from './components'
export * from './directives'
export * from './plugins'
export * from './utils'

export default {
  version,
  install,
  i18n,
  icons,
  theme: process.env.THEME,
  ssrUpdate
}
