import { createReactivePlugin } from '../../utils/private.create/create.js'
import { injectProp } from '../../utils/private.inject-obj-prop/inject-obj-prop.js'

function registerVisibilityListener(Plugin) {
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

export default function createAppVisibility() {
  const Plugin = createReactivePlugin(
    {
      /**
       * Does the app have user focus? Or the app runs in the background / another tab has the user's attention
       *
       * @api prop appVisible
       * @type {Boolean}
       * @reactive
       * @ts-injection-point
       */
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
    registerVisibilityListener(Plugin)
  }

  return Plugin
}
