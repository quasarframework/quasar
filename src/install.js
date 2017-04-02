import Platform from './features/platform'
import events, { install as eventsInstall } from './features/events'
import { install as toastInstall } from './components/toast/index.js'
import { current as theme } from './features/theme'
import { version } from '../package.json'

export var Vue

export default function (_Vue, opts = {}) {
  if (this.installed) {
    return
  }
  this.installed = true

  if (opts.directives) {
    if (Array.isArray(opts.directives)) {
      opts.directives.forEach(d => {
        console.log(d.name)
        _Vue.directive(d.name, d)
      })
    }
    else {
      Object.keys(opts.directives).forEach(key => {
        let d = opts.directives[key]
        console.log(d.name)
        _Vue.directive(d.name, d)
      })
    }
  }
  if (opts.components) {
    if (Array.isArray(opts.components)) {
      opts.components.forEach(c => {
        _Vue.component(c.name, c)
      })
    }
    else {
      Object.keys(opts.components).forEach(key => {
        let c = opts.components[key]
        _Vue.component(c.name, c)
      })
    }
  }

  eventsInstall(_Vue)
  toastInstall(_Vue)

  _Vue.prototype.$q = {
    version,
    platform: Platform,
    theme,
    events
  }
}
