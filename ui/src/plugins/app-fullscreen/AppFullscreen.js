import { createReactivePlugin } from '../../utils/private.create/create.js'
import { changeGlobalNodesTarget } from '../../utils/private.config/nodes.js'

const prefixes = {}

function assignFn(fn) {
  Object.assign(Plugin, {
    request: fn,
    exit: fn,
    toggle: fn
  })
}

function getFullscreenElement() {
  return (
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement ||
    null
  )
}

function updateEl() {
  const newEl = (Plugin.activeEl = Plugin.isActive
    ? getFullscreenElement()
    : null)

  changeGlobalNodesTarget(
    newEl === null || newEl === document.documentElement ? document.body : newEl
  )
}

function togglePluginState() {
  Plugin.isActive = !Plugin.isActive
  updateEl()
}

// needed for consistency across browsers
function promisify(target, fn) {
  try {
    const res = target[fn]()
    return res === void 0 ? Promise.resolve() : res
  } catch (err) {
    return Promise.reject(err)
  }
}

const Plugin = createReactivePlugin(
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
  prefixes.request = [
    'requestFullscreen',
    'msRequestFullscreen',
    'mozRequestFullScreen',
    'webkitRequestFullscreen'
  ].find(request => document.documentElement[request] !== void 0)

  Plugin.isCapable = prefixes.request !== void 0

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

        return queue.finally(() => promisify(el, prefixes.request))
      },

      exit() {
        return Plugin.isActive
          ? promisify(document, prefixes.exit)
          : Promise.resolve()
      },

      toggle(target) {
        return Plugin.isActive ? Plugin.exit() : Plugin.request(target)
      }
    })

    prefixes.exit = [
      'exitFullscreen',
      'msExitFullscreen',
      'mozCancelFullScreen',
      'webkitExitFullscreen'
    ].find(exit => document[exit])

    Plugin.isActive = Boolean(getFullscreenElement())
    if (Plugin.isActive) updateEl()

    ;[
      'onfullscreenchange',
      'onmsfullscreenchange',
      'onwebkitfullscreenchange'
    ].forEach(evt => {
      document[evt] = togglePluginState
    })
  }
}

export default Plugin
