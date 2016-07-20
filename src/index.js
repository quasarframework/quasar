
import $ from 'jquery'

import start from './start'
import Environment from './environment'
import install from './install'
import * as Events from './events'
import key from './keycodes'
import utils from './utils'
import AppFullscreen from './app-fullscreen'
import AppVisibility from './app-visibility'
import Cookies from './cookies'
import Storage from './web-storage'
import GlobalProgress from './global-progress'
import Modal from './modal'
import notify from './notify'
import ActionSheet from './action-sheet/action-sheet'
import dialog from './dialog/dialog'

import './polyfills'
import './error-handler'

let Quasar = {
  version: '0.5.0',
  install,
  start,
  key,
  utils,
  Modal,
  notify,
  dialog
}

$.extend(true, Quasar,
  Environment,
  Events,
  AppFullscreen,
  AppVisibility,
  Cookies,
  Storage,
  GlobalProgress,
  ActionSheet
)

// TODO verify requirements are installed

// auto install in standalone mode
if (typeof window !== 'undefined' && window.Vue) {
  window.Quasar = Quasar
  window.Vue.use(Quasar)
}

export default Quasar
