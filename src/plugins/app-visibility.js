
export default {
  isVisible: null,

  __installed: false,
  install ({ $q, Vue }) {
    if (this.__installed) { return }
    this.__installed = true

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
      this.isVisible = $q.appVisible = !document[prop]
    }

    update()

    if (evt && typeof document[prop] !== 'undefined') {
      Vue.util.defineReactive({}, 'appVisible', $q)
      document.addEventListener(evt, update, false)
    }
  }
}
