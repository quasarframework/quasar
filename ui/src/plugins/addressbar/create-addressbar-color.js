import { client } from '../platform/Platform.js'
import { noop } from '../../utils/event/event.js'
import getCssVar from '../../utils/css-var/get-css-var.js'

let metaValue

function getProp() {
  return client.is.winphone ? 'msapplication-navbutton-color' : 'theme-color' // Safari, Chrome, ...
}

function getMetaTag(v) {
  const els = document.getElementsByTagName('META')
  for (const i in els) {
    if (els[i].name === v) {
      return els[i]
    }
  }
}

function setColor(hexColor) {
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
    document.head.append(metaTag)
  }
}

const setAddressbarColor =
  !__QUASAR_SSR_SERVER__ &&
  client.is.mobile &&
  (client.is.nativeMobile ||
    client.is.winphone ||
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
    : noop

export default function createAddressbarColor() {
  return {
    /**
     * Sets addressbar color (for browsers that support it)
     *
     * @api method set
     * @param {String} hexColor Color in hex format
     * @param-required hexColor
     * @param-example hexColor '#ff0000'
     * @returns {null}
     */
    set: setAddressbarColor,

    install({ $q }) {
      $q.addressbarColor = this

      if ($q.config.addressbarColor) {
        this.set($q.config.addressbarColor)
      }
    }
  }
}
