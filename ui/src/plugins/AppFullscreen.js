import Vue from 'vue'

import { isSSR, client } from './Platform.js'

const prefixes = {}

// needed for consistency across browsers,
// including IE11 which does not return anything
function promisify (target, fn) {
  try {
    const res = target[fn]()
    return res === void 0
      ? Promise.resolve()
      : res
  }
  catch (err) {
    return Promise.reject(err)
  }
}

function checkActive (plugin) {
  plugin.activeEl = document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement ||
    null

  plugin.isActive = plugin.activeEl !== null
}

export default {
  isCapable: false,
  isActive: false,
  activeEl: null,

  request (target) {
    if (this.isCapable === true) {
      const el = target || document.documentElement

      if (el !== this.activeEl) {
        const q = client.is.ie === true && this.activeEl !== null && el.contains(this.activeEl)
          ? this.exit()
          : Promise.resolve()

        return q
          .then(() => promisify(el, prefixes.request))
          .catch(error => (
            this.activeEl !== null
              ? this.exit().then(() => promisify(el, prefixes.request))
              : Promise.reject(error)
          ))
          .then(res => {
            checkActive(this)
            return res
          })
      }
    }

    return this.__getErr()
  },

  exit () {
    return this.isCapable === true && this.isActive === true
      ? promisify(document, prefixes.exit).then(res => {
        checkActive(this)
        return this.isActive ? this.exit() : res
      })
      : this.__getErr()
  },

  toggle (target) {
    const el = target || document.documentElement

    return this.activeEl === el
      ? this.exit()
      : this.request(el)
  },

  install ({ $q }) {
    $q.fullscreen = this

    this.__getErr = () => Promise.resolve()

    if (isSSR === true) { return }

    prefixes.request = [
      'requestFullscreen',
      'msRequestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen'
    ].find(request => document.documentElement[request] !== void 0)

    this.isCapable = prefixes.request !== void 0

    if (this.isCapable === false) {
      // it means the browser does NOT support it
      this.__getErr = () => Promise.reject('Not capable')
      return
    }

    prefixes.exit = [
      'exitFullscreen',
      'msExitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen'
    ].find(exit => document[exit])

    checkActive(this)

    ;[
      'onfullscreenchange',
      'onmsfullscreenchange', 'onwebkitfullscreenchange'
    ].forEach(evt => {
      document[evt] = () => {
        checkActive(this)
      }
    })

    Vue.util.defineReactive(this, 'isActive', this.isActive)
    Vue.util.defineReactive(this, 'activeEl', this.activeEl)
  }
}
