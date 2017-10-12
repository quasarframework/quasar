import Platform, { isServer } from './features/platform'
import Events, { installEvents } from './features/events'
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

  document.body.classList.add(...cls)
}

function captureErrors () {
  if (!isServer) {
    window.onerror = function (message, source, lineno, colno, error) {
      Events.$emit('app:error', {
        message: message,
        source: source,
        lineno: lineno,
        colno: colno,
        error: error
      })
    }
  }
}

export default function (_Vue, opts = {}) {
  if (this.installed) {
    return
  }
  this.installed = true

  setVue(_Vue)
  ready(addBodyClasses)
  captureErrors()

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

  const events = installEvents(_Vue)

  _Vue.prototype.$q = {
    version,
    platform: Platform,
    theme: __THEME__,
    events
  }
}
