import Bridge from '../bridge'

export default function connect () {
  window.QBexInit({
    connect (cb) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const port = chrome.runtime.connect({
          name: '' + tabs[0].id
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
      })
    },
    onReload (reloadFn) {
      window.addEventListener('beforeunload', reloadFn)
    }
  })
}
