
import normalizePath from './utils/normalize-path'
import openURL from './utils/open-url'
import debounce from './utils/debounce'
import * as dom from './utils/dom'
import extend from './utils/extend'

export default {
  timeout (fn, delay = 1) {
    return setTimeout(fn, delay)
  },
  interval (fn, delay = 1) {
    return setInterval(fn, delay)
  },
  normalizePath,
  openURL,
  capitalize (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  },
  debounce,
  extend,
  dom
}
