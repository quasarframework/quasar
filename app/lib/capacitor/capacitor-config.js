const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')

const
  appPaths = require('../app-paths'),
  updateCapPkg = require('./update-cap-pkg'),
  logger = require('../helpers/logger'),
  log = logger('app:capacitor-conf')
  warn = logger('app:capacitor-conf', 'red')

class CapacitorConfig {
  prepare (cfg) {
    this.pkg = require(appPaths.resolve.app('package.json'))

    // Make sure there is an index.html, otherwise Capacitor will crash
    fse.ensureFileSync(appPaths.resolve.capacitor('www/index.html'))

    updateCapPkg(cfg)
    log(`Updated src-capacitor/package.json`)

    this.tamperedFiles = []

    const capJsonPath = this.__getCapJsonPath(cfg)
    const capJson = require(capJsonPath)

    this.tamperedFiles.push({
      path: capJsonPath,
      name: 'capacitor.config.json',
      content: this.__applyCapJson(cfg, capJson),
      originalContent: JSON.stringify(capJson, null, 2)
    })

    this.__save()
  }

  reset () {
    this.tamperedFiles.forEach(file => {
      file.content = file.originalContent
    })

    this.__save()
    this.tamperedFiles = []
  }

  __save () {
    this.tamperedFiles.forEach(file => {
      fs.writeFileSync(file.path, file.content, 'utf8')
      log(`Updated ${file.name}`)
    })
  }

  __getCapJsonPath (cfg) {
    let jsonPath

    if (cfg.ctx.platformName === 'android') {
      jsonPath = './android/app/src/main/assets/capacitor.config.json'
    }
    else if (cfg.ctx.platformName === 'ios') {
      jsonPath = './ios/App/App/capacitor.config.json'
    }
    else {
      jsonPath = './capacitor.config.json'
    }

    return path.join(appPaths.resolve.capacitor(jsonPath))
  }

  __applyCapJson (cfg, originalCapCfg) {
    const capJson = { ...originalCapCfg }

    capJson.appId = cfg.capacitor.id || this.pkg.capacitorId || this.pkg.cordovaId || 'org.quasar.cordova.app'
    capJson.appName = cfg.capacitor.appName || this.pkg.productName || 'Quasar App'
    capJson.bundledWebRuntime = false

    if (cfg.ctx.dev) {
      capJson.server = capJson.server || {}
      capJson.server.url = cfg.build.APP_URL
      // TODO androidScheme to HTTPS?
    }
    else {
      capJson.webDir = 'www'

      // ensure we don't run from a remote server
      if (capJson.server && capJson.server.url) {
        delete capJson.server.url
      }
    }

    return JSON.stringify(capJson, null, 2)
  }
}

module.exports = CapacitorConfig
