const fs = require('fs')
const appPaths = require('../app-paths')

module.exports = function() {
  const mainActivityPath = appPaths.resolve.capacitor(
    'android/app/src/main/java/org/cordova/quasar/app/MainActivity.java'
  )
  const enableHttpsSelfSignedPath = appPaths.resolve.capacitor(
    'android/app/src/main/java/org/cordova/quasar/app/EnableHttpsSelfSigned.java'
  )

  if (fs.existsSync(mainActivityPath)) {
    // Allow unsigned certificates in MainActivity
    let mainActivity = fs.readFileSync(mainActivityPath, 'utf8')

    if (!/EnableHttpsSelfSigned\.enable/.test(mainActivity)) {
      mainActivity = mainActivity.replace(
        /this\.init\(.*}}\);/ms,
        match => `${match}
    if (BuildConfig.DEBUG) {
      EnableHttpsSelfSigned.enable(findViewById(R.id.webview));
    }`
      )

      fs.writeFileSync(mainActivityPath, mainActivity, 'utf-8')
    }

    // Add helper file
    if (!fs.existsSync(enableHttpsSelfSignedPath)) {
      const appId = mainActivity.match(/package ([a-zA-Z\.]*);/)[1]
      fs.writeFileSync(
        enableHttpsSelfSignedPath,
        `package ${appId};
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
}
