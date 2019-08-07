// Hooks added here have a bridge to your client side BEX allowing communication.

export default function attachActivatedContentHooks (window, chrome, bridge) {
  // Hook into the bridge to listen for events sent from the client BEX.
  /*
  bridge.on('some.event', payload => {
    if (payload.yourProp) {
      // Access a DOM element from here.
      // Document in this instance is the underlying website the contentScript runs on
      const el = document.getElementById('some-id')
      if (el) {
        el.value = 'Quasar Rocks!'
      }
    }
  })
   */
}
