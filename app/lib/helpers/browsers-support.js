const browserslist = require('browserslist')

const appPaths = require('../app-paths')
const { warn, fatal } = require('./logger')

const NAMES = {
  ie: 'IE',
  ie_mob: 'IE Mobile',
  ios_saf: 'iOS',
  op_mini: 'Opera Mini',
  op_mob: 'Opera Mobile',
  and_chr: 'Chrome for Android',
  and_ff: 'Firefox for Android',
  and_uc: 'UC for Android',
  and_qq: 'QQ for Android'
}

let browserListCache, browserBannerCache

function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getBrowsersList () {
  if (browserListCache !== void 0) {
    return browserListCache
  }

  try {
    browserListCache = browserslist(void 0, { path: appPaths.appDir })
    return browserListCache
  }
  catch (err) {
    warn(`${err.name}: ${err.message}`)
    fatal('Please revise /package.json > browserslist -- invalid entry!\n')
  }
}

function needsAdditionalPolyfills (ctx) {
  if (
    ctx.mode.electron ||
    ctx.mode.cordova ||
    ctx.mode.capacitor ||
    ctx.mode.capacitor
  ) {
    return false
  }

  return getBrowsersList().includes('ie 11')
}

function getSupportData () {
  const browsers = getBrowsersList()

  if (browsers.length === 0) {
    fatal('Please revise /package.json > browserslist -- no browsers specified!\n')
  }

  const versions = {}

  for (let entry of browsers) {
    const [ rawName, ver ] = entry.split(' ')
    const name = NAMES[rawName] || capitalize(rawName)

    if (versions[name]) {
      versions[name].push(ver)
    }
    else {
      versions[name] = [ ver ]
    }
  }

  const lines = []

  for (let name in versions) {
    let list = versions[name]
    list.sort((a, b) => parseFloat(a) - parseFloat(b))
    lines.push(` · ${name} >= ${list[0]}`)
  }

  return {
    coverage: browserslist.coverage(browsers).toFixed(2),
    lines
  }
}

function getBrowsersBanner () {
  if (browserBannerCache !== void 0) {
    return browserBannerCache
  }

  const { coverage, lines } = getSupportData()

  browserBannerCache = ` Configured browser support (at least ${coverage}% of global marketshare):\n` +
    lines.join('\n') + '\n'

  return browserBannerCache
}

module.exports.getBrowsersList = getBrowsersList
module.exports.needsAdditionalPolyfills = needsAdditionalPolyfills
module.exports.getBrowsersBanner = getBrowsersBanner
