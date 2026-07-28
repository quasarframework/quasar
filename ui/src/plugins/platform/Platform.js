// oxlint-disable no-useless-escape

import { reactive, ref } from 'vue'
import { injectProp } from '../../utils/private.inject-obj-prop/inject-obj-prop.js'

/**
 * __ QUASAR_SSR __            -> runs on SSR/SSG on client or server
 * __ QUASAR_SSR_SERVER __     -> runs on SSR/SSG on server
 * __ QUASAR_SSR_CLIENT __     -> runs on SSR/SSG on client
 * __ QUASAR_SSR_PWA __        -> built with SSR/SSG + PWA; may run on SSR/SSG on client or on PWA client
 *                              (needs runtime detection)
 */

export const isRuntimeSsrPreHydration = __QUASAR_SSR_SERVER__
  ? { value: true }
  : ref(
      __QUASAR_SSR_CLIENT__ &&
        (__QUASAR_SSR_PWA__ ? 'serverRendered' in document.body.dataset : true)
    )

let preHydrationBrowser

// Long User-Agent values are not useful for platform detection and can make
// complex browser expressions prohibitively expensive.
const maxUserAgentLength = 512

function normalizeUserAgent(userAgent) {
  return typeof userAgent === 'string'
    ? userAgent.slice(0, maxUserAgentLength).toLowerCase()
    : ''
}

const safariVersionRE = /(?:^|\s)version\/([\w.]+)/
const applewebkitRE = /(?:^|\s)applewebkit\/[\w.]+/
const safariAgentRE = /(?:^|\s)safari\/[\w.]+/
function getSafariMatch(userAgent) {
  const versionMatch = safariVersionRE.exec(userAgent)
  return versionMatch !== null &&
    applewebkitRE.test(userAgent) &&
    safariAgentRE.test(userAgent)
    ? {
        browser: 'safari',
        version: versionMatch[1]
      }
    : null
}

const operaAgentRE = /(?:^|\s)opera\/([\w.]+)/
const operaVersionRE = /(?:^|\s)version\/([\w.]+)/
function getOperaMatch(userAgent) {
  const operaMatch = operaAgentRE.exec(userAgent)
  if (operaMatch === null) return null

  const versionMatch = operaVersionRE.exec(userAgent)

  return {
    browser: 'opera',
    version: versionMatch?.[1] || operaMatch[1]
  }
}

const edgeRE = /(edg|edge|edga|edgios)\/([\w.]+)/
const oprRE = /(opr)[\/]([\w.]+)/
const vivaldiRE = /(vivaldi)[\/]([\w.]+)/
const chromeRE = /(chrome|crios)[\/]([\w.]+)/
const firefoxRE = /(firefox|fxios)[\/]([\w.]+)/
const webkitRE = /(webkit)[\/]([\w.]+)/
function getMatch(userAgent, platformMatch) {
  let match =
    edgeRE.exec(userAgent) ||
    oprRE.exec(userAgent) ||
    vivaldiRE.exec(userAgent) ||
    chromeRE.exec(userAgent)

  if (match === null) {
    const safariMatch = getSafariMatch(userAgent)

    if (safariMatch !== null) {
      return {
        ...safariMatch,
        platform: platformMatch[0] || ''
      }
    }

    match = firefoxRE.exec(userAgent) || webkitRE.exec(userAgent)

    if (match === null) {
      const operaMatch = getOperaMatch(userAgent)

      if (operaMatch !== null) {
        return {
          ...operaMatch,
          platform: platformMatch[0] || ''
        }
      }

      match = []
    }
  }

  return {
    browser: match[5] || match[3] || match[1] || '',
    version: match[4] || match[2] || '0',
    platform: platformMatch[0] || ''
  }
}

const ipadRE = /(ipad)/
const ipodRE = /(ipod)/
const iphoneRE = /(iphone)/
const windowsPhoneRE = /(windows phone)/
const kindleRE = /(kindle)/
const silkRE = /(silk)/
const androidRE = /(android)/
const winRE = /(win)/ // "windows" is too generic and can be used in other platforms' UA
const macRE = /(mac)/
const linuxRE = /(linux)/
const crosRE = /(cros)/
function getPlatformMatch(userAgent) {
  return (
    ipadRE.exec(userAgent) ||
    ipodRE.exec(userAgent) ||
    windowsPhoneRE.exec(userAgent) ||
    iphoneRE.exec(userAgent) ||
    kindleRE.exec(userAgent) ||
    silkRE.exec(userAgent) ||
    androidRE.exec(userAgent) ||
    winRE.exec(userAgent) ||
    macRE.exec(userAgent) ||
    linuxRE.exec(userAgent) ||
    crosRE.exec(userAgent) ||
    []
  )
}

const hasTouch = __QUASAR_SSR_SERVER__
  ? false
  : 'ontouchstart' in window || window.navigator.maxTouchPoints > 0

function getPlatform(UA) {
  const userAgent = normalizeUserAgent(UA)
  const platformMatch = getPlatformMatch(userAgent)
  const matched = getMatch(userAgent, platformMatch)
  const browser = {
    mobile: false,
    desktop: false,

    cordova: false,
    capacitor: false,
    nativeMobile: false,
    // nativeMobileWrapper: void 0,
    electron: false,
    bex: false,

    linux: false,
    mac: false,
    win: false,
    cros: false,

    chrome: false,
    firefox: false,
    opera: false,
    safari: false,
    vivaldi: false,
    edge: false,
    edgeChromium: false,
    ie: false,
    webkit: false,

    android: false,
    ios: false,
    ipad: false,
    iphone: false,
    ipod: false,
    kindle: false,
    winphone: false,
    silk: false
  }

  if (matched.browser) {
    browser[matched.browser] = true
    browser.version = matched.version
    browser.versionNumber = Number.parseInt(matched.version, 10)
  }

  if (matched.platform) {
    browser[matched.platform] = true
  }

  if (browser['windows phone']) {
    browser.winphone = true
    delete browser['windows phone']
  }

  const knownMobiles =
    browser.android ||
    browser.ios ||
    browser.ipad ||
    browser.iphone ||
    browser.ipod ||
    browser.kindle ||
    browser.silk ||
    browser.winphone

  // These are all considered mobile platforms, meaning they run a mobile browser
  if (knownMobiles === true || userAgent.includes('mobile')) {
    browser.mobile = true
  }
  // If it's not mobile we should consider it's desktop platform, meaning it runs a desktop browser
  // It's a workaround for anonymized user agents
  // (browser.cros || browser.mac || browser.linux || browser.win)
  else {
    browser.desktop = true
  }

  if (browser.edga || browser.edgios || browser.edg) {
    browser.edge = true
    matched.browser = 'edge'
  } else if (browser.crios) {
    browser.chrome = true
    matched.browser = 'chrome'
  } else if (browser.fxios) {
    browser.firefox = true
    matched.browser = 'firefox'
  }

  // Set iOS if on iPod, iPad or iPhone
  if (browser.ipod || browser.ipad || browser.iphone) {
    browser.ios = true
  }

  if (browser.vivaldi) {
    matched.browser = 'vivaldi'
    browser.vivaldi = true
  }

  // TODO: The assumption about WebKit based browsers below is not completely accurate.
  // Google released Blink(a fork of WebKit) engine on April 3, 2013, which is really different than WebKit today.
  // Today, one might want to check for WebKit to deal with its bugs, which is used on all browsers on iOS, and Safari browser on all platforms.
  if (
    // Chrome, Opera 15+, Vivaldi and Safari are webkit based browsers
    browser.chrome ||
    browser.opr ||
    browser.safari ||
    browser.vivaldi ||
    // we expect unknown, non iOS mobile browsers to be webkit based
    (browser.mobile && !browser.ios && !knownMobiles)
  ) {
    browser.webkit = true
  }

  // Opera 15+ are identified as opr
  if (browser.opr) {
    matched.browser = 'opera'
    browser.opera = true
  }

  // Some browsers are marked as Safari but are not
  if (browser.safari) {
    if (browser.android) {
      matched.browser = 'android'
      browser.android = true
    } else if (browser.kindle) {
      matched.browser = 'kindle'
      browser.kindle = true
    } else if (browser.silk) {
      matched.browser = 'silk'
      browser.silk = true
    }
  }

  // Assign the name and platform variable
  browser.name = matched.browser
  browser.platform = matched.platform

  if (!__QUASAR_SSR_SERVER__) {
    if (userAgent.includes('electron')) {
      browser.electron = true
    } else if (document.location.href.includes('-extension://')) {
      browser.bex = true
    } else {
      if (window.Capacitor !== void 0) {
        browser.capacitor = true
        browser.nativeMobile = true
        browser.nativeMobileWrapper = 'capacitor'
      } else if (
        window._cordovaNative !== void 0 ||
        window.cordova !== void 0
      ) {
        browser.cordova = true
        browser.nativeMobile = true
        browser.nativeMobileWrapper = 'cordova'
      }

      if (isRuntimeSsrPreHydration.value) {
        /*
         * We need to remember the current state as
         * everything that follows can only be corrected client-side,
         * but we don't want to brake the hydration.
         *
         * The "client" object is imported throughout the UI and should
         * be as accurate as possible given all the knowledge that we posses
         * because decisions are required to be made immediately, even
         * before the hydration occurs.
         */
        preHydrationBrowser = { is: { ...browser } }
      }

      /*
       * All the following should be client-side corrections only
       */

      if (
        hasTouch &&
        browser.mac &&
        ((browser.desktop && browser.safari) ||
          (browser.nativeMobile &&
            !browser.android &&
            !browser.ios &&
            !browser.ipad))
      ) {
        /*
         * Correction needed for iOS since the default
         * setting on iPad is to request desktop view; if we have
         * touch support and the user agent says it's a
         * desktop, we infer that it's an iPhone/iPad with desktop view
         * so we must fix the false positives
         */

        delete browser.mac
        delete browser.desktop

        const platform =
          Math.min(window.innerHeight, window.innerWidth) > 414
            ? 'ipad'
            : 'iphone'

        Object.assign(browser, {
          mobile: true,
          ios: true,
          platform,
          [platform]: true
        })
      }

      if (
        !browser.mobile &&
        window.navigator.userAgentData &&
        window.navigator.userAgentData.mobile
      ) {
        /*
         * Correction needed on client-side when
         * we also have the navigator userAgentData
         */

        delete browser.desktop
        browser.mobile = true
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
  install(opts) {
    const { $q } = opts

    if (__QUASAR_SSR_SERVER__) {
      $q.platform = this.parseSSR(opts.ssrContext)
    } else if (isRuntimeSsrPreHydration.value) {
      // takeover should increase accuracy for
      // the rest of the props; we also avoid
      // hydration errors
      opts.onSSRHydrated.push(() => {
        Object.assign($q.platform, client)
        isRuntimeSsrPreHydration.value = false
      })

      // we need to make platform reactive
      // for the takeover phase
      $q.platform = reactive(this)
    } else {
      $q.platform = this
    }
  }
}

if (__QUASAR_SSR_SERVER__) {
  Platform.parseSSR = ssrContext => {
    const ua =
      ssrContext.req.headers['user-agent'] ||
      ssrContext.req.headers['User-Agent'] ||
      ''

    return {
      ...client,
      userAgent: ua,
      is: getPlatform(ua)
    }
  }
} else {
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
    } catch {}

    hasWebStorage = false
    return false
  })

  Object.assign(Platform, client)

  if (isRuntimeSsrPreHydration.value) {
    // must match with server-side before
    // client taking over in order to prevent
    // hydration errors
    Object.assign(Platform, preHydrationBrowser, ssrClient)

    // free up memory
    preHydrationBrowser = null
  }
}

export default Platform
