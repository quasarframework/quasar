import { initHook } from './hook'
import { initProxy } from './proxy'
import connect from './connect'

if (chrome.runtime.id) {
  initHook()
  initProxy()
  connect()
}
