import { setBrand } from './utils/colors.js'
import { onKeyDownComposition } from './utils/key-composition.js'
import { isSSR, fromSSR, client } from './plugins/Platform.js'

function getMobilePlatform (is) {
  if (is.ios === true) return 'ios'
  if (is.android === true) return 'android'
}

function getBodyClasses ({ is, has, within }, cfg) {
  const cls = [
    is.desktop === true ? 'desktop' : 'mobile',
    `${has.touch === false ? 'no-' : ''}touch`
  ]

  if (is.mobile === true) {
    const mobile = getMobilePlatform(is)
    mobile !== void 0 && cls.push('platform-' + mobile)
  }

  if (is.nativeMobile === true) {
    const type = is.nativeMobileWrapper

    cls.push(type)
    cls.push('native-mobile')

    if (
      is.ios === true &&
      (cfg[type] === void 0 || cfg[type].iosStatusBarPadding !== false)
    ) {
      cls.push('q-ios-padding')
    }
  }
  else if (is.electron === true) {
    cls.push('electron')
  }
  else if (is.bex === true) {
    cls.push('bex')
  }

  within.iframe === true && cls.push('within-iframe')

  return cls
}

function clientApply (cls) {
  if (client.is.ie === true && client.is.versionNumber === 11) {
    cls.forEach(c => document.body.classList.add(c))
  }
  else {
    document.body.classList.add.apply(document.body.classList, cls)
  }
}

// SSR takeover corrections
function clientUpdate () {
  const cls = []

  if (client.has.touch === true) {
    document.body.classList.remove('no-touch')
    cls.push('touch')
  }

  client.within.iframe === true && cls.push('within-iframe')

  cls.length > 0 && clientApply(cls)
}

function setColors (brand) {
  for (let color in brand) {
    setBrand(color, brand[color])
  }
}

export default {
  install (queues, cfg) {
    if (isSSR === true) {
      queues.server.push((q, ctx) => {
        const
          cls = getBodyClasses(q.platform, cfg),
          fn = ctx.ssr.setBodyClasses

        if (cfg.screen !== void 0 && cfg.screen.bodyClass === true) {
          cls.push('screen--xs')
        }

        if (typeof fn === 'function') {
          fn(cls)
        }
        else {
          ctx.ssr.Q_BODY_CLASSES = cls.join(' ')
        }
      })
    }
    else {
      if (fromSSR === true) {
        clientUpdate()
      }
      else {
        clientApply(getBodyClasses(client, cfg))
      }

      cfg.brand !== void 0 && setColors(cfg.brand)

      if (client.is.ios === true) {
        // needed for iOS button active state
        document.body.addEventListener('touchstart', () => {})
      }

      window.addEventListener('keydown', onKeyDownComposition, true)
    }
  }
}
