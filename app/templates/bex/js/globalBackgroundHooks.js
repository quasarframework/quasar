// Hooks added here have no bridge to the BEX but allow you to add listeners before your BEX is activated

export default function attachGlobalBackgroundHooks (chrome) {
  chrome.browserAction.onClicked.addListener((tab) => { // eslint-disable-line no-unused-vars
    chrome.tabs.create({
      url: chrome.extension.getURL('www/index.html')
    }, (newTab) => { // eslint-disable-line no-unused-vars
      // Tab opened.
    })
  })
}
