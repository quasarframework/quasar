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
  and_uc: 'UC for Android'
}

function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getBrowsersList () {
  if (this.cache !== void 0) {
    return this.cache
  }

  try {
    this.cache = browserslist(void 0, { path: appPaths.appDir })
    return this.cache
  }
  catch (err) {
    warn(`${err.name}: ${err.message}`)
    fatal('Please revise /package.json > browserslist -- invalid entry!\n')
  }
}

function supportsIE () {
  const browsers = getBrowsersList()
  return browsers.includes('ie 11')
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

  return supportsIE()
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
    lines.push(` * ${name} >= ${list[0]}`)
  }

  return {
    coverage: browserslist.coverage(browsers).toFixed(2),
    lines
  }
}

function getBrowsersBanner () {
  if (this.cache !== void 0) {
    return this.cache
  }

  const { coverage, lines } = getSupportData()

  this.cache = ` Configured browser support (${coverage}% of global marketshare):\n` +
    lines.join('\n') + '\n'

  return this.cache
}

module.exports.getBrowsersList = getBrowsersList
module.exports.supportsIE = supportsIE
module.exports.needsAdditionalPolyfills = needsAdditionalPolyfills
module.exports.getBrowsersBanner = getBrowsersBanner