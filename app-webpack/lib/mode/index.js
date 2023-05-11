const { fatal } = require('../helpers/logger.js')

module.exports = function (mode) {
  if (![ 'pwa', 'cordova', 'capacitor', 'electron', 'ssr', 'bex' ].includes(mode)) {
    fatal(`Unknown mode specified: ${ mode }`)
  }

  const QuasarMode = require(`./mode-${ mode }.js`)
  return new QuasarMode()
}
