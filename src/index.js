
import install from './install'
import start from './start'
import init from './init'

import './polyfills'
import './error-handler'
import './fastclick'

import ActionSheet from './action-sheet/action-sheet'
import Dialog from './dialog/dialog'
import Modal from './modal/modal'
import Notify from './notify/notify'

import AppFullscreen from './app-fullscreen'
import AppVisibility from './app-visibility'
import Cookies from './cookies'
import Environment from './environment'
import * as Events from './events'
import Keycodes from './keycodes'
import Loading from './loading'
import Utils from './utils'
import { LocalStorage, SessionStorage } from './web-storage'

let Quasar = {
  version: '0.5.0',
  install,
  start,

  ActionSheet,
  Dialog,
  AppFullscreen,
  AppVisibility,
  Cookies,
  Environment,
  Events,
  Keycodes,
  Loading,
  Modal,
  Notify,
  Utils,
  LocalStorage,
  SessionStorage
}

init(Quasar)

export default Quasar
