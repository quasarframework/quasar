/* eslint-disable */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking into adding hooks in your code. This should be done by means of
 * src-bex/js/dom-hooks.js which is injected into the web page and has a communication bridge
 **/

import Bridge from './bridge'
import { listenForWindowEvents } from './window-event-listener'
import runDevlandDom from '../../src-bex/dom'

let bridge = new Bridge({
  listen (_fn) { },
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

runDevlandDom(bridge)
