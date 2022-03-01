/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

/**
 * Helper function to add a generic windows event listener to the page
 * which acts as a bridge between the web page and the content script bridge.
 * @param bridge
 * @param type
 */
export const listenForWindowEvents = (bridge, type) => {
  // Listen for any events from the web page and transmit to the BEX bridge.
  window.addEventListener('message', payload => {
    // We only accept messages from this window to itself [i.e. not from any iframes]
    if (payload.source != window) {
      return
    }

    if (payload.data.from !== void 0 && payload.data.from === type) {
      const
        eventData = payload.data[0],
        bridgeEvents = bridge.getEvents()

      for (let event in bridgeEvents) {
        if (event === eventData.event) {
          bridgeEvents[event](eventData.payload)
        }
      }
    }
  }, false)
}
