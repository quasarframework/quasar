
import normalizePath from './utils/normalize-path'
import openUrl from './utils/open-url'
import debounce from './utils/debounce'

export default {
  nextTick: function (fn, delay = 1) {
    setTimeout(fn, delay)
  },
  get: {
    normalized: {
      path: normalizePath
    }
  },
  open: {
    url: openUrl
  },
  capitalize: function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  },
  debounce
}
