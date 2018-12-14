const
  fs = require('fs'),
  path = require('path'),
  appPaths = require('../app-paths'),
  log = require('../helpers/logger')('app:cordova-conf')
  et = require('elementtree')

const filePath = appPaths.resolve.cordova('config.xml')

function setFields (root, cfg) {
  Object.keys(cfg).forEach(key => {
    const
      el = root.find(key),
      values = cfg[key],
      isObject = Object(values) === values

    if (!el) {
      if (isObject) {
        et.SubElement(root, key, values)
      }
      else {
        let entry = et.SubElement(root, key)
        entry.text = values
      }
    }
    else {
      if (isObject) {
        Object.keys(values).forEach(key => {
          el.set(key, values[key])
        })
      }
      else {
        el.text = values
      }
    }
  })
}

class CordovaConfig {
  prepare (cfg) {
    this.doc = et.parse(fs.readFileSync(filePath, 'utf-8'))
    this.pkg = require(appPaths.resolve.app('package.json'))
    this.APP_URL = cfg.build.APP_URL

    const root = this.doc.getroot()

    root.set('id', cfg.cordova.id || this.pkg.cordovaId || 'org.quasar.cordova.app')
    root.set('version', cfg.cordova.version || this.pkg.version)

    if (cfg.cordova.androidVersionCode) {
      root.set('android-versionCode', cfg.cordova.androidVersionCode)
    }

    setFields(root, {
      content: { src: this.APP_URL },
      description: cfg.cordova.description || this.pkg.description
    })

    if (this.APP_URL !== 'index.html' && !root.find(`allow-navigation[@href='${this.APP_URL}']`)) {
      et.SubElement(root, 'allow-navigation', { href: this.APP_URL })
    }

    this.__save()
  }

  reset () {
    if (!this.APP_URL || this.APP_URL === 'index.html') {
      return
    }

    const root = this.doc.getroot()

    root.find('content').set('src', 'index.html')

    const nav = root.find(`allow-navigation[@href='${this.APP_URL}']`)
    if (nav) {
      root.remove(nav)
    }

    this.__save()
  }

  __save () {
    const content = this.doc.write({ indent: 4 })
    fs.writeFileSync(filePath, content, 'utf8')
    log('Updated Cordova config.xml')
  }
}

module.exports = CordovaConfig
