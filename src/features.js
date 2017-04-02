import './features/body-classes'
import './features/polyfills'
import './features/error-handler'
import './features/fastclick'

import AddressbarColor from './features/addressbar-color'
import AppFullscreen from './features/app-fullscreen'
import AppVisibility from './features/app-visibility'
import Cookies from './features/cookies'
import Events from './features/events'
import Platform from './features/platform'
import * as theme from './features/theme'
import { LocalStorage, SessionStorage } from './features/web-storage'

export {
  AddressbarColor,
  AppFullscreen,
  AppVisibility,
  Cookies,
  Events,
  Platform,
  theme,
  LocalStorage, SessionStorage
}

export const Features = {
  AddressbarColor,
  AppFullscreen,
  AppVisibility,
  Cookies,
  Events,
  Platform,
  theme,
  LocalStorage, SessionStorage // eslint-disable-line
}
