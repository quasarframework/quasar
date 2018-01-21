import { version } from '../package.json'
import { ready } from './utils/dom'
import Platform from './plugins/platform'
import History from './plugins/history'
import './polyfills'
import i18n from './i18n'
import icons from './icons'

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
  if (this.__installed) {
    return
  }
  this.__installed = true

  const $q = {
    version,
    theme: __THEME__
  }

  // required plugins
  Platform.install({ $q })
  History.install()
  i18n.install({ $q, Vue: _Vue, lang: opts.i18n })
  icons.install({ $q, Vue: _Vue, iconSet: opts.iconSet })

  // inject body classes
  ready(addBodyClasses)

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
        p.install({ $q, Vue: _Vue })
      }
    })
  }

  _Vue.prototype.$q = $q
}
