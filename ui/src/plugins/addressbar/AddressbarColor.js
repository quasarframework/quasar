import { client } from '../platform/Platform.js'
import { noop } from '../../utils/event/event.js'
import getCssVar from '../../utils/css-var/get-css-var.js'

let metaValue

function getProp () {
  return client.is.winphone
    ? 'msapplication-navbutton-color'
    : (
        client.is.safari
          ? 'apple-mobile-web-app-status-bar-style'
          : 'theme-color' // Chrome, Firefox OS, Opera, Vivaldi, ...
      )
}

function getMetaTag (v) {
  const els = document.getElementsByTagName('META')
  for (const i in els) {
    if (els[ i ].name === v) {
      return els[ i ]
    }
  }
}

function setColor (hexColor) {
  if (metaValue === void 0) {
    // cache it
    metaValue = getProp()
  }

  let metaTag = getMetaTag(metaValue)
  const newTag = metaTag === void 0

  if (newTag) {
    metaTag = document.createElement('meta')
    metaTag.setAttribute('name', metaValue)
  }

  metaTag.setAttribute('content', hexColor)

  if (newTag) {
    document.head.appendChild(metaTag)
  }
}

export default {
  set: __QUASAR_SSR_SERVER__ !== true && client.is.mobile === true && (
    client.is.nativeMobile === true
    || client.is.winphone === true || client.is.safari === true
    || client.is.webkit === true || client.is.vivaldi === true
  )
    ? hexColor => {
      const val = hexColor || getCssVar('primary')

      if (client.is.nativeMobile === true && window.StatusBar) {
        window.StatusBar.backgroundColorByHexString(val)
      }
      else {
        setColor(val)
      }
    }
    : noop,

  install ({ $q }) {
    $q.addressbarColor = this
    $q.config.addressbarColor && this.set($q.config.addressbarColor)
  }
}
