const fs = require('fs')
const { log, fatal } = require('../helpers/logger')
const chalk = require('chalk')
const appPaths = require('../app-paths')

const extensionPath = appPaths.resolve.app('quasar.extensions.json')

class ExtensionJson {
  constructor () {
    if (!fs.existsSync(extensionPath)) {
      this.extensions = {}
      return
    }

    try {
      this.extensions = require(extensionPath)
    }
    catch (e) {
      console.log(e)
      fatal('quasar.extensions.json is malformed', 'FAIL')
    }
  }

  list () {
    if (Object.keys(this.extensions).length === 0) {
      log(' No App Extensions are installed')
      log(' You can look for "quasar-app-extension-*" in npm registry.')
      return
    }

    log('Listing installed App Extensions')
    log()

    for (let ext in this.extensions) {
      console.log('Extension name: ' + chalk.green(ext))
      console.log('Extension prompts: ' + JSON.stringify(this.extensions[ext], null, 2))
      console.log()
    }
  }

  getList () {
    return this.extensions
  }

  set (extId, opts) {
    log(`Updating /quasar.extensions.json for "${extId}" extension ...`)
    this.extensions[extId] = opts
    this.__save()
  }

  setInternal (extId, opts) {
    const cfg = this.get(extId)
    cfg.__internal = opts
    this.set(extId, cfg)
  }

  remove (extId) {
    if (this.has(extId)) {
      log(`Removing "${extId}" extension from /quasar.extensions.json ...`)
      delete this.extensions[extId]
      this.__save()
    }
  }

  get (extId) {
    return this.extensions[extId] || {}
  }

  getPrompts (extId) {
    const { __internal, ...prompts } = this.get(extId)
    return prompts
  }

  getInternal (extId) {
    const cfg = this.get(extId)
    return cfg.__internal || {}
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
