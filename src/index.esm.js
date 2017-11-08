import install from './install'
import { version } from '../package.json'

export * from './components'
export * from './directives'
export * from './plugins'
export * from './globals'
export * from './utils'

export default {
  version,
  install,
  theme: __THEME__
}
