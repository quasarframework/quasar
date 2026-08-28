import { createReactivePlugin } from '../../utils/private.create/create.js'
import { changeGlobalNodesTarget } from '../../utils/private.config/nodes.js'

function assignFn(fn) {
  Object.assign(Plugin, {
    request: fn,
    exit: fn,
    toggle: fn
  })
}

function updateEl() {
  const newEl = (Plugin.activeEl = Plugin.isActive
    ? document.fullscreenElement
    : null)

  changeGlobalNodesTarget(
    newEl === null || newEl === document.documentElement ? document.body : newEl
  )
}

function togglePluginState() {
  Plugin.isActive = !Plugin.isActive
  updateEl()
}

const Plugin = /*#__PURE__*/ createReactivePlugin(
  {
    isActive: false,
    activeEl: null
  },
  {
    isCapable: false,

    install({ $q }) {
      $q.fullscreen = this
    }
  }
)

if (__QUASAR_SSR_SERVER__) {
  assignFn(() => Promise.resolve())
} else {
  // the Fullscreen API is still unavailable on some platforms
  // (e.g. iPhone Safari)
  Plugin.isCapable = document.documentElement.requestFullscreen !== void 0

  if (!Plugin.isCapable) {
    // it means the browser does NOT support it
    assignFn(() => Promise.reject(new Error('Not capable')))
  } else {
    Object.assign(Plugin, {
      request(target) {
        const el = target || document.documentElement
        const { activeEl } = Plugin

        if (el === activeEl) {
          return Promise.resolve()
        }

        const queue =
          activeEl !== null && el.contains(activeEl)
            ? Plugin.exit()
            : Promise.resolve()

        return queue.finally(() => el.requestFullscreen())
      },

      exit() {
        return Plugin.isActive ? document.exitFullscreen() : Promise.resolve()
      },

      toggle(target) {
        return Plugin.isActive ? Plugin.exit() : Plugin.request(target)
      }
    })

    Plugin.isActive = Boolean(document.fullscreenElement)
    if (Plugin.isActive) updateEl()

    document.addEventListener('fullscreenchange', togglePluginState)
  }
}

export default Plugin
