import './polyfills'
import { version } from '../package.json'
import { ready } from './utils/dom'
import Platform, { isSSR } from './plugins/platform'
import History from './plugins/history'
import i18n from './i18n'
import icons from './icons'
import { setBrand } from './utils/colors'

function getBodyClasses (cfg) {
  const is = Platform.is
  const cls = [
    process.env.THEME,
    is.desktop ? 'desktop' : 'mobile',
    Platform.has.touch ? 'touch' : 'no-touch',
    `platform-${is.ios ? 'ios' : 'mat'}`
  ]

  if (is.cordova) {
    cls.push('cordova')

    if (is.ios && (cfg.cordova === void 0 || cfg.cordova.iosStatusBarPadding !== false)) {
      const
        ratio = window.devicePixelRatio || 1,
        width = window.screen.width * ratio,
        height = window.screen.height * ratio

      if (width !== 1125 && height !== 2001 /* 2436 for iPhoneX fullscreen */) {
        cls.push('q-ios-statusbar-padding')
      }
    }
  }
  Platform.within.iframe && cls.push('within-iframe')
  is.electron && cls.push('electron')

  return cls
}

function bodyInit (cfg) {
  const cls = getBodyClasses(cfg)

  if (Platform.is.ie && Platform.is.versionNumber === 11) {
    cls.forEach(c => document.body.classList.add(c))
  }
  else {
    document.body.classList.add.apply(document.body.classList, cls)
  }

  if (Platform.is.ios) {
    // needed for iOS button active state
    document.body.addEventListener('touchstart', () => {})
  }
}

function setColors (brand) {
  for (let color in brand) {
    setBrand(color, brand[color])
  }
}

export default function (_Vue, opts = {}) {
  if (this.__installed) {
    return
  }
  this.__installed = true

  const
    cfg = opts.config || {},
    $q = {
      version,
      theme: process.env.THEME
    }

  // required plugins
  Platform.install({ $q, cfg })
  History.install({ cfg })
  i18n.install({ $q, Vue: _Vue, cfg, lang: opts.i18n })
  icons.install({ $q, Vue: _Vue, iconSet: opts.iconSet })

  if (isSSR) {
    if (typeof cfg.ssr.setBodyClasses === 'function') {
      cfg.ssr.setBodyClasses(getBodyClasses(cfg))
    }
  }
  else {
    const init = cfg.brand && document.body

    init && setColors(cfg.brand)
    ready(() => {
      !init && setColors(cfg.brand)
      bodyInit(cfg)
    })
  }

  if (opts.directives) {
    Object.keys(opts.directives).forEach(key => {
      const d = opts.directives[key]
      if (d.name !== undefined && d.unbind !== void 0) {
        _Vue.directive(d.name, d)
      }
    })
  }

  if (opts.components) {
    Object.keys(opts.components).forEach(key => {
      const c = opts.components[key]
      if (c.name !== undefined && (c.render !== void 0 || c.mixins !== void 0)) {
        _Vue.component(c.name, c)
      }
    })
  }

  if (opts.plugins) {
    Object.keys(opts.plugins).forEach(key => {
      const p = opts.plugins[key]
      if (typeof p.install === 'function') {
        p.install({ $q, Vue: _Vue, cfg })
      }
    })
  }

  _Vue.prototype.$q = $q
}
