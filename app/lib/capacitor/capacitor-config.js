const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')

const appPaths = require('../app-paths')
const logger = require('../helpers/logger')
const log = logger('app:capacitor-conf')
const warn = logger('app:capacitor-conf', 'red')

const ensureConsistency = require('../capacitor/ensure-consistency')

class CapacitorConfig {
  prepare (cfg) {
    ensureConsistency()

    this.pkg = require(appPaths.resolve.app('package.json'))

    this.__updateCapPkg(cfg, this.pkg)
    log(`Updated src-capacitor/package.json`)

    this.tamperedFiles = []

    const capJsonPath = this.__getCapJsonPath(cfg)
    const capJson = require(capJsonPath)

    this.tamperedFiles.push({
      path: capJsonPath,
      name: 'capacitor.config.json',
      content: this.__updateCapJson(cfg, capJson),
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

  __updateCapJson (cfg, originalCapCfg) {
    const capJson = { ...originalCapCfg }

    capJson.appId = cfg.capacitor.id || this.pkg.capacitorId || this.pkg.cordovaId || 'org.quasar.cordova.app'
    capJson.appName = cfg.capacitor.appName || this.pkg.productName || 'Quasar App'
    capJson.bundledWebRuntime = false

    if (cfg.ctx.dev) {
      capJson.server = capJson.server || {}
      capJson.server.url = cfg.build.APP_URL
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

  __updateCapPkg (cfg, pkg) {
    const capPkgPath = appPaths.resolve.capacitor('package.json')
    const capPkg = require(capPkgPath)

    Object.assign(capPkg, {
      name: cfg.capacitor.appName || pkg.name,
      version: cfg.capacitor.version || pkg.version,
      description: cfg.capacitor.description || pkg.description,
      author: pkg.author
    })

    fs.writeFileSync(capPkgPath, JSON.stringify(capPkg, null, 2), 'utf-8')
  }

  prepareSSL (add, target) {
    if (target === 'ios') {
      this.__handleSSLonIOS(add)
    }
    else {
      this.__handleSSLonAndroid(add)
    }
  }

  __handleSSLonIOS (add) {
    const file = appPaths.resolve.capacitor('node_modules/@capacitor/ios/ios/Capacitor/Capacitor/CAPBridgeViewController.swift')
    const needle = 'public func getWebView() -> WKWebView {'
    const content = `
  // The following part was dynamically added by Quasar.
  // This should NOT be part of the app when building for production,
  // and it will be removed by Quasar automatically on "quasar build":
  public func webView(_ webView: WKWebView, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
    let cred = URLCredential(trust: challenge.protectionSpace.serverTrust!)
    completionHandler(.useCredential, cred)
  }

  `

    if (add) {
      this.__injectIntoFile(file, needle, content)
    }
    else {
      this.__removeFromFile(file, content)
    }
  }

  __injectIntoFile (file, needle, content) {
    const shortFilename = path.basename(file)

    const sslWarn = () => {
      warn()
      warn()
      warn()
      warn()
      warn(`${shortFilename} not found or content is unrecognized.`)
      warn(`Your App will revoke the devserver's SSL certificate.`)
      warn(`Please disable HTTPS from quasar.conf.js > devServer > https`)
      warn()
      warn()
      warn()
      warn()
    }

    if (!fs.existsSync(file)) {
      sslWarn()
      return
    }

    const originalContent = fs.readFileSync(file, 'utf-8')

    if (originalContent.indexOf(content) > -1) {
      // it's already there
      return
    }

    const index = originalContent.indexOf(needle)

    if (index === -1) {
      sslWarn()
      return
    }

    const newContent = originalContent.substring(0, index) + content + originalContent.substring(index)

    fs.writeFileSync(file, newContent, 'utf-8')
  }

  __removeFromFile (file, content) {
    if (!fs.existsSync(file)) {
      return
    }

    const originalContent = fs.readFileSync(file, 'utf-8')
    const index = originalContent.indexOf(content)

    if (index > -1) {
      const newContent = originalContent.replace(content, '')
      fs.writeFileSync(file, newContent, 'utf-8')
    }
  }

  __handleSSLonAndroid (add) {
    const mainActivityPath = appPaths.resolve.capacitor(
      'android/app/src/main/java/org/cordova/quasar/app/MainActivity.java'
    )
    const enableHttpsSelfSignedPath = appPaths.resolve.capacitor(
      'android/app/src/main/java/org/cordova/quasar/app/EnableHttpsSelfSigned.java'
    )
    if (fs.existsSync(mainActivityPath)) {
      let mainActivity = fs.readFileSync(mainActivityPath, 'utf8')

      const sslString = `
    if (BuildConfig.DEBUG) {
      EnableHttpsSelfSigned.enable(findViewById(R.id.webview));
    }
      `

      if (add) {
        // Allow unsigned certificates in MainActivity
        if (!/EnableHttpsSelfSigned\.enable/.test(mainActivity)) {
          mainActivity = mainActivity.replace(
            /this\.init\(.*}}\);/ms,
            match => `${match}
${sslString}
              `
          )
        }

        // Add helper file
        if (!fs.existsSync(enableHttpsSelfSignedPath)) {
          const appId = mainActivity.match(/package ([a-zA-Z\.]*);/)[1]
          fs.writeFileSync(
            enableHttpsSelfSignedPath,
            `
package ${appId};
import android.net.http.SslError;
import android.webkit.SslErrorHandler;
import android.webkit.WebView;
import android.webkit.WebViewClient;
public class EnableHttpsSelfSigned {
  public static void enable(WebView webview) {
    webview.setWebViewClient(new WebViewClient() {
      @Override
      public void onReceivedSslError(WebView view, final SslErrorHandler handler, SslError error) {
        handler.proceed();
      }
    });
  }
}`
          )
        }
      }
      else {
        if (/EnableHttpsSelfSigned\.enable/.test(mainActivity)) {
          mainActivity = mainActivity.replace(sslString, '')
        }

        if (fs.existsSync(enableHttpsSelfSignedPath)) {
          fs.unlinkSync(enableHttpsSelfSignedPath)
        }
      }

      fs.writeFileSync(mainActivityPath, mainActivity, 'utf-8')
    }
  }
}

module.exports = CapacitorConfig
