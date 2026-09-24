import { isRuntimeSsrPreHydration } from '../platform/Platform.js'
import { createReactivePlugin } from '../../utils/private.create/create.js'

const connectionKeys = ['effectiveType', 'downlink', 'rtt', 'saveData']

const Plugin = /*#__PURE__*/ createReactivePlugin(
  {
    online: true,
    hasConnectionInfo: false,
    ...Object.fromEntries(connectionKeys.map(key => [key, void 0]))
  },
  {
    install({ $q, onSSRHydrated }) {
      $q.network = this

      if (__QUASAR_SSR_SERVER__ || this.__installed) return

      const { connection } = navigator

      const updateOnline = () => {
        this.online = navigator.onLine
      }

      const updateConnection =
        connection !== void 0
          ? () => {
              for (const key of connectionKeys) {
                this[key] = connection[key]
              }
            }
          : null

      const start = () => {
        updateOnline()
        window.addEventListener('online', updateOnline, false)
        window.addEventListener('offline', updateOnline, false)

        if (updateConnection !== null) {
          this.hasConnectionInfo = true
          updateConnection()
          connection.addEventListener('change', updateConnection, false)
        }
      }

      // the server rendered with the defaults, so the real state
      // must not land before the markup is hydrated
      if (isRuntimeSsrPreHydration.value) {
        onSSRHydrated.push(start)
      } else {
        start()
      }
    }
  }
)

export default Plugin
