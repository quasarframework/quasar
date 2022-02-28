/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking into adding hooks in your code. This should be done by means of
 * src-bex/js/content-hooks.js which has access to the browser instance and communication bridge
 **/

/* global chrome */

import Bridge from '../bridge'
import attachContentHooks from 'src-bex/js/content-hooks'
import { listenForWindowEvents } from './window-event-listener'

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
      window.postMessage({
        ...data,
        from: 'bex-content-script'
      }, '*')
    }
  }
})

// Inject our dom script for communications.
function injectScript (url) {
  const script = document.createElement('script')
  script.src = url
  script.onload = function () {
    this.remove()
  }
  ;(document.head || document.documentElement).appendChild(script)
}

if (document instanceof HTMLDocument) {
  injectScript(chrome.extension.getURL(process.env.DEV ? 'www/bex-dom.js' : 'www/js/bex-dom.js'))
}

// Listen for event from the web page
listenForWindowEvents(bridge, 'bex-dom')

attachContentHooks(bridge)
