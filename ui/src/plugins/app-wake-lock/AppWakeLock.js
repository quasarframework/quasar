import { isRuntimeSsrPreHydration } from '../platform/Platform.js'
import { createReactivePlugin } from '../../utils/private.create/create.js'

function assignFn(fn) {
  Object.assign(Plugin, {
    request: fn,
    release: fn,
    toggle: fn
  })
}

// the WakeLockSentinel currently held
let sentinel = null
// the in-flight navigator.wakeLock.request() call
let pending = null
// request() was called and release() was not yet; the browser drops the
// lock on its own (page hidden, battery saver), so this is what drives
// the re-acquire when the page becomes visible again
let wanted = false

function onRelease() {
  sentinel = null
  Plugin.isActive = false
}

function acquire() {
  if (pending === null) {
    pending = navigator.wakeLock.request('screen').then(
      lock => {
        pending = null

        if (!wanted) {
          // release() was called while the request was in flight
          return lock.release()
        }

        sentinel = lock
        Plugin.isActive = true
        lock.addEventListener('release', onRelease, { once: true })
      },
      err => {
        pending = null
        throw err
      }
    )
  }

  return pending
}

// the Screen Wake Lock API is secure-context only and
// arrived in Firefox 126, after the browsers Quasar supports
const isCapable = !__QUASAR_SSR_SERVER__ && navigator.wakeLock !== void 0

const Plugin = /*#__PURE__*/ createReactivePlugin(
  {
    isCapable: false,
    isActive: false
  },
  {
    install({ $q, onSSRHydrated }) {
      $q.wakeLock = this

      if (__QUASAR_SSR_SERVER__ || this.__installed || !isCapable) return

      const start = () => {
        this.isCapable = true
      }

      // the server rendered with isCapable=false, so the real value
      // must not land before the markup is hydrated
      if (isRuntimeSsrPreHydration.value) {
        onSSRHydrated.push(start)
      } else {
        start()
      }
    }
  }
)

if (!isCapable) {
  assignFn(
    __QUASAR_SSR_SERVER__
      ? () => Promise.resolve()
      : () => Promise.reject(new Error('Not capable'))
  )
} else {
  Object.assign(Plugin, {
    request() {
      wanted = true

      return sentinel !== null
        ? Promise.resolve()
        : acquire().catch(err => {
            // a later request() may have landed in between
            if (sentinel === null) {
              wanted = false
            }
            throw err
          })
    },

    release() {
      wanted = false
      return sentinel !== null ? sentinel.release() : Promise.resolve()
    },

    toggle() {
      return Plugin.isActive ? Plugin.release() : Plugin.request()
    }
  })

  document.addEventListener(
    'visibilitychange',
    () => {
      if (wanted && sentinel === null && !document.hidden) {
        // a failure here (battery saver, permissions policy) has no caller
        // to report to; the next visibility change tries again
        acquire().catch(() => {})
      }
    },
    false
  )
}

export default Plugin
