// This file is where you will put your chrome listeners and respond by sending them to your BEX

export default function attachHooks (chrome, bridge) {
  chrome.browserAction.onClicked.addListener((tab) => { // eslint-disable-line no-unused-vars
    chrome.tabs.create({
      url: chrome.extension.getURL('www/index.html')
    }, (newTab) => { // eslint-disable-line no-unused-vars
      // Tab opened.
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
