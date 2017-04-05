import Platform from './features/platform'
import { install as eventsInstall } from './features/events'
import { current as theme } from './features/theme'
import { version } from '../package.json'
import { setVue, setDeps } from './deps'

export default function (_Vue, opts = {}) {
  if (this.installed) {
    return
  }
  this.installed = true

  setVue(_Vue)
  if (opts.deps && opts.deps.moment) {
    setDeps(opts.deps)
  }

  if (opts.directives) {
    Object.keys(opts.directives).forEach(key => {
      let d = opts.directives[key]
      if (d.name !== undefined && !d.name.startsWith('q-')) {
        _Vue.directive(d.name, d)
      }
    })
  }
  if (opts.components) {
    Object.keys(opts.components).forEach(key => {
      let c = opts.components[key]
      if (c.name !== undefined && c.name.startsWith('q-')) {
        _Vue.component(c.name, c)
      }
    })
  }

  eventsInstall(_Vue)

  _Vue.prototype.$q = {
    version,
    platform: Platform,
    theme
  }
}
