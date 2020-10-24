/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

/* global chrome */

import Bridge from '../bridge'
import { uid } from 'quasar'

export default function connect () {
  const buildConnection = (id, cb) => {
    const port = chrome.runtime.connect({
      name: 'app:' + id
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
  }

  const fallbackConnection = cb => {
    // If we're not in a proper web browser tab, generate an id so we have a unique connection to whatever it is.
    // this could be the popup window or the options window (As they don't have tab ids)
    // If dev tools is available, it means we're on it. Use that for the id.
    const tabId = chrome.devtools ? chrome.devtools.inspectedWindow.tabId : uid()
    buildConnection(tabId, cb)
  }

  window.QBexInit({
    connect (cb) {
      if (chrome.tabs && !chrome.devtools) {
        // If we're on a web browser tab, use the current tab id to connect to the app.
        chrome.tabs.getCurrent(tab => {
          if (tab && tab.id) {
            buildConnection(tab.id, cb)
          }
          else {
            fallbackConnection(cb)
          }
        })
      }
      else {
        fallbackConnection(cb)
      }
    },
    onReload (reloadFn) {
      window.addEventListener('beforeunload', reloadFn)
    }
  })
}
