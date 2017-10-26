import install from './install'
import start from './start'
import { version } from '../package.json'

export * from './components'
export * from './directives'
export * from './features'
export { isServer, getPlatform } from './features/platform'
export * from './globals'
export * from './utils'

export default {
  version,
  install,
  start,
  theme: __THEME__
}
