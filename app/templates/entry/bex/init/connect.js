/**
 * THIS FILE WILL BE OVERWRITTEN.
 * DO NOT EDIT.
 **/

/* global chrome */

import Bridge from '../bridge'
import { uid } from 'quasar'

export default function connect () {
  window.QBexInit({
    connect (cb) {
      const
        // If we don't get an id, generate one so we have a unique connection to whatever it is.
        // this could be the popup window or the options window (As they don't have tab ids)
        tabId = chrome.devtools ? chrome.devtools.inspectedWindow.tabId : uid(),
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
