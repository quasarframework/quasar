const fs = require('node:fs')
const path = require('node:path')

const appPaths = require('../app-paths.js')
const { appPkg } = require('../app-pkg.js')
const { log, warn } = require('../utils/logger.js')
const { ensureConsistency } = require('./ensure-consistency.js')
const { capVersion } = require('./cap-cli.js')

// necessary for Capacitor 4+
const { nodePackager } = require('../utils/node-packager.js')
const { getPackageJson } = require('../utils/get-package-json.js')

// Capacitor 1 & 2
function getAndroidMainActivity (capVersion, appId) {
  if (capVersion === 1) {
    return `
package ${ appId };
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

  // capVersion 2+
  return `
package ${ appId };
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
  #tamperedFiles

  prepare (quasarConf, target) {
    ensureConsistency()

    this.#updateCapPkg(quasarConf)
    log('Updated src-capacitor/package.json')

    this.#tamperedFiles = []

    const capJsonPath = appPaths.resolve.capacitor('capacitor.config.json')
    const capJson = require(capJsonPath)

    this.#tamperedFiles.push({
      path: capJsonPath,
      name: 'capacitor.config.json',
      content: this.#updateCapJson(quasarConf, capJson),
      originalContent: JSON.stringify(capJson, null, 2)
    })

    this.#save()
    this.#updateSSL(quasarConf, target)
  }

  reset () {
    this.#tamperedFiles.forEach(file => {
      file.content = file.originalContent
    })

    this.#save()
    this.#tamperedFiles = []
  }

  #save () {
    this.#tamperedFiles.forEach(file => {
      fs.writeFileSync(file.path, file.content, 'utf8')
      log(`Updated ${ file.name }`)
    })
  }

  #updateCapJson (quasarConf, originalCapCfg) {
    const capJson = { ...originalCapCfg }

    capJson.appName = quasarConf.capacitor.appName || appPkg.productName || 'Quasar App'

    if (capVersion < 5) {
      capJson.bundledWebRuntime = false
    }

    if (quasarConf.ctx.dev) {
      capJson.server = capJson.server || {}
      capJson.server.url = quasarConf.build.APP_URL
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

  #updateCapPkg (quasarConf) {
    const capPkgPath = appPaths.resolve.capacitor('package.json')
    const capPkg = require(capPkgPath)

    Object.assign(capPkg, {
      name: quasarConf.capacitor.appName || appPkg.name,
      version: quasarConf.capacitor.version || appPkg.version,
      description: quasarConf.capacitor.description || appPkg.description,
      author: appPkg.author
    })

    fs.writeFileSync(capPkgPath, JSON.stringify(capPkg, null, 2), 'utf-8')
  }

  #updateSSL (quasarConf, target) {
    const add = quasarConf.ctx.dev ? quasarConf.devServer.server.type === 'https' : false

    if (capVersion >= 4) {
      const hasPlugin = getPackageJson('@jcesarmobile/ssl-skip', appPaths.capacitorDir) !== void 0

      if (add ? hasPlugin : !hasPlugin) {
        // nothing to do
        return
      }

      const fn = `${ add ? '' : 'un' }installPackage`
      const nameParam = add ? '@jcesarmobile/ssl-skip@^0.2.0' : '@jcesarmobile/ssl-skip'

      nodePackager[ fn ](nameParam, {
        cwd: appPaths.capacitorDir,
        displayName: 'Capacitor (DEVELOPMENT ONLY) SSL support'
      })

      // make sure "cap sync" is run before triggering IDE or build
      return
    }

    if (target === 'ios') {
      this.#handleSSLonIOS(add)
    }
    else {
      this.#handleSSLonAndroid(add)
    }
  }

  #getIosCapacitorBridgeFile () {
    // we need to try multiple files because
    // @capacitor/ios changed the location during its v2
    const fileList = [
      'node_modules/@capacitor/ios/Capacitor/Capacitor/CAPBridgeViewController.swift',
      'node_modules/@capacitor/ios/ios/Capacitor/Capacitor/CAPBridgeViewController.swift'
    ]

    for (let i = 0; i < fileList.length; i++) {
      const file = appPaths.resolve.capacitor(fileList[ i ])
      if (fs.existsSync(file)) {
        return file
      }
    }
  }

  // Capacitor 1 & 2
  #handleSSLonIOS (add) {
    const file = this.#getIosCapacitorBridgeFile()
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
      this.#injectIntoFile(file, needle, content)
    }
    else {
      this.#removeFromFile(file, content)
    }
  }

  // Capacitor 1 & 2
  #injectIntoFile (file, needle, content) {
    const sslWarn = () => {
      const shortFilename = path.basename(file)

      warn()
      warn()
      warn()
      warn()
      warn(`${ shortFilename } not found or content is unrecognized.`)
      warn('Your App will revoke the devserver\'s SSL certificate.')
      warn('Please disable HTTPS from quasar.config file > devServer > server > type: \'https\'')
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

  // Capacitor 1 & 2
  #removeFromFile (file, content) {
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

  // Capacitor 1 & 2
  #handleSSLonAndroid (add) {
    const fglob = require('fast-glob')
    const capacitorSrcPath = appPaths.resolve.capacitor('android/app/src/main/java')
    let mainActivityPath = fglob.sync('**/MainActivity.java', { cwd: capacitorSrcPath, absolute: true })

    if (mainActivityPath.length > 0) {
      if (mainActivityPath.length > 1) {
        warn(`Found multiple matches for MainActivity.java file, https might not work. Using file ${ mainActivityPath[ 0 ] }.`)
      }
      mainActivityPath = mainActivityPath[ 0 ]
    }
    else if (mainActivityPath.length === 0) {
      warn()
      warn('IMPORTANT! Could not find MainActivity.java file and therefore cannot enable devServer > server > type: \'https\' support.')
      warn()
      return
    }

    const enableHttpsSelfSignedPath = path.join(path.dirname(mainActivityPath), 'EnableHttpsSelfSigned.java')

    if (fs.existsSync(mainActivityPath)) {
      let mainActivity = fs.readFileSync(mainActivityPath, 'utf8')

      const sslString = `
    if (BuildConfig.DEBUG) {
      EnableHttpsSelfSigned.enable(${ capVersion === 1 ? 'findViewById(R.id.webview)' : 'this.bridge' });
    }
      `

      if (add) {
        // Allow unsigned certificates in MainActivity
        if (capVersion >= 4) {
          if (!/super\.onCreate/.test(mainActivity)) {
            mainActivity = mainActivity.replace('{}',
            `{
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }
}`
            )
            mainActivity = mainActivity.replace('import com.getcapacitor.BridgeActivity;',
            `import android.os.Bundle;
import com.getcapacitor.BridgeActivity;`)
          }
          if (!/EnableHttpsSelfSigned\.enable/.test(mainActivity)) {
            mainActivity = mainActivity.replace(
              /super\.onCreate\(.*\);/ms,
              match => `${ match }
              ${ sslString }`
            )
          }
        }
        else {
          if (!/EnableHttpsSelfSigned\.enable/.test(mainActivity)) {
            mainActivity = mainActivity.replace(
              /this\.init\(.*}}\);/ms,
              match => `${ match }
  ${ sslString }
                `
            )
          }
        }

        // Add helper file
        if (!fs.existsSync(enableHttpsSelfSignedPath)) {
          const appId = mainActivity.match(/package ([\w\.]*);/)[ 1 ]

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

module.exports.CapacitorConfig = CapacitorConfig
