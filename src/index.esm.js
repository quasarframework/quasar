import install from './install'
import start from './start'
import * as theme from './features/theme'
import { version } from '../package.json'

export * from './components'
export * from './directives'
export * from './features'
export * from './globals'
export * from './utils'

export default {
  version,
  install,
  start,
  theme
}
