import install from './install.js'
import { version } from '../package.json'
import i18n from './i18n.js'
import icons from './icons.js'
import ssrUpdate from './ssr-update.js'

const theme = process.env.THEME

export default {
  version,
  install,
  i18n,
  icons,
  theme,
  ssrUpdate
}
