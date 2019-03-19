const
  fs = require('fs'),
  et = require('elementtree')

const
  appPaths = require('../app-paths'),
  logger = require('../helpers/logger'),
  log = logger('app:cordova-conf')
  warn = logger('app:cordova-conf', 'red')

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

      if (cfg.devServer.https && cfg.ctx.targetName === 'ios') {
        const node = root.find('name')
        if (node) {
          const filePath = appPaths.resolve.cordova(
            `platforms/ios/${node.text}/Classes/AppDelegate.m`
          )

          if (!fs.existsSync(filePath)) {
            warn()
            warn()
            warn()
            warn()
            warn(`AppDelegate.m not found. Your App will revoke the devserver's SSL certificate.`)
            warn(`Please report the cordova CLI version and cordova-ios package that you are using.`)
            warn(`Also, disable HTTPS from quasar.conf.js > devServer > https`)
            warn()
            warn()
            warn()
            warn()
          }
          else {
            this.iosDelegateFilePath = filePath
            this.iosDelegateOriginal = fs.readFileSync(this.iosDelegateFilePath, 'utf-8')

            // required for allowing devserver's SSL certificate on iOS
            if (this.iosDelegateOriginal.indexOf('allowsAnyHTTPSCertificateForHost') === -1) {
              this.iosDelegateNew = this.iosDelegateOriginal + `

@implementation NSURLRequest(DataController)
+ (BOOL)allowsAnyHTTPSCertificateForHost:(NSString *)host
{
    return YES;
}
@end
`
            }
          }
        }
      }
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

    if (this.iosDelegateOriginal && this.iosDelegateNew) {
      this.iosDelegateNew = this.iosDelegateOriginal
    }

    this.__save()
  }

  __save () {
    const content = this.doc.write({ indent: 4 })
    fs.writeFileSync(filePath, content, 'utf8')
    log('Updated Cordova config.xml')

    if (this.iosDelegateFilePath && this.iosDelegateNew) {
      fs.writeFileSync(this.iosDelegateFilePath, this.iosDelegateNew, 'utf8')
      log('Updated AppDelegate.m')
    }
  }
}

module.exports = CordovaConfig
