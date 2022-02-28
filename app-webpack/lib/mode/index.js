const { fatal } = require('../helpers/logger')

module.exports = function (mode) {
  if (!['pwa', 'cordova', 'capacitor', 'electron', 'ssr', 'bex'].includes(mode)) {
    fatal(`Unknown mode specified: ${mode}`)
  }

  const QuasarMode = require(`./mode-${mode}`)
  return new QuasarMode()
}
