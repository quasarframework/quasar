const { warn } = require('../utils/logger.js')
const { getQuasarMode } = require('./index.js')

module.exports.installMissing = async function (mode, target) {
  const Mode = getQuasarMode(mode)

  if (Mode.isInstalled) {
    if ([ 'cordova', 'capacitor' ].includes(mode)) {
      Mode.addPlatform(target)
    }
    return
  }

  warn(`Quasar ${ mode.toUpperCase() } is missing. Installing it...`)
  await Mode.add(target)
}
