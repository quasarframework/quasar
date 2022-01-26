import defineReactivePlugin from '../utils/private/define-reactive-plugin.js'
import { injectProp } from '../utils/private/inject-obj-prop.js'

const Plugin = defineReactivePlugin({
  appVisible: true
}, {
  install ({ $q }) {
    if (__QUASAR_SSR_SERVER__) {
      this.appVisible = $q.appVisible = true
      return
    }

    injectProp($q, 'appVisible', () => this.appVisible)
  }
})

if (__QUASAR_SSR_SERVER__ !== true) {
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

  if (evt && typeof document[ prop ] !== 'undefined') {
    const update = () => { Plugin.appVisible = !document[ prop ] }
    document.addEventListener(evt, update, false)
  }
}

export default Plugin
