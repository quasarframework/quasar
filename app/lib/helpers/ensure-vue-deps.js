const appPaths = require('../app-paths')
const { log, fatal } = require('../helpers/logger')
const { spawnSync } = require('../helpers/spawn')
const nodePackager = require('../helpers/node-packager')

const getPackagePath = require('./get-package-path')

module.exports = function () {
  const packagesToInstall = [
    getPackagePath('vue') === void 0 ? 'vue@^3.0.0' : '',
    getPackagePath('vue-router') === void 0 ? 'vue-router@^4.0.0' : ''
  ].filter(p => p)

  if (packagesToInstall.length !== 0) {
    const cmdParam = nodePackager === 'npm'
      ? [ 'install' ]
      : [ 'add' ]

    const deps = `dep${ packagesToInstall.length > 1 ? 's' : '' }`

    log()
    log(`Missing Vue ${ deps } (no longer auto supplied by @quasar/app). Installing...`)

    spawnSync(
      nodePackager,
      cmdParam.concat(packagesToInstall),
      { cwd: appPaths.appDir, env: { ...process.env, NODE_ENV: 'development' } },
      () => fatal(`Failed to install Vue ${ deps }`, 'FAIL')
    )

    log()
    log(`Installed Vue ${ deps }. Now please run your Quasar command again.`)
    log()

    process.exit(0)
  }
}
