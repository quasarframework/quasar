import path from 'node:path'
import fs from 'node:fs'
import fse from 'fs-extra'

import { log } from './logger.js'
import appPaths from '../app-paths.js'

function getStoreFlagPath (storeIndexPath) {
  return path.join(path.parse(storeIndexPath).dir, 'store-flag.d.ts')
}

async function isInstalled (mode) {
  const { isModeInstalled } = await import(`../modes/${ mode }/${ mode }-installation.js`)
  return isModeInstalled()
}

export async function regenerateTypesFeatureFlags (quasarConf) {
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
    const [ isFeatureInstalled, sourceFlagPath, destFlagPath ] = feature === 'store'
      ? [
          quasarConf.store,
          appPaths.resolve.cli('templates/store/store-flag.d.ts'),
          appPaths.resolve.app(getStoreFlagPath(quasarConf.sourceFiles.store))
        ]
      : [
          await isInstalled(feature),
          appPaths.resolve.cli(`templates/${ feature }/${ feature }-flag.d.ts`),
          appPaths.resolve[ feature ](`${ feature }-flag.d.ts`)
        ]

    if (isFeatureInstalled && !fs.existsSync(destFlagPath)) {
      fse.copySync(sourceFlagPath, destFlagPath)
      log(`"${ feature }" feature flag was missing and has been regenerated`)
    }
  }
}
