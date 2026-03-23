import Platform from '../../plugins/platform/Platform.js'

import { noop } from '../event/event.js'
import { isNumber } from '../is/is.js'

function parseFeatures(winFeatures) {
  const cfg = Object.assign({ noopener: true }, winFeatures)
  const feat = []
  for (const key in cfg) {
    const value = cfg[key]
    if (value === true) {
      feat.push(key)
    } else if (isNumber(value) || (typeof value === 'string' && value !== '')) {
      feat.push(key + '=' + value)
    }
  }
  return feat.join(',')
}

function openWindow(url, reject, windowFeatures) {
  let open = window.open

  if (Platform.is.cordova === true) {
    if (cordova?.InAppBrowser?.open !== void 0) {
      open = cordova.InAppBrowser.open
    } else if (navigator?.app !== void 0) {
      return navigator.app.loadUrl(url, {
        openExternal: true
      })
    }
  }

  // When "noopener" is set (default), window.open() intentionally returns null
  // even when the window was successfully opened. Per the HTML spec, "noreferrer"
  // also implies "noopener". Only reject if neither is in effect, so that the
  // null return can be treated as a blocked popup.
  // Note: parseFeatures() normalizes values to booleans, so strict === true is safe.
  const cfg = Object.assign({ noopener: true }, windowFeatures)
  const hasNoopener = cfg.noopener === true || cfg.noreferrer === true

  const win = open(url, '_blank', parseFeatures(windowFeatures))

  if (win) {
    if (Platform.is.desktop) win.focus()
    return win
  } else if (hasNoopener === false) {
    reject?.()
  }
}

export default (url, reject, windowFeatures) => {
  if (Platform.is.ios === true && window.SafariViewController !== void 0) {
    window.SafariViewController.isAvailable(available => {
      if (available) {
        window.SafariViewController.show({ url }, noop, reject)
      } else {
        openWindow(url, reject, windowFeatures)
      }
    })

    return
  }

  return openWindow(url, reject, windowFeatures)
}
