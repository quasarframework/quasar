const { log } = require('../utils/logger.js')
const { nodePackager } = require('../utils/node-packager.js')
const { getPackagePath } = require('./get-package-path.js')

module.exports.ensureVueDeps = function ensureVueDeps () {
  const packagesToInstall = [
    getPackagePath('vue') === void 0 ? 'vue@^3.0.0' : '',
    getPackagePath('vue-router') === void 0 ? 'vue-router@^4.0.0' : ''
  ].filter(p => p)

  if (packagesToInstall.length !== 0) {
    const deps = `dep${ packagesToInstall.length > 1 ? 's' : '' }`

    log()
    log(`Missing Vue ${ deps } (no longer auto supplied by @quasar/app-webpack). Installing...`)

    nodePackager.installPackage(packagesToInstall, { displayName: `Vue ${ deps }` })

    log()
    log(`Installed Vue ${ deps }. Now please run your Quasar command again.`)
    log()

    process.exit(0)
  }
}
