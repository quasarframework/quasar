const fs = require('fs')

const appPaths = require('../app-paths')
const { log, warn } = require('../helpers/logger')
const ssrExtensionFile = appPaths.resolve.ssr('extension.js')

class SsrExtension {
  isValid () {
    log(`Validating src-ssr/extension.js`)

    if (!fs.existsSync(ssrExtensionFile)) {
      warn(`[FAIL] Could not load src-ssr/extension.js file`)
      return false
    }

    try {
      this.getModule()
    }
    catch (e) {
      if (e.message !== 'NETWORK_ERROR') {
        console.log(e)
        warn(`src-ssr/extension.js has JS errors\n`)
      }

      return false
    }

    return true
  }

  // delete require's cache
  deleteCache () {
    Object.keys(require.cache).forEach(key => {
      if (key.startsWith(appPaths.srcDir)) {
        delete require.cache[key]
      }
    })
  }

  getModule () {
    return require(ssrExtensionFile)
  }
}

module.exports = new SsrExtension()
