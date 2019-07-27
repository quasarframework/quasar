import { initHook } from './hook'
import connect from './connect'

if (chrome.runtime.id) {
  initHook()
  connect()
}
