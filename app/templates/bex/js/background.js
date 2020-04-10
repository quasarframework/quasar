// Background code goes here
chrome.browserAction.onClicked.addListener((tab) => { // eslint-disable-line no-unused-vars
  // Opens our extension in a new browser window.
  // Only if a popup isn't defined in the manifest.
  chrome.tabs.create({
    url: chrome.extension.getURL('www/index.html')
  }, (newTab) => { // eslint-disable-line no-unused-vars
    // Tab opened.
  })
})
