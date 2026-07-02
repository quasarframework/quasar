import { createReactivePlugin } from '../../utils/private.create/create.js'
import { changeGlobalNodesTarget } from '../../utils/private.config/nodes.js'

const prefixes = {}

function assignFn(Plugin, fn) {
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

function updateEl(Plugin) {
  const newEl = (Plugin.activeEl = Plugin.isActive
    ? getFullscreenElement()
    : null)

  changeGlobalNodesTarget(
    newEl === null || newEl === document.documentElement ? document.body : newEl
  )
}

function togglePluginState(Plugin) {
  Plugin.isActive = !Plugin.isActive
  updateEl(Plugin)
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

export default function createAppFullscreen() {
  const Plugin = createReactivePlugin(
    {
      /**
       * Is Fullscreen active?
       *
       * @api prop isActive
       * @type {Boolean}
       * @reactive
       */
      isActive: false,

      /**
       * The DOM element used as root for fullscreen, otherwise 'null'
       *
       * @api prop activeEl
       * @type {Element|null}
       * @reactive
       * @example document.fullscreenElement
       * @example null
       */
      activeEl: null
    },
    {
      /**
       * Does browser support it?
       *
       * @api prop isCapable
       * @type {Boolean}
       */
      isCapable: false,

      install({ $q }) {
        $q.fullscreen = this
      }
    }
  )

  if (__QUASAR_SSR_SERVER__) {
    assignFn(Plugin, () => Promise.resolve())
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
      assignFn(Plugin, () => Promise.reject(new Error('Not capable')))
    } else {
      Object.assign(Plugin, {
        /**
         * Request going into Fullscreen (with optional target)
         *
         * @api method request
         * @param {Element} target Optional Element of target to request Fullscreen on
         * @param-example target document.getElementById('example')
         * @returns {Promise<void>} A Promise which is resolved when transitioned to fullscreen mode. It gets rejected with 'Not capable' if the browser is not capable, and with an Error object if something else went wrong.
         * @returns-example request().then(response => { ... }).catch(err => { ... })
         */
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

        /**
         * Request exiting out of Fullscreen mode
         *
         * @api method exit
         * @returns {Promise<void>} A Promise which is resolved when exited out of fullscreen mode. It gets rejected with 'Not capable' if the browser is not capable, and with an Error object if something else went wrong.
         * @returns-example exit().then(response => { ... }).catch(err => { ... })
         */
        exit() {
          return Plugin.isActive
            ? promisify(document, prefixes.exit)
            : Promise.resolve()
        },

        /**
         * Request toggling Fullscreen mode (with optional target if requesting going into Fullscreen only)
         *
         * @api method toggle
         * @param {Element} target Optional Element of target to request Fullscreen on
         * @param-example target document.getElementById('example')
         * @returns {Promise<void>} A Promise which is resolved when transitioned to / exited out of fullscreen mode. It gets rejected with 'Not capable' if the browser is not capable, and with an Error object if something else went wrong.
         * @returns-example toggle().then(response => { ... }).catch(err => { ... })
         */
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
      if (Plugin.isActive) updateEl(Plugin)

      ;[
        'onfullscreenchange',
        'onmsfullscreenchange',
        'onwebkitfullscreenchange'
      ].forEach(evt => {
        document[evt] = () => {
          togglePluginState(Plugin)
        }
      })
    }
  }

  return Plugin
}
