import Platform, { isSSR } from './platform'
import { ready } from '../utils/dom'
import { getBrand } from '../utils/colors'

let metaValue

function getProp () {
  if (Platform.is.winphone) {
    return 'msapplication-navbutton-color'
  }
  if (Platform.is.safari) {
    return 'apple-mobile-web-app-status-bar-style'
  }
  // Chrome, Firefox OS, Opera, Vivaldi
  return 'theme-color'
}

function getMetaTag (v) {
  const els = document.getElementsByTagName('META')
  for (let i in els) {
    if (els[i].name === v) {
      return els[i]
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
    document.getElementsByTagName('HEAD')[0].appendChild(metaTag)
  }
}

export default {
  __installed: false,
  install ({ $q, Vue }) {
    if (this.__installed) { return }
    this.__installed = true

    $q.addressbarColor = this
  },

  set (hexColor) {
    if (!Platform.is.mobile || Platform.is.cordova || isSSR) {
      return
    }
    if (!Platform.is.winphone && !Platform.is.safari && !Platform.is.webkit && !Platform.is.vivaldi) {
      return
    }

    ready(() => {
      setColor(hexColor || getBrand('primary'))
    })
  }
}
