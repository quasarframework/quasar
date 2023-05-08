const fs = require('fs')
const appPaths = require('../app-paths')

module.exports = function (mode) {
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
