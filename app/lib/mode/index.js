const warn = require('../helpers/logger')('app:quasar-mode', 'red')

module.exports = function (mode) {
  if (!['pwa', 'cordova', 'electron', 'ssr'].includes(mode)) {
    warn(`⚠️  Unknown mode specified: ${mode}`)
    process.exit(1)
  }

  const QuasarMode = require(`./mode-${mode}`)
  return new QuasarMode()
}
