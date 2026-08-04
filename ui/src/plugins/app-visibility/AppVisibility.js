import { createReactivePlugin } from '../../utils/private.create/create.js'
import { injectProp } from '../../utils/private.inject-obj-prop/inject-obj-prop.js'

const Plugin = /*#__PURE__*/ createReactivePlugin(
  {
    appVisible: true
  },
  {
    install({ $q }) {
      if (__QUASAR_SSR_SERVER__) {
        this.appVisible = $q.appVisible = true
        return
      }

      injectProp($q, 'appVisible', () => this.appVisible)
    }
  }
)

if (!__QUASAR_SSR_SERVER__) {
  let prop, evt

  if (document.hidden !== void 0) {
    // Opera 12.10 and Firefox 18 and later support
    prop = 'hidden'
    evt = 'visibilitychange'
  } else if (document.msHidden !== void 0) {
    prop = 'msHidden'
    evt = 'msvisibilitychange'
  } else if (document.webkitHidden !== void 0) {
    prop = 'webkitHidden'
    evt = 'webkitvisibilitychange'
  }

  if (evt && document[prop] !== void 0) {
    const update = () => {
      Plugin.appVisible = !document[prop]
    }
    document.addEventListener(evt, update, false)
  }
}

export default Plugin
