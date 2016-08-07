
import normalizePath from './utils/normalize-path'
import openURL from './utils/open-url'
import debounce from './utils/debounce'

export default {
  timeout: function (fn, delay = 1) {
    return setTimeout(fn, delay)
  },
  interval: function (fn, delay = 1) {
    return setInterval(fn, delay)
  },
  normalizePath,
  openURL,
  capitalize: function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  },
  debounce
}
