import Platform from '../plugins/Platform.js'

import { noop } from './event.js'
import { isNumber } from './is.js'

function parseFeatures (winFeatures) {
  const cfg = Object.assign({ noopener: true }, winFeatures)
  const feat = []
  for (const key in cfg) {
    const value = cfg[ key ]
    if (value === true) {
      feat.push(key)
    }
    else if (isNumber(value) || (typeof value === 'string' && value !== '')) {
      feat.push(key + '=' + value)
    }
  }
  return feat.join(',')
}

function openWindow (url, reject, windowFeatures) {
  let open = window.open

  if (Platform.is.cordova === true) {
    if (cordova !== void 0 && cordova.InAppBrowser !== void 0 && cordova.InAppBrowser.open !== void 0) {
      open = cordova.InAppBrowser.open
    }
    else if (navigator !== void 0 && navigator.app !== void 0) {
      return navigator.app.loadUrl(url, {
        openExternal: true
      })
    }
  }

  const win = open(url, '_blank', parseFeatures(windowFeatures))

  if (win) {
    Platform.is.desktop && win.focus()
    return win
  }
  else {
    reject && reject()
  }
}

export default (url, reject, windowFeatures) => {
  if (
    Platform.is.ios === true
    && window.SafariViewController !== void 0
  ) {
    window.SafariViewController.isAvailable(available => {
      if (available) {
        window.SafariViewController.show(
          { url },
          noop,
          reject
        )
      }
      else {
        openWindow(url, reject, windowFeatures)
      }
    })
    return
  }

  return openWindow(url, reject, windowFeatures)
}
