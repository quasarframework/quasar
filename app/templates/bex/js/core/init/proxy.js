// This is a content-script that serves as a proxy between the injected
// backend and the Vue devtools panel.

export function initProxy () {
  const bexConnection = chrome.runtime.connect({
    name: 'bex'
  })

  function sendMessageToBackend (payload) {
    window.postMessage({
      source: 'q-bex-proxy',
      payload: payload
    }, '*')
  }

  function sendMessageToBex (e) {
    if (e.data && e.data.source === 'q-bex-backend') {
      bexConnection.postMessage(e.data.payload)
    }
  }

  function handleDisconnect () {
    window.removeEventListener('message', sendMessageToBex)
    sendMessageToBackend('shutdown')
  }

  bexConnection.onMessage.addListener(sendMessageToBackend)
  window.addEventListener('message', sendMessageToBex)
  bexConnection.onDisconnect.addListener(handleDisconnect)

  sendMessageToBackend('init')
}
