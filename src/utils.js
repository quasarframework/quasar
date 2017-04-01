import animate from './utils/animate'
import clone from './utils/clone'
import * as colors from './utils/colors'
import { debounce, frameDebounce } from './utils/debounce'
import * as dom from './utils/dom'
import * as event from './utils/event'
import extend from './utils/extend'
import filter from './utils/filter'
import * as format from './utils/format'
import openURL from './utils/open-url'
import * as popup from './utils/popup'
import * as scroll from './utils/scroll'
import * as store from './utils/store'
import throttle from './utils/throttle'
import uid from './utils/uid'

export default {
  animate,
  clone,
  colors,
  debounce,
  frameDebounce,
  dom,
  event,
  extend,
  filter,
  format,
  noop () {},
  openURL,
  popup,
  scroll,
  store,
  throttle,
  uid
}
