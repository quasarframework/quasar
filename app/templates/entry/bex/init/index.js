/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

/* global chrome */

import connect from './connect'

if (chrome.runtime.id) {
  // Chrome ~73 introduced a change which requires the background connection to be
  // active before the client this makes sure the connection has had time before progressing.
  // Could also implement a ping pattern and connect when a valid response is received
  // but this way seems less overhead.
  setTimeout(() => {
    connect()
  }, 300)
}
