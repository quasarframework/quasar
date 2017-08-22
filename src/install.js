import Platform from './features/platform'
import { installEvents } from './features/events'
import { current as theme } from './features/theme'
import { version } from '../package.json'
import { setVue } from './deps'
import { i18n } from './i18n/en'

export default function (_Vue, opts = {}) {
  if (this.installed) {
    return
  }
  this.installed = true

  setVue(_Vue)

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
  if (opts.i18n) {
    Object.keys(i18n).forEach(function (key) {
      if (opts.i18n[key] !== undefined) {
        i18n[key] = opts.i18n[key]
      }
    })
  }

  const events = installEvents(_Vue)

  _Vue.prototype.$q = {
    version,
    platform: Platform,
    theme,
    events
  }
}
