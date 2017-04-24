/* eslint-disable no-useless-escape */
/* eslint-disable no-mixed-operators */

function getUserAgent () {
  return (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()
}

function getMatch (userAgent, platformMatch) {
  var match = /(edge)\/([\w.]+)/.exec(userAgent) ||
    /(opr)[\/]([\w.]+)/.exec(userAgent) ||
    /(vivaldi)[\/]([\w.]+)/.exec(userAgent) ||
    /(chrome)[\/]([\w.]+)/.exec(userAgent) ||
    /(iemobile)[\/]([\w.]+)/.exec(userAgent) ||
    /(version)(applewebkit)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent) ||
    /(webkit)[\/]([\w.]+).*(version)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent) ||
    /(webkit)[\/]([\w.]+)/.exec(userAgent) ||
    /(opera)(?:.*version|)[\/]([\w.]+)/.exec(userAgent) ||
    /(msie) ([\w.]+)/.exec(userAgent) ||
    userAgent.indexOf('trident') >= 0 && /(rv)(?::| )([\w.]+)/.exec(userAgent) ||
    userAgent.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(userAgent) ||
    []

  return {
    browser: match[5] || match[3] || match[1] || '',
    version: match[2] || match[4] || '0',
    versionNumber: match[4] || match[2] || '0',
    platform: platformMatch[0] || ''
  }
}

function getPlatformMatch (userAgent) {
  return /(ipad)/.exec(userAgent) ||
    /(ipod)/.exec(userAgent) ||
    /(windows phone)/.exec(userAgent) ||
    /(iphone)/.exec(userAgent) ||
    /(kindle)/.exec(userAgent) ||
    /(silk)/.exec(userAgent) ||
    /(android)/.exec(userAgent) ||
    /(win)/.exec(userAgent) ||
    /(mac)/.exec(userAgent) ||
    /(linux)/.exec(userAgent) ||
    /(cros)/.exec(userAgent) ||
    /(playbook)/.exec(userAgent) ||
    /(bb)/.exec(userAgent) ||
    /(blackberry)/.exec(userAgent) ||
    []
}

function getPlatform () {
  let
    userAgent = getUserAgent(),
    platformMatch = getPlatformMatch(userAgent),
    matched = getMatch(userAgent, platformMatch),
    browser = {}

  if (matched.browser) {
    browser[matched.browser] = true
    browser.version = matched.version
    browser.versionNumber = parseInt(matched.versionNumber, 10)
  }

  if (matched.platform) {
    browser[matched.platform] = true
  }

  // These are all considered mobile platforms, meaning they run a mobile browser
  if (browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
    browser.ipod || browser.kindle || browser.playbook || browser.silk || browser['windows phone']) {
    browser.mobile = true
  }

  // Set iOS if on iPod, iPad or iPhone
  if (browser.ipod || browser.ipad || browser.iphone) {
    browser.ios = true
  }

  if (browser['windows phone']) {
    browser.winphone = true
    delete browser['windows phone']
  }

  // These are all considered desktop platforms, meaning they run a desktop browser
  if (browser.cros || browser.mac || browser.linux || browser.win) {
    browser.desktop = true
  }

  // Chrome, Opera 15+, Vivaldi and Safari are webkit based browsers
  if (browser.chrome || browser.opr || browser.safari || browser.vivaldi) {
    browser.webkit = true
  }

  // IE11 has a new token so we will assign it msie to avoid breaking changes
  if (browser.rv || browser.iemobile) {
    matched.browser = 'ie'
    browser.ie = true
  }

  // Edge is officially known as Microsoft Edge, so rewrite the key to match
  if (browser.edge) {
    matched.browser = 'edge'
    browser.edge = true
  }

  // Blackberry browsers are marked as Safari on BlackBerry
  if (browser.safari && browser.blackberry || browser.bb) {
    matched.browser = 'blackberry'
    browser.blackberry = true
  }

  // Playbook browsers are marked as Safari on Playbook
  if (browser.safari && browser.playbook) {
    matched.browser = 'playbook'
    browser.playbook = true
  }

  // Opera 15+ are identified as opr
  if (browser.opr) {
    matched.browser = 'opera'
    browser.opera = true
  }

  // Stock Android browsers are marked as Safari on Android.
  if (browser.safari && browser.android) {
    matched.browser = 'android'
    browser.android = true
  }

  // Kindle browsers are marked as Safari on Kindle
  if (browser.safari && browser.kindle) {
    matched.browser = 'kindle'
    browser.kindle = true
  }

  // Kindle Silk browsers are marked as Safari on Kindle
  if (browser.safari && browser.silk) {
    matched.browser = 'silk'
    browser.silk = true
  }

  if (browser.vivaldi) {
    matched.browser = 'vivaldi'
    browser.vivaldi = true
  }

  // Assign the name and platform variable
  browser.name = matched.browser
  browser.platform = matched.platform

  if (window && window.process && window.process.versions && window.process.versions.electron) {
    browser.electron = true
  }
  else if (document.location.href.indexOf('chrome-extension://') === 0) {
    browser.chromeExt = true
  }
  else if (window._cordovaNative || document.location.href.indexOf('http') !== 0) {
    browser.cordova = true
  }

  return browser
}

const Platform = {
  is: getPlatform(),
  has: {
    touch: (() => !!('ontouchstart' in document.documentElement) || window.navigator.msMaxTouchPoints > 0)()
  },
  within: {
    iframe: window.self !== window.top
  }
}

Platform.has.popstate = !Platform.within.iframe && !Platform.is.electron
export default Platform
