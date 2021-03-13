import defineReactivePlugin from '../utils/private/define-reactive-plugin.js'
import { changeGlobalNodesTarget } from '../utils/private/global-nodes.js'

const prefixes = {}

function getFullscreenElement () {
  return (
    document.fullscreenElement
    || document.mozFullScreenElement
    || document.webkitFullscreenElement
    || document.msFullscreenElement
  )
}

// needed for consistency across browsers
function promisify (target, fn) {
  try {
    const res = target[ fn ]()
    return res === void 0
      ? Promise.resolve()
      : res
  }
  catch (err) {
    return Promise.reject(err)
  }
}

const Plugin = defineReactivePlugin({
  isActive: false,
  activeEl: null
}, {
  isCapable: false,

  request (target) {
    if (Plugin.isCapable === true && Plugin.isActive === false) {
      const el = target || document.documentElement
      return promisify(el, prefixes.request)
    }

    return Plugin.__getErr()
  },

  exit () {
    return Plugin.isCapable === true && Plugin.isActive === true
      ? promisify(document, prefixes.exit)
      : Plugin.__getErr()
  },

  toggle (target) {
    return Plugin.isActive === true
      ? Plugin.exit()
      : Plugin.request(target)
  },

  install ({ $q }) {
    $q.fullscreen = this

    if (__QUASAR_SSR_SERVER__) { return }

    prefixes.request = [
      'requestFullscreen',
      'msRequestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen'
    ].find(request => document.documentElement[ request ] !== void 0)

    this.isCapable = prefixes.request !== void 0

    if (Plugin.isCapable === false) {
      // it means the browser does NOT support it
      Plugin.__getErr = () => Promise.reject('Not capable')
      return
    }

    this.__getErr = () => Promise.resolve()

    prefixes.exit = [
      'exitFullscreen',
      'msExitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen'
    ].find(exit => document[ exit ])

    this.isActive = !!getFullscreenElement()

    ;[
      'onfullscreenchange',
      'onmsfullscreenchange', 'onwebkitfullscreenchange'
    ].forEach(evt => {
      document[ evt ] = () => {
        this.isActive = this.isActive === false

        if (this.isActive === false) {
          this.activeEl = null
          changeGlobalNodesTarget(document.body)
        }
        else {
          this.activeEl = getFullscreenElement()
          changeGlobalNodesTarget(
            this.activeEl === document.documentElement
              ? document.body
              : this.activeEl
          )
        }
      }
    })
  }
})

export default Plugin
