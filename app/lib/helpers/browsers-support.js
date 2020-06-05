const browserslist = require('browserslist')
const appPaths = require('../app-paths')

function getBrowsersList () {
  return browserslist(void 0, { path: appPaths.appDir })
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

module.exports.getBrowsersList = getBrowsersList
module.exports.supportsIE = supportsIE
module.exports.needsAdditionalPolyfills = needsAdditionalPolyfills
