import install from './vue-install'
import start from './start'
import standaloneInstall from './standalone-install'
import * as theme from './features/theme'
import { version } from '../package.json'

import './features/body-classes'
import './features/polyfills'
import './features/error-handler'
import './features/fastclick'
import './features/addressbar-color'

import ActionSheet from './components/action-sheet/action-sheet'
import Dialog from './components/dialog/dialog'
import Toast from './components/toast/toast'

import AppFullscreen from './features/app-fullscreen'
import AppVisibility from './features/app-visibility'
import Cookies from './features/cookies'
import Platform from './features/platform'
import Events from './features/events'
import Loading from './components/loading/loading.js'
import Utils from './utils'
import { LocalStorage, SessionStorage } from './features/web-storage'

let Quasar = {
  version,
  install,
  start,
  theme
}

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

standaloneInstall(Quasar)

export default Quasar
