import defineReactivePlugin from '../utils/private/define-reactive-plugin.js'

export default defineReactivePlugin({
  appVisible: false
}, {
  install ({ $q }) {
    if (__QUASAR_SSR_SERVER__) {
      this.appVisible = $q.appVisible = true
      return
    }

    let prop, evt

    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
      prop = 'hidden'
      evt = 'visibilitychange'
    }
    else if (typeof document.msHidden !== 'undefined') {
      prop = 'msHidden'
      evt = 'msvisibilitychange'
    }
    else if (typeof document.webkitHidden !== 'undefined') {
      prop = 'webkitHidden'
      evt = 'webkitvisibilitychange'
    }

    const update = () => {
      this.appVisible = !document[ prop ]
    }

    update()

    if (evt && typeof document[ prop ] !== 'undefined') {
      Object.defineProperty($q, 'appVisible', {
        get: () => this.appVisible
      })

      document.addEventListener(evt, update, false)
    }
  }
})
