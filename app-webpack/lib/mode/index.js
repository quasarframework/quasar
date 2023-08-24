const { fatal } = require('../utils/logger.js')

module.exports.getQuasarMode = function getQuasarMode (mode) {
  if (![ 'pwa', 'cordova', 'capacitor', 'electron', 'ssr', 'bex' ].includes(mode)) {
    fatal(`Unknown mode specified: ${ mode }`)
  }

  const { QuasarMode } = require(`./mode-${ mode }.js`)
  return new QuasarMode()
}
