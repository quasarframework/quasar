import Vue from 'vue'

import { isSSR } from './Platform.js'

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

export default {
  isCapable: false,
  isActive: false,
  activeEl: null,

  request (target) {
    if (this.isCapable === true && this.isActive === false) {
      const el = target || document.documentElement
      return promisify(el, prefixes.request).then(() => {
        this.activeEl = el
      })
    }

    return this.__getErr()
  },

  exit () {
    return this.isCapable === true && this.isActive === true
      ? promisify(document, prefixes.exit).then(() => {
        this.activeEl = null
      })
      : this.__getErr()
  },

  toggle (target) {
    return this.isActive === true
      ? this.exit()
      : this.request(target)
  },

  install ({ $q }) {
    $q.fullscreen = this

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

    this.__getErr = () => Promise.resolve()

    prefixes.exit = [
      'exitFullscreen',
      'msExitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen'
    ].find(exit => document[exit])

    this.isActive = !!(document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement)

    ;[
      'onfullscreenchange',
      'onmsfullscreenchange', 'onwebkitfullscreenchange'
    ].forEach(evt => {
      document[evt] = () => {
        this.isActive = this.isActive === false
      }
    })

    Vue.util.defineReactive(this, 'isActive', this.isActive)
    Vue.util.defineReactive(this, 'activeEl', this.activeEl)
  }
}
