import Velocity from 'velocity-animate'
window.Velocity = Velocity
import 'velocity-animate/velocity.ui'

import install from './install'
import start from './start'
import init from './init'
import * as theme from './theme'

import './polyfills'
import './error-handler'
import './fastclick'

import ActionSheet from './components/action-sheet/action-sheet'
import Dialog from './components/dialog/dialog'
import Toast from './components/toast/toast'

import AppFullscreen from './app-fullscreen'
import AppVisibility from './app-visibility'
import Cookies from './cookies'
import Platform from './platform'
import Events from './events'
import Loading from './components/loading/loading.js'
import Utils from './utils'
import { LocalStorage, SessionStorage } from './web-storage'

let Quasar = {
  version: '0.8.0',
  install,
  start,
  theme
}

init(Quasar)

export {
  ActionSheet,
  Dialog,
  AppFullscreen,
  AppVisibility,
  Cookies,
  Platform,
  Events,
  Loading,
  Toast,
  Utils,
  LocalStorage,
  SessionStorage,
  theme
}

export default Quasar
