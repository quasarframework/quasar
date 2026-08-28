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
  document.addEventListener(
    'visibilitychange',
    () => {
      Plugin.appVisible = !document.hidden
    },
    false
  )
}

export default Plugin
