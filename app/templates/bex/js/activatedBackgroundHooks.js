// Hooks added here have a bridge to your BEX allowing communication.

export default function attachActivatedBackgroundHooks (chrome, bridge) {

  bridge.on('storage.get', payload => {
    if (payload.key === null) {
      chrome.storage.local.get(null, r => {
        const result = []

        // Group the items up into an array to take advantage of the bridge's chunk splitting.
        for (let itemKey in r) {
          result.push(r[itemKey])
        }
        bridge.send('storage.get.result', result)
      })
    } else {
      chrome.storage.local.get([payload.key], r => {
        bridge.send('storage.get.result', r[payload.key])
      })
    }
  })

  bridge.on('storage.set', payload => {
    chrome.storage.local.set({ [payload.key]: payload.data }, () => {
      bridge.send('storage.set.result', payload.data)
    })
  })

  bridge.on('storage.remove', payload => {
    chrome.storage.local.remove(payload.key, () => {
      bridge.send('storage.remove.result', payload.data)
    })
  })

  /*
  // EXAMPLES
  // Listen to a message from the client
  bridge.on('test', d => {
    console.log(d)
  })

  // Send a message to the client based on something happening.
  chrome.tabs.onCreated.addListener(tab => {
    bridge.send('browserTabCreated', { tab })
  })

  // Send a message to the client based on something happening.
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      bridge.send('browserTabUpdated', { tab, changeInfo })
    }
  })
   */
}
