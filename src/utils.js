import * as animate from './utils/animate'
import clone from './utils/clone'
import * as colors from './utils/colors'
import * as date from './utils/date'
import { debounce, frameDebounce } from './utils/debounce'
import * as dom from './utils/dom'
import * as easing from './utils/easing'
import * as event from './utils/event'
import extend from './utils/extend'
import filter from './utils/filter'
import * as format from './utils/format'
import openURL from './utils/open-url'
import * as scroll from './utils/scroll'
import throttle from './utils/throttle'
import uid from './utils/uid'

function noop () {}

export {
  animate,
  clone,
  colors,
  date,
  debounce,
  frameDebounce,
  dom,
  easing,
  event,
  extend,
  filter,
  format,
  noop,
  openURL,
  scroll,
  throttle,
  uid
}
