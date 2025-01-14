import fs from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { globSync } from 'tinyglobby'
import { parseJSON, stringifyJSON } from 'confbox'

import { log, warn } from '../../utils/logger.js'
import { ensureConsistency } from './ensure-consistency.js'

// necessary for Capacitor 4+
import { getPackageJson } from '../../utils/get-package-json.js'

// for Capacitor 1-3
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

const sslSkipVersion = {
  4: '^0.2.0',
  5: '^0.3.0',
  6: '^0.4.0',
  default: '^0.4.0'
}

export class CapacitorConfigFile {
  #ctx
  #tamperedFiles = []

  async prepare (quasarConf, target) {
    this.#ctx = quasarConf.ctx

    const { appPaths, cacheProxy } = quasarConf.ctx

    await ensureConsistency(this.#ctx)

    this.#updateCapPkg(quasarConf)
    log('Updated src-capacitor/package.json')

    this.#tamperedFiles = []

    // TODO: support other formats: .js and .ts
    const capJsonPath = appPaths.resolve.capacitor('capacitor.config.json')
    const capJson = parseJSON(
      fs.readFileSync(capJsonPath, 'utf-8')
    )

    const { capVersion } = await cacheProxy.getModule('capCli')

    this.#tamperedFiles.push({
      path: capJsonPath,
      name: 'capacitor.config.json',
      content: this.#updateCapJson(quasarConf, capJson, capVersion, target),
      originalContent: stringifyJSON(capJson)
    })

    this.#save()

    await this.#updateSSL(quasarConf, target, capVersion)
  }

  reset () {
    if (this.#tamperedFiles.length === 0) return

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

  #updateCapJson (quasarConf, originalCapCfg, capVersion, target) {
    const capJson = { ...originalCapCfg }

    capJson.appName = quasarConf.capacitor.appName || this.#ctx.pkg.appPkg.productName || 'Quasar App'

    if (capVersion < 5) {
      capJson.bundledWebRuntime = false
    }

    if (quasarConf.ctx.dev) {
      capJson.server = capJson.server || {}
      capJson.server.url = quasarConf.metaConf.APP_URL
      if (target === 'android' && capVersion >= 2) {
        capJson.server.cleartext = true
      }
    }
    else {
      capJson.webDir = 'www'

      // ensure we don't run from a remote server
      if (capJson.server) {
        delete capJson.server.url
        delete capJson.server.cleartext
      }
    }

    return stringifyJSON(capJson)
  }

  #updateCapPkg (quasarConf) {
    const {
      appPaths,
      pkg: { appPkg }
    } = this.#ctx

    const capPkgPath = appPaths.resolve.capacitor('package.json')
    const capPkg = parseJSON(
      fs.readFileSync(capPkgPath, 'utf-8')
    )

    Object.assign(capPkg, {
      name: quasarConf.capacitor.appName || appPkg.name,
      version: quasarConf.capacitor.version || appPkg.version,
      description: quasarConf.capacitor.description || appPkg.description,
      author: appPkg.author
    })

    fs.writeFileSync(capPkgPath, stringifyJSON(capPkg), 'utf-8')
  }

  async #updateSSL (quasarConf, target, capVersion) {
    const { appPaths, cacheProxy } = this.#ctx
    const add = quasarConf.ctx.dev ? quasarConf.devServer.https : false

    if (capVersion >= 4) {
      const hasPlugin = getPackageJson('@jcesarmobile/ssl-skip', appPaths.capacitorDir) !== void 0

      // nothing to do
      if (add ? hasPlugin : !hasPlugin) return

      const fn = `${ add ? '' : 'un' }installPackage`
      const version = sslSkipVersion[ capVersion ] || sslSkipVersion.default
      const nameParam = add ? `@jcesarmobile/ssl-skip@${ version }` : '@jcesarmobile/ssl-skip'

      const nodePackager = await cacheProxy.getModule('nodePackager')
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
      this.#handleSSLonAndroid(add, capVersion)
    }
  }

  // for Capacitor 1-3
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

  // for Capacitor 1-3
  #getIosCapacitorBridgeFile () {
    const { appPaths } = this.#ctx

    // we need to try multiple files because
    // @capacitor/ios changed the location during its v2
    const fileList = [
      'node_modules/@capacitor/ios/ios/Capacitor/Capacitor/CAPBridgeViewController.swift',
      'node_modules/@capacitor/ios/Capacitor/Capacitor/CAPBridgeViewController.swift'
    ]

    for (let i = 0; i < fileList.length; i++) {
      const file = appPaths.resolve.capacitor(fileList[ i ])
      if (fs.existsSync(file)) {
        return file
      }
    }
  }

  // for Capacitor 1-3
  #injectIntoFile (file, needle, content) {
    const sslWarn = () => {
      const shortFilename = basename(file)

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

  // for Capacitor 1-3
  #removeFromFile (file, content) {
    if (!file) return

    const originalContent = fs.readFileSync(file, 'utf-8')
    const index = originalContent.indexOf(content)

    if (index > -1) {
      const newContent = originalContent.replace(content, '')
      fs.writeFileSync(file, newContent, 'utf-8')
    }
  }

  // for Capacitor 1-3
  #handleSSLonAndroid (add, capVersion) {
    const { appPaths } = this.#ctx

    const capacitorSrcPath = appPaths.resolve.capacitor('android/app/src/main/java')
    let mainActivityPath = globSync('**/MainActivity.java', { cwd: capacitorSrcPath, absolute: true })

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

    const enableHttpsSelfSignedPath = join(dirname(mainActivityPath), 'EnableHttpsSelfSigned.java')

    if (fs.existsSync(mainActivityPath)) {
      let mainActivity = fs.readFileSync(mainActivityPath, 'utf8')

      const sslString = `
    if (BuildConfig.DEBUG) {
      EnableHttpsSelfSigned.enable(${ capVersion === 1 ? 'findViewById(R.id.webview)' : 'this.bridge' });
    }
      `

      if (add) {
        // Allow unsigned certificates in MainActivity
        if (!/EnableHttpsSelfSigned\.enable/.test(mainActivity)) {
          mainActivity = mainActivity.replace(
            /this\.init\(.*}}\);/ms,
            match => `${ match }
${ sslString }
              `
          )
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
