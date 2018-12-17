const
  fs = require('fs'),
  logger = require('../helpers/logger'),
  log = logger('app:extension-manager'),
  warn = logger('app:extension-manager', 'red'),
  chalk = require('chalk'),
  appPaths = require('../app-paths')

const extensionPath = appPaths.resolve.app('quasar.extensions.json')

class ExtensionJson {
  constructor () {
    try {
      this.extensions = require(extensionPath)
    }
    catch (e) {
      this.extensions = {}
    }
  }

  list () {
    if (Object.keys(this.extensions).length === 0) {
      log(' No app cli extensions are installed')
      log(' You can look for "quasar-cli-extension-*" in npm registry.')
      return
    }

    log('Listing installed app cli extensions')
    log()

    for (let ext in this.extensions) {
      console.log(' Extension id: ' + chalk.green(ext))
      console.log(' Extension opts: ' + JSON.stringify(this.extensions[ext], null, 2))
      console.log()
    }
  }

  getList () {
    return this.extensions
  }

  add (extId, opts) {
    log(`Adding "${extId}" extension opts to /quasar.extensions.json ...`)
    this.extensions[extId] = opts
    this.__save()
  }

  remove (extId) {
    if (this.has(extId)) {
      log(`Removing "${extId}" extension opts from /quasar.extensions.json ...`)
      delete this.extensions[extId]
      this.__save()
    }
  }

  get (extId) {
    return this.extensions[extId] || {}
  }

  has (extId) {
    return this.extensions[extId] !== void 0
  }

  __save () {
    fs.writeFileSync(
      extensionPath,
      JSON.stringify(this.extensions, null, 2),
      'utf-8'
    )
  }
}

module.exports = new ExtensionJson()
