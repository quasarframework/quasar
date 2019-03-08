import { setBrand } from './utils/colors.js'
import { isSSR } from './plugins/Platform.js'

function getMobilePlatform (is) {
  if (is.ios === true) return 'ios'
  if (is.android === true) return 'android'
  if (is.winphone === true) return 'winphone'
}

function getBodyClasses ({ is, has, within }, cfg) {
  const cls = [
    is.desktop ? 'desktop' : 'mobile',
    has.touch ? 'touch' : 'no-touch'
  ]

  if (is.mobile === true) {
    const mobile = getMobilePlatform(is)
    if (mobile !== void 0) {
      cls.push('platform-' + mobile)
    }
  }

  if (is.cordova === true) {
    cls.push('cordova')

    if (
      is.ios === true &&
      (cfg.cordova === void 0 || cfg.cordova.iosStatusBarPadding !== false)
    ) {
      const
        ratio = window.devicePixelRatio || 1,
        width = window.screen.width * ratio,
        height = window.screen.height * ratio

      if (width === 1125 && height === 2436) { // iPhoneX fullscreen
        cls.push('q-ios-statusbar-x')
      }
      if (width !== 1125 || height !== 2001) { // not iPhoneX on non-fullscreen
        cls.push('q-ios-statusbar-padding')
      }
    }
  }

  within.iframe === true && cls.push('within-iframe')
  is.electron === true && cls.push('electron')

  return cls
}

function bodyInit (Platform, cfg) {
  const cls = getBodyClasses(Platform, cfg)

  if (Platform.is.ie === true && Platform.is.versionNumber === 11) {
    cls.forEach(c => document.body.classList.add(c))
  }
  else {
    document.body.classList.add.apply(document.body.classList, cls)
  }

  if (Platform.is.ios === true) {
    // needed for iOS button active state
    document.body.addEventListener('touchstart', () => {})
  }
}

function setColors (brand) {
  for (let color in brand) {
    setBrand(color, brand[color])
  }
}

export default {
  install ($q, queues, cfg) {
    if (isSSR) {
      queues.server.push((q, ctx) => {
        const
          cls = getBodyClasses(q.platform, cfg),
          fn = ctx.ssr.setBodyClasses

        if (typeof fn === 'function') {
          fn(cls)
        }
        else {
          ctx.ssr.Q_BODY_CLASSES = cls.join(' ')
        }
      })
      return
    }

    cfg.brand && setColors(cfg.brand)
    bodyInit($q.platform, cfg)
  }
}
