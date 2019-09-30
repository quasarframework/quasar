/**
 * THIS FILE WILL BE OVERWRITTEN.
 * DO NOT EDIT.
 *
 * You are probably looking into adding hooks in your code. This should be done by means of
 * src-bex/activatedContentHooks (which has access to the browser instance and communication bridge)
 **/

/* global chrome */

import Bridge from '../bridge'
import attachActivatedContentHooks from '../../activatedContentHooks'

const port = chrome.runtime.connect({
  name: 'contentScript'
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

attachActivatedContentHooks(window, chrome, bridge)
