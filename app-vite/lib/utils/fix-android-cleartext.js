const fs = require('node:fs')
const appPaths = require('../app-paths.js')

module.exports.fixAndroidCleartext = function fixAndroidCleartext (mode) {
  const androidManifestPath = appPaths.resolve[ mode ](
    mode === 'cordova'
      ? 'platforms/android/app/src/main/AndroidManifest.xml'
      : 'android/app/src/main/AndroidManifest.xml'
  )

  if (fs.existsSync(androidManifestPath)) {
    // Enable cleartext support in manifest
    let androidManifest = fs.readFileSync(androidManifestPath, 'utf8')

    if (androidManifest.indexOf('android:usesCleartextTraffic="true"') === -1) {
      androidManifest = androidManifest.replace(
        '<application',
        '<application\n        android:usesCleartextTraffic="true"'
      )

      fs.writeFileSync(androidManifestPath, androidManifest, 'utf-8')
    }
  }
}
