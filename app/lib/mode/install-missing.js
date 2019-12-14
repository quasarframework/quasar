const logger = require('../helpers/logger')
const warn = logger('app:mode', 'red')
const getMode = require('./index')

module.exports = function (mode, target) {
  const Mode = getMode(mode)

  if (Mode.isInstalled) {
    if (['cordova', 'capacitor'].includes(mode)) {
      Mode.addPlatform(target)
    }
    return
  }

  warn(`Quasar ${mode.toUpperCase()} is missing. Installing it...`)
  Mode.add(target)
}
