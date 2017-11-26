
export default {
  isCapable: null,
  isActive: null,
  __prefixes: {},

  request (target = document.documentElement) {
    if (this.isCapable && !this.isActive) {
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

    this.isActive = (document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement) !== undefined

    ;[
      'onfullscreenchange',
      'MSFullscreenChange', 'onmozfullscreenchange', 'onwebkitfullscreenchange'
    ].forEach(evt => {
      document[evt] = () => {
        this.isActive = !this.isActive
      }
    })

    Vue.util.defineReactive({}, 'isActive', this)
    $q.fullscreen = this
  }
}
