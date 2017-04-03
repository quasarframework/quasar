import Platform from './features/platform'
import events, { install as eventsInstall } from './features/events'
import { install as toastInstall } from './components/toast/index.js'
import { current as theme } from './features/theme'
import { version } from '../package.json'

export let Vue
export let moment

export default function (_Vue, opts = {}) {
  if (this.installed) {
    return
  }
  this.installed = true

  if (opts.deps && opts.deps.moment) {
    moment = opts.deps.moment
  }

  if (opts.directives) {
    Object.keys(opts.directives).forEach(key => {
      let d = opts.directives[key]
      _Vue.directive(d.name, d)
    })
  }
  if (opts.components) {
    Object.keys(opts.components).forEach(key => {
      let c = opts.components[key]
      _Vue.component(`q-${c.name}`, c)
    })
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
