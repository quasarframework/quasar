import { client } from '../platform/Platform.js'
import { noop } from '../../utils/event/event.js'
import getCssVar from '../../utils/css-var/get-css-var.js'

function getMetaTag(v) {
  const els = document.getElementsByTagName('META')
  for (const i in els) {
    if (els[i].name === v) {
      return els[i]
    }
  }
}

function setColor(hexColor) {
  let metaTag = getMetaTag('theme-color')
  const newTag = metaTag === void 0

  if (newTag) {
    metaTag = document.createElement('meta')
    metaTag.setAttribute('name', 'theme-color')
  }

  metaTag.setAttribute('content', hexColor)

  if (newTag) {
    document.head.append(metaTag)
  }
}

export default {
  set:
    !__QUASAR_SSR_SERVER__ &&
    client.is.mobile &&
    (client.is.nativeMobile ||
      client.is.safari ||
      client.is.webkit ||
      client.is.vivaldi)
      ? hexColor => {
          const val = hexColor || getCssVar('primary')

          if (client.is.nativeMobile && window.StatusBar) {
            window.StatusBar.backgroundColorByHexString(val)
          } else {
            setColor(val)
          }
        }
      : noop,

  install({ $q }) {
    $q.addressbarColor = this

    if ($q.config.addressbarColor) {
      this.set($q.config.addressbarColor)
    }
  }
}
