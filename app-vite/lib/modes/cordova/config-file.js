import fs from 'node:fs'
import et from 'elementtree'

import { log, warn } from '../../utils/logger.js'
import { ensureConsistency } from './ensure-consistency.js'

function setFields (root, cfg) {
  Object.keys(cfg).forEach(key => {
    const el = root.find(key)
    const values = cfg[ key ]
    const isObject = Object(values) === values

    if (!el) {
      if (isObject) {
        et.SubElement(root, key, values)
      }
      else {
        const entry = et.SubElement(root, key)
        entry.text = values
      }
    }
    else {
      if (isObject) {
        Object.keys(values).forEach(key => {
          el.set(key, values[ key ])
        })
      }
      else {
        el.text = values
      }
    }
  })
}

export class CordovaConfigFile {
  #appURL
  #tamperedFiles
  #filePath
  #ctx

  prepare (quasarConf) {
    const { ctx } = quasarConf
    const { appPaths } = ctx

    ensureConsistency({ appPaths })

    this.#ctx = ctx
    this.#filePath = appPaths.resolve.cordova('config.xml')

    const doc = et.parse(fs.readFileSync(this.#filePath, 'utf-8'))
    this.#appURL = quasarConf.metaConf.APP_URL
    this.#tamperedFiles = []

    const root = doc.getroot()
    const { appPkg } = ctx.pkg

    root.set('version', quasarConf.cordova.version || appPkg.version)

    if (quasarConf.cordova.androidVersionCode) {
      root.set('android-versionCode', quasarConf.cordova.androidVersionCode)
    }

    setFields(root, {
      content: { src: this.#appURL },
      description: quasarConf.cordova.description || appPkg.description
    })

    if (this.#appURL !== 'index.html' && !root.find(`allow-navigation[@href='${ this.#appURL }']`)) {
      et.SubElement(root, 'allow-navigation', { href: this.#appURL })

      if (quasarConf.devServer.https && quasarConf.ctx.targetName === 'ios') {
        const node = root.find('name')
        if (node) {
          this.#prepareAppDelegate(node)
          this.#prepareWkWebEngine(node)
        }
      }
    }

    // needed for QResizeObserver until ResizeObserver Web API is supported by all platforms
    if (!root.find('allow-navigation[@href=\'about:*\']')) {
      et.SubElement(root, 'allow-navigation', { href: 'about:*' })
    }

    this.#save(doc)
  }

  reset () {
    if (!this.#appURL || this.#appURL === 'index.html') {
      return
    }

    const doc = et.parse(fs.readFileSync(this.#filePath, 'utf-8'))
    const root = doc.getroot()

    root.find('content').set('src', 'index.html')

    const nav = root.find(`allow-navigation[@href='${ this.#appURL }']`)
    if (nav) {
      root.remove(nav)
    }

    this.#tamperedFiles.forEach(file => {
      file.content = file.originalContent
    })

    this.#save(doc)

    this.#tamperedFiles = []
  }

  #save (doc) {
    const content = doc.write({ indent: 4 })
    fs.writeFileSync(this.#filePath, content, 'utf8')
    log('Updated Cordova config.xml')

    this.#tamperedFiles.forEach(file => {
      fs.writeFileSync(file.path, file.content, 'utf8')
      log(`Updated ${ file.name }`)
    })
  }

  #prepareAppDelegate (node) {
    const appDelegatePath = this.#ctx.appPaths.resolve.cordova(
      `platforms/ios/${ node.text }/Classes/AppDelegate.m`
    )

    if (!fs.existsSync(appDelegatePath)) {
      warn()
      warn()
      warn()
      warn()
      warn('AppDelegate.m not found. Your App will revoke the devserver\'s SSL certificate.')
      warn('Please report the cordova CLI version and cordova-ios package that you are using.')
      warn('Also, disable HTTPS from quasar.config file > devServer > server > type: \'https\'')
      warn()
      warn()
      warn()
      warn()
    }
    else {
      const tamperedFile = {
        name: 'AppDelegate.m',
        path: appDelegatePath
      }

      tamperedFile.originalContent = fs.readFileSync(appDelegatePath, 'utf-8')

      // required for allowing devserver's SSL certificate on iOS
      if (tamperedFile.originalContent.indexOf('allowsAnyHTTPSCertificateForHost') === -1) {
        tamperedFile.content = tamperedFile.originalContent + `

@implementation NSURLRequest(DataController)
+ (BOOL)allowsAnyHTTPSCertificateForHost:(NSString *)host
{
return YES;
}
@end
`
        this.#tamperedFiles.push(tamperedFile)
      }
    }
  }

  #prepareWkWebEngine (node) {
    [
      'cordova-plugin-ionic-webview',
      'cordova-plugin-wkwebview-engine'
    ].forEach(plugin => {
      const wkWebViewEnginePath = this.#ctx.appPaths.resolve.cordova(
        `platforms/ios/${ node.text }/Plugins/${ plugin }/CDVWKWebViewEngine.m`
      )

      if (fs.existsSync(wkWebViewEnginePath)) {
        const tamperedFile = {
          name: `${ plugin } > CDVWKWebViewEngine.m`,
          path: wkWebViewEnginePath
        }

        tamperedFile.originalContent = fs.readFileSync(wkWebViewEnginePath, 'utf-8')

        // Credit: https://gist.github.com/PeterStegnar/63cb8c9a39a13265c3a855e24a33ca37#file-cdvwkwebviewengine-m-L68-L74
        // Enables untrusted SSL connection
        if (tamperedFile.originalContent.indexOf('SecTrustRef serverTrust = challenge.protectionSpace.serverTrust') === -1) {
          const lookupString = '@implementation CDVWKWebViewEngine'
          const insertIndex = tamperedFile.originalContent.indexOf(lookupString) + lookupString.length

          tamperedFile.content = tamperedFile.originalContent.substring(0, insertIndex) + `

  - (void)webView:(WKWebView *)webView
  didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge
  completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition disposition, NSURLCredential *credential))completionHandler {
  SecTrustRef serverTrust = challenge.protectionSpace.serverTrust;
  completionHandler(NSURLSessionAuthChallengeUseCredential, [NSURLCredential credentialForTrust:serverTrust]);
  }
  ` + tamperedFile.originalContent.substring(insertIndex)

          this.#tamperedFiles.push(tamperedFile)
        }
      }
    })
  }
}
