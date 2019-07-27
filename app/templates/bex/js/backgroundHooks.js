// This file is where you will put your chrome listeners and respond by sending them to your BEX

export default function attachHooks (chrome, bridge) {
  bridge.on('test', d => {
    console.log(d)
  })

  chrome.tabs.onCreated.addListener(tab => {
    bridge.send('browserTabCreated', { tab })
  })

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      bridge.send('browserTabUpdated', { tab, changeInfo })
    }
  })
}
