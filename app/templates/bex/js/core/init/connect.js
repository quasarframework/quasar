/**
 * THIS FILE WILL BE OVERWRITTEN.
 * DO NOT EDIT.
 **/

/* global chrome */

import Bridge from '../bridge'

export default function connect () {
  window.QBexInit({
    connect (cb) {
      const
        tabId = chrome.devtools ? chrome.devtools.inspectedWindow.tabId : void 0,
        port = chrome.runtime.connect({
          name: tabId ? 'app:' + tabId : 'app'
        })

      let disconnected = false
      port.onDisconnect.addListener(() => {
        disconnected = true
      })

      let bridge = new Bridge({
        listen (fn) {
          port.onMessage.addListener(fn)
        },
        send (data) {
          if (!disconnected) {
            port.postMessage(data)
          }
        }
      })

      cb(bridge)
    },
    onReload (reloadFn) {
      window.addEventListener('beforeunload', reloadFn)
    }
  })
}
