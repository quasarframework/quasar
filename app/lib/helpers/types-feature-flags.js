const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')

const { log } = require('./logger')
const getMode = require('../mode/index')
const appPaths = require('../app-paths')

function getStoreFlagPath(storeIndexPath) {
  return path.join(path.parse(storeIndexPath).dir, 'store-flag.d.ts')
}

module.exports = function regenerateTypesFeatureFlags(quasarConf) {
  // Flags must be available even in pure JS codebases,
  //    because boot and configure wrappers functions files will
  //    provide autocomplete based on them also to JS users
  // Flags files should be copied over, for every enabled mode,
  //    every time `quasar dev` and `quasar build` are run:
  //    this automatize the upgrade for existing codebases
  for (const feature of [
    'pwa',
    'cordova',
    'capacitor',
    'ssr',
    'store',
    'bex'
  ]) {
    const [isFeatureInstalled, sourceFlagPath, destFlagPath] = feature === 'store'
      ? [
        quasarConf.store,
        appPaths.resolve.cli('templates/store/ts/store-flag.d.ts'),
        appPaths.resolve.app(getStoreFlagPath(quasarConf.sourceFiles.store))
      ]
      : [
        getMode(feature).isInstalled,
        appPaths.resolve.cli(`templates/${feature}/${feature}-flag.d.ts`),
        appPaths.resolve[feature](`${feature}-flag.d.ts`)
      ]

    if (isFeatureInstalled && !fs.existsSync(destFlagPath)) {
      fse.copySync(sourceFlagPath, destFlagPath)
      log(`'${feature}' feature flag was missing and has been regenerated`)
    }
  }
}
