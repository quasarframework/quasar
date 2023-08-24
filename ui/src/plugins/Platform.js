/* eslint-disable no-useless-escape */

import { ref, reactive } from 'vue'
import { injectProp } from '../utils/private/inject-obj-prop.js'

/**
 * __ QUASAR_SSR __            -> runs on SSR on client or server
 * __ QUASAR_SSR_SERVER __     -> runs on SSR on server
 * __ QUASAR_SSR_CLIENT __     -> runs on SSR on client
 * __ QUASAR_SSR_PWA __        -> built with SSR+PWA; may run on SSR on client or on PWA client
 *                              (needs runtime detection)
 */

export const isRuntimeSsrPreHydration = __QUASAR_SSR_SERVER__
  ? { value: true }
  : ref(
    __QUASAR_SSR_CLIENT__ && (
      __QUASAR_SSR_PWA__ ? document.body.getAttribute('data-server-rendered') !== null : true
    )
  )

export let iosEmulated = false
export let iosCorrection

function getMatch (userAgent, platformMatch) {
  const match = /(edg|edge|edga|edgios)\/([\w.]+)/.exec(userAgent)
    || /(opr)[\/]([\w.]+)/.exec(userAgent)
    || /(vivaldi)[\/]([\w.]+)/.exec(userAgent)
    || /(chrome|crios)[\/]([\w.]+)/.exec(userAgent)
    || /(version)(applewebkit)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent)
    || /(webkit)[\/]([\w.]+).*(version)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent)
    || /(firefox|fxios)[\/]([\w.]+)/.exec(userAgent)
    || /(webkit)[\/]([\w.]+)/.exec(userAgent)
    || /(opera)(?:.*version|)[\/]([\w.]+)/.exec(userAgent)
    || []

  return {
    browser: match[ 5 ] || match[ 3 ] || match[ 1 ] || '',
    version: match[ 2 ] || match[ 4 ] || '0',
    versionNumber: match[ 4 ] || match[ 2 ] || '0',
    platform: platformMatch[ 0 ] || ''
  }
}

function getPlatformMatch (userAgent) {
  return /(ipad)/.exec(userAgent)
    || /(ipod)/.exec(userAgent)
    || /(windows phone)/.exec(userAgent)
    || /(iphone)/.exec(userAgent)
    || /(kindle)/.exec(userAgent)
    || /(silk)/.exec(userAgent)
    || /(android)/.exec(userAgent)
    || /(win)/.exec(userAgent)
    || /(mac)/.exec(userAgent)
    || /(linux)/.exec(userAgent)
    || /(cros)/.exec(userAgent)
    // TODO: Remove BlackBerry detection. BlackBerry OS, BlackBerry 10, and BlackBerry PlayBook OS
    // is officially dead as of January 4, 2022 (https://www.blackberry.com/us/en/support/devices/end-of-life)
    || /(playbook)/.exec(userAgent)
    || /(bb)/.exec(userAgent)
    || /(blackberry)/.exec(userAgent)
    || []
}

const hasTouch = __QUASAR_SSR_SERVER__
  ? false
  : 'ontouchstart' in window || window.navigator.maxTouchPoints > 0

function applyIosCorrection (is) {
  iosCorrection = { is: { ...is } }

  delete is.mac
  delete is.desktop

  const platform = Math.min(window.innerHeight, window.innerWidth) > 414
    ? 'ipad'
    : 'iphone'

  Object.assign(is, {
    mobile: true,
    ios: true,
    platform,
    [ platform ]: true
  })
}

function getPlatform (UA) {
  const
    userAgent = UA.toLowerCase(),
    platformMatch = getPlatformMatch(userAgent),
    matched = getMatch(userAgent, platformMatch),
    browser = {}

  if (matched.browser) {
    browser[ matched.browser ] = true
    browser.version = matched.version
    browser.versionNumber = parseInt(matched.versionNumber, 10)
  }

  if (matched.platform) {
    browser[ matched.platform ] = true
  }

  const knownMobiles = browser.android
    || browser.ios
    || browser.bb
    || browser.blackberry
    || browser.ipad
    || browser.iphone
    || browser.ipod
    || browser.kindle
    || browser.playbook
    || browser.silk
    || browser[ 'windows phone' ]

  // These are all considered mobile platforms, meaning they run a mobile browser
  if (knownMobiles === true || userAgent.indexOf('mobile') > -1) {
    browser.mobile = true

    if (browser.edga || browser.edgios) {
      browser.edge = true
      matched.browser = 'edge'
    }
    else if (browser.crios) {
      browser.chrome = true
      matched.browser = 'chrome'
    }
    else if (browser.fxios) {
      browser.firefox = true
      matched.browser = 'firefox'
    }
  }
  // If it's not mobile we should consider it's desktop platform, meaning it runs a desktop browser
  // It's a workaround for anonymized user agents
  // (browser.cros || browser.mac || browser.linux || browser.win)
  else {
    browser.desktop = true
  }

  // Set iOS if on iPod, iPad or iPhone
  if (browser.ipod || browser.ipad || browser.iphone) {
    browser.ios = true
  }

  if (browser[ 'windows phone' ]) {
    browser.winphone = true
    delete browser[ 'windows phone' ]
  }

  // TODO: The assumption about WebKit based browsers below is not completely accurate.
  // Google released Blink(a fork of WebKit) engine on April 3, 2013, which is really different than WebKit today.
  // Today, one might want to check for WebKit to deal with its bugs, which is used on all browsers on iOS, and Safari browser on all platforms.

  // Chrome, Opera 15+, Vivaldi and Safari are webkit based browsers
  if (
    browser.chrome
    || browser.opr
    || browser.safari
    || browser.vivaldi
    // we expect unknown, non iOS mobile browsers to be webkit based
    || (
      browser.mobile === true
      && browser.ios !== true
      && knownMobiles !== true
    )
  ) {
    browser.webkit = true
  }

  // TODO: (Qv3) rename the terms 'edge' to 'edge legacy'(or remove it) then 'edge chromium' to 'edge' to match with the known up-to-date terms
  // Microsoft Edge is the new Chromium-based browser. Microsoft Edge Legacy is the old EdgeHTML-based browser (EOL: March 9, 2021).
  if (browser.edg) {
    matched.browser = 'edgechromium'
    browser.edgeChromium = true
  }

  // Blackberry browsers are marked as Safari on BlackBerry
  if ((browser.safari && browser.blackberry) || browser.bb) {
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

  if (__QUASAR_SSR_SERVER__ !== true) {
    if (userAgent.indexOf('electron') > -1) {
      browser.electron = true
    }
    else if (document.location.href.indexOf('-extension://') > -1) {
      browser.bex = true
    }
    else {
      if (window.Capacitor !== void 0) {
        browser.capacitor = true
        browser.nativeMobile = true
        browser.nativeMobileWrapper = 'capacitor'
      }
      else if (window._cordovaNative !== void 0 || window.cordova !== void 0) {
        browser.cordova = true
        browser.nativeMobile = true
        browser.nativeMobileWrapper = 'cordova'
      }

      if (
        hasTouch === true
        && browser.mac === true
        && (
          (browser.desktop === true && browser.safari === true)
          || (
            browser.nativeMobile === true
            && browser.android !== true
            && browser.ios !== true
            && browser.ipad !== true
          )
        )
      ) {
        /*
        * Correction needed for iOS since the default
        * setting on iPad is to request desktop view; if we have
        * touch support and the user agent says it's a
        * desktop, we infer that it's an iPhone/iPad with desktop view
        * so we must fix the false positives
        */
        applyIosCorrection(browser)
      }
    }
  }

  return browser
}

const userAgent = __QUASAR_SSR_SERVER__
  ? ''
  : navigator.userAgent || navigator.vendor || window.opera

const ssrClient = {
  has: {
    touch: false,
    webStorage: false
  },
  within: { iframe: false }
}

// We export "client" for hydration error-free parts,
// like touch directives who do not (and must NOT) wait
// for the client takeover;
// Do NOT import this directly in your app, unless you really know
// what you are doing.
export const client = __QUASAR_SSR_SERVER__
  ? ssrClient
  : {
      userAgent,
      is: getPlatform(userAgent),
      has: {
        touch: hasTouch
      },
      within: {
        iframe: window.self !== window.top
      }
    }

const Platform = {
  install (opts) {
    const { $q } = opts

    if (__QUASAR_SSR_SERVER__) {
      $q.platform = this.parseSSR(opts.ssrContext)
    }
    else if (isRuntimeSsrPreHydration.value === true) {
      // takeover should increase accuracy for
      // the rest of the props; we also avoid
      // hydration errors
      opts.onSSRHydrated.push(() => {
        Object.assign($q.platform, client)
        isRuntimeSsrPreHydration.value = false
        iosCorrection = void 0
      })

      // we need to make platform reactive
      // for the takeover phase
      $q.platform = reactive(this)
    }
    else {
      $q.platform = this
    }
  }
}

if (__QUASAR_SSR_SERVER__) {
  Platform.parseSSR = (ssrContext) => {
    const userAgent = ssrContext.req.headers[ 'user-agent' ] || ssrContext.req.headers[ 'User-Agent' ] || ''
    return {
      ...client,
      userAgent,
      is: getPlatform(userAgent)
    }
  }
}
else {
  // do not access window.localStorage without
  // devland actually using it as this will get
  // reported under "Cookies" in Google Chrome
  let hasWebStorage

  injectProp(client.has, 'webStorage', () => {
    if (hasWebStorage !== void 0) {
      return hasWebStorage
    }

    try {
      if (window.localStorage) {
        hasWebStorage = true
        return true
      }
    }
    catch (e) {}

    hasWebStorage = false
    return false
  })

  iosEmulated = client.is.ios === true
    && window.navigator.vendor.toLowerCase().indexOf('apple') === -1

  if (isRuntimeSsrPreHydration.value === true) {
    // must match with server-side before
    // client taking over in order to prevent
    // hydration errors
    Object.assign(Platform, client, iosCorrection, ssrClient)
  }
  else {
    Object.assign(Platform, client)
  }
}

export default Platform
