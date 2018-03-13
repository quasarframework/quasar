import { isSSR } from './platform'

export default {
  isCapable: false,
  isActive: false,
  __prefixes: {},

  request (target) {
    if (this.isCapable && !this.isActive) {
      target = target || document.documentElement
      target[this.__prefixes.request]()
    }
  },
  exit () {
    if (this.isCapable && this.isActive) {
      document[this.__prefixes.exit]()
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

  __installed: false,
  install ({ $q, Vue }) {
    if (this.__installed) { return }
    this.__installed = true

    $q.fullscreen = this

    if (isSSR) {
      return
    }

    const request = [
      'requestFullscreen',
      'msRequestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen'
    ].find(request => document.documentElement[request])

    this.isCapable = request !== undefined
    if (!this.isCapable) {
      // it means the browser does NOT support it
      return
    }

    const exit = [
      'exitFullscreen',
      'msExitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen'
    ].find(exit => document[exit])

    this.__prefixes = {
      request,
      exit
    }

    this.isActive = !!(document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement)

    ;[
      'onfullscreenchange',
      'onmsfullscreenchange', 'onmozfullscreenchange', 'onwebkitfullscreenchange'
    ].forEach(evt => {
      document[evt] = () => {
        this.isActive = !this.isActive
      }
    })

    Vue.util.defineReactive(this, 'isActive', this.isActive)
  }
}
