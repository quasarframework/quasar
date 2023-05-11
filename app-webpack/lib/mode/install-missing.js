const { warn } = require('../helpers/logger.js')
const getMode = require('./index.js')

module.exports = async function (mode, target) {
  const Mode = getMode(mode)

  if (Mode.isInstalled) {
    if ([ 'cordova', 'capacitor' ].includes(mode)) {
      Mode.addPlatform(target)
    }
    return
  }

  warn(`Quasar ${ mode.toUpperCase() } is missing. Installing it...`)
  await Mode.add(target)
}
