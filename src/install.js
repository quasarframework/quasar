import Platform from './plugins/platform'
import { version } from '../package.json'
import { setVue } from './deps'
import { ready } from './utils/dom'
import './polyfills'

function addBodyClasses () {
  const cls = [
    __THEME__,
    Platform.is.desktop ? 'desktop' : 'mobile',
    Platform.has.touch ? 'touch' : 'no-touch',
    `platform-${Platform.is.ios ? 'ios' : 'mat'}`
  ]

  Platform.within.iframe && cls.push('within-iframe')
  Platform.is.cordova && cls.push('cordova')
  Platform.is.electron && cls.push('electron')

  document.body.classList.add.apply(document.body.classList, cls)
}

export default function (_Vue, opts = {}) {
  if (this.installed) {
    return
  }
  this.installed = true

  setVue(_Vue)
  ready(addBodyClasses)

  const Quasar = {
    version,
    theme: __THEME__
  }

  if (opts.directives) {
    Object.keys(opts.directives).forEach(key => {
      const d = opts.directives[key]
      if (d.name !== undefined && !d.name.startsWith('q-')) {
        _Vue.directive(d.name, d)
      }
    })
  }
  if (opts.components) {
    Object.keys(opts.components).forEach(key => {
      const c = opts.components[key]
      if (c.name !== undefined && c.name.startsWith('q-')) {
        _Vue.component(c.name, c)
      }
    })
  }
  if (opts.plugins) {
    Object.keys(opts.plugins).forEach(key => {
      const p = opts.plugins[key]
      if (typeof p.install === 'function') {
        p.install({ Quasar, Vue: _Vue })
      }
    })
  }

  _Vue.prototype.$q = Quasar
}
