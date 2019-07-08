const
  logger = require('../helpers/logger'),
  log = logger('app:mode'),
  warn = logger('app:mode', 'red'),
  getMode = require('./index')

module.exports = async function (mode, target) {
  const Mode = getMode(mode)

  if (Mode.isInstalled) {
    if (mode === 'cordova') {
      Mode.addPlatform(target)
    }
    return
  }

  warn(`Quasar ${mode.toUpperCase()} is missing. Installing it...`)
  await Mode.add(target)
}
