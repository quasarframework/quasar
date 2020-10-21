const fs = require('fs')
const path = require('path')

const appPaths = require('../app-paths')
const { log, warn } = require('../helpers/logger')
const ensureConsistency = require('./ensure-consistency')
const { capVersion } = require('./cap-cli')

function getAndroidMainActivity (capVersion, appId) {
  if (capVersion === 1) {
    return `
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
  }

  // capVersion > 1
  return `
package ${appId};
import android.net.http.SslError;
import android.webkit.SslErrorHandler;
import android.webkit.WebView;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeWebViewClient;

public class EnableHttpsSelfSigned {
  public static void enable(Bridge bridge) {
    bridge.getWebView().setWebViewClient(new BridgeWebViewClient(bridge) {
      @Override
      public void onReceivedSslError(WebView view, final SslErrorHandler handler, SslError error) {
        handler.proceed();
      }
    });
  }
}`
}
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

  __getIosCapacitorBridgeFile () {
    // we need to try multiple files because
    // @capacitor/ios changed the location during its v2
    const fileList = [
      'node_modules/@capacitor/ios/ios/Capacitor/Capacitor/CAPBridgeViewController.swift',
      'node_modules/@capacitor/ios/Capacitor/Capacitor/CAPBridgeViewController.swift'
    ]

    for (let i = 0; i < fileList.length; i++) {
      let file = appPaths.resolve.capacitor(fileList[i])
      if (fs.existsSync(file)) {
        return file
      }
    }
  }

  __handleSSLonIOS (add) {
    const file = this.__getIosCapacitorBridgeFile()
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
    const sslWarn = () => {
      const shortFilename = path.basename(file)

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

    if (!file) {
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
    if (!file) {
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
    const fglob = require('fast-glob')
    const capacitorSrcPath = appPaths.resolve.capacitor('android/app/src/main/java')
    let mainActivityPath = fglob.sync(`**/MainActivity.java`, { cwd: capacitorSrcPath, absolute: true })

    if (mainActivityPath.length > 0) {
      if (mainActivityPath.length > 1) {
        warn(`Found multiple matches for MainActivity.java file, https might not work. Using file ${mainActivityPath[0]}.`)
      }
      mainActivityPath = mainActivityPath[0]
    }
    else if (mainActivityPath.length === 0) {
      warn()
      warn('IMPORTANT! Could not find MainActivity.java file and therefore cannot enable devServer: https support.')
      warn()
      return
    }

    const enableHttpsSelfSignedPath = path.join(path.dirname(mainActivityPath), 'EnableHttpsSelfSigned.java')

    if (fs.existsSync(mainActivityPath)) {
      let mainActivity = fs.readFileSync(mainActivityPath, 'utf8')

      const sslString = `
    if (BuildConfig.DEBUG) {
      EnableHttpsSelfSigned.enable(${capVersion === 1 ? 'findViewById(R.id.webview)' : 'this.bridge'});
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
          const appId = mainActivity.match(/package ([\w\.]*);/)[1]

          fs.writeFileSync(
            enableHttpsSelfSignedPath,
            getAndroidMainActivity(capVersion, appId)
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
