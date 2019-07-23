chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    let
      pattern = /css\/.[a-z0..9].*\.[a-z0..9].*\.css$/g,
      matches = details.url.match(pattern)
    
    if(matches && matches.length > 0) {
      return { redirectUrl: chrome.extension.getURL('www/' + matches[0]) }
    }
    
    pattern = /http:\/\/127\.0\.0\.1\/__q-bex_ext_id__/g
    matches = details.url.match(pattern)
    if(matches && matches.length > 0) {
      return { redirectUrl: chrome.extension.getURL(details.url.replace(pattern, 'www/')) }
    }
  },
  {
    urls: ['<all_urls>']
  },
  ['blocking']
);
