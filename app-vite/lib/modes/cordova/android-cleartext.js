const fs = require('fs')
const appPaths = require('../../app-paths')

/**
 * To be used for Capacitor v1 & v2 only
 */

module.exports = function fixAndroidCleartext (action) {
  const androidManifestPath = appPaths.resolve.cordova(
    'platforms/android/app/src/main/AndroidManifest.xml'
  )

  if (fs.existsSync(androidManifestPath) === false) return

  let androidManifest = fs.readFileSync(androidManifestPath, 'utf8')
  const hasCleartext = androidManifest.indexOf('android:usesCleartextTraffic="true"') !== -1

  if (action === 'add') {
    if (hasCleartext === false) {
      androidManifest = androidManifest.replace(
        '<application',
        '<application\n        android:usesCleartextTraffic="true"'
      )

      fs.writeFileSync(androidManifestPath, androidManifest, 'utf-8')
    }

    return
  }

  // else remove it
  if (hasCleartext === true) {
    androidManifest = androidManifest.replace(
      '        android:usesCleartextTraffic="true"\n',
      ''
    )

    fs.writeFileSync(androidManifestPath, androidManifest, 'utf-8')
  }
}
