/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking into adding hooks in your code. This should be done by means of
 * src-bex/js/dom-hooks.js which is injected into the web page and has a communication bridge
 **/

import Bridge from '../bridge'
import attachDomHooks from 'src-bex/js/dom-hooks'
import { listenForWindowEvents } from './window-event-listener'

let bridge = new Bridge({
  listen (fn) { },
  send (data) {
    const payload = {
      ...data,
      from: 'bex-dom'
    }
    window.postMessage(payload, '*')
  }
})

// Listen for events from the BEX content script
listenForWindowEvents(bridge, 'bex-content-script')

attachDomHooks(bridge)
