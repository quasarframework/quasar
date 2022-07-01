// Hooks added here have a bridge allowing communication between the Web Page and the BEX Content Script.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/dom-hooks
import { bexDom } from 'quasar/wrappers'

export default bexDom((/* bridge */) => {
  /*
  bridge.send('message.to.quasar', {
    worked: true
  })
  */
})
