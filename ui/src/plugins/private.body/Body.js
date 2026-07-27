import setCssVar from '../../utils/css-var/set-css-var.js'
import { noop } from '../../utils/event/event.js'
import { onKeyDownComposition } from '../../utils/private.keyboard/key-composition.js'

import { client, isRuntimeSsrPreHydration } from '../platform/Platform.js'

function getMobilePlatform(is) {
  if (is.ios) return 'ios'
  if (is.android) return 'android'
}

export function getBodyClasses({ is, has, within }, cfg) {
  const cls = [
    is.desktop ? 'desktop' : 'mobile',
    `${has.touch ? '' : 'no-'}touch`
  ]

  if (is.mobile) {
    const mobile = getMobilePlatform(is)
    if (mobile !== void 0) cls.push('platform-' + mobile)
  }

  if (is.nativeMobile) {
    const type = is.nativeMobileWrapper
    const mobileCfg = cfg[type]

    cls.push(type, 'native-mobile')

    if (is.ios && (mobileCfg === void 0 || mobileCfg.iosStatusBarPadding)) {
      cls.push('q-ios-padding')
    } else if (
      is.android &&
      (mobileCfg === void 0 || mobileCfg.androidStatusBarPadding !== false)
    ) {
      cls.push('q-safe-area-padding')
    }
  } else if (is.electron) {
    cls.push('electron')
  } else if (is.bex) {
    cls.push('bex')
  }

  if (within.iframe) cls.push('within-iframe')

  return cls
}

function applyClientSsrCorrections() {
  const { is } = client
  const classes = document.body.className

  const classList = new Set(classes.replaceAll(/ {2}/g, ' ').split(' '))

  if (!is.nativeMobile && !is.electron && !is.bex) {
    if (is.desktop) {
      classList.delete('mobile')
      classList.delete('platform-ios')
      classList.delete('platform-android')
      classList.add('desktop')
    } else if (is.mobile) {
      classList.delete('desktop')
      classList.add('mobile')

      classList.delete('platform-ios')
      classList.delete('platform-android')

      const mobile = getMobilePlatform(is)
      if (mobile !== void 0) {
        classList.add(`platform-${mobile}`)
      }
    }
  }

  if (client.has.touch) {
    classList.delete('no-touch')
    classList.add('touch')
  }

  if (client.within.iframe) {
    classList.add('within-iframe')
  }

  const newCls = [...classList].join(' ')

  if (classes !== newCls) document.body.className = newCls
}

function setColors(brand) {
  for (const color in brand) {
    setCssVar(color, brand[color])
  }
}

export default {
  install(opts) {
    if (__QUASAR_SSR_SERVER__) {
      const { $q, ssrContext } = opts
      const cls = getBodyClasses($q.platform, $q.config)

      if ($q.config.screen?.bodyClass === true) {
        cls.push('screen--xs')
      }

      ssrContext._meta.bodyClasses += cls.join(' ')

      const brand = $q.config.brand
      if (brand !== void 0) {
        const vars = Object.keys(brand)
          .map(key => `--q-${key}:${brand[key]};`)
          .join('')

        ssrContext._meta.endingHeadTags += `<style>:root{${vars}}</style>`
      }

      return
    }

    if (this.__installed) return

    if (isRuntimeSsrPreHydration.value) {
      applyClientSsrCorrections()
    } else {
      const { $q } = opts

      if ($q.config.brand !== void 0) setColors($q.config.brand)

      document.body.classList.add(...getBodyClasses(client, $q.config))
    }

    if (client.is.ios) {
      // needed for iOS button active state
      document.body.addEventListener('touchstart', noop)
    }

    window.addEventListener('keydown', onKeyDownComposition, true)
  }
}
