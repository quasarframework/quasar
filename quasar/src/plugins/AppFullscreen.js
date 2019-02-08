import Vue from 'vue'

import { isSSR } from './Platform.js'

const prefixes = {}

export default {
  isCapable: false,
  isActive: false,

  request (target) {
    if (this.isCapable && !this.isActive) {
      target = target || document.documentElement
      target[prefixes.request]()
    }
  },
  exit () {
    if (this.isCapable && this.isActive) {
      document[prefixes.exit]()
    }
  },
  toggle (target) {
    if (this.isActive) {
      this.exit()
    }
    else {
      this.request(target)
    }
  },

  install ({ $q }) {
    $q.fullscreen = this

    if (isSSR) { return }

    prefixes.request = [
      'requestFullscreen',
      'msRequestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen'
    ].find(request => document.documentElement[request])

    this.isCapable = prefixes.request !== undefined
    if (!this.isCapable) {
      // it means the browser does NOT support it
      return
    }

    prefixes.exit = [
      'exitFullscreen',
      'msExitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen'
    ].find(exit => document[exit])

    this.isActive = !!(document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement)

    ;[
      'onfullscreenchange', 'onmsfullscreenchange', 'onwebkitfullscreenchange'
    ].forEach(evt => {
      document[evt] = () => {
        this.isActive = !this.isActive
      }
    })

    Vue.util.defineReactive(this, 'isActive', this.isActive)
  }
}
