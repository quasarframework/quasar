import { join, dirname } from 'node:path'
import { existsSync } from 'node:fs'
import fse from 'fs-extra'

import { log } from './logger.js'

export async function regenerateTypesFeatureFlags (quasarConf) {
  // Flags must be available even in pure JS codebases,
  //    because boot and configure wrappers functions files will
  //    provide autocomplete based on them also to JS users
  // Flags files should be copied over, for every enabled mode,
  //    every time `quasar dev` and `quasar build` are run:
  //    this automatize the upgrade for existing codebases
  const { appPaths, mode } = quasarConf.ctx

  if (quasarConf.metaConf.hasStore === true) {
    const destFlagPath = appPaths.resolve.app(
      join(dirname(quasarConf.sourceFiles.store), 'store-flag.d.ts')
    )

    if (!existsSync(destFlagPath)) {
      fse.copySync(
        appPaths.resolve.cli('templates/store/store-flag.d.ts'),
        destFlagPath
      )
      log('"store" feature flag was missing and has been regenerated')
    }
  }

  for (const modeName of Object.keys(mode)) {
    if (modeName === 'spa' || mode[ modeName ] !== true) {
      continue
    }

    const destFlagPath = appPaths.resolve[ modeName ](`${ modeName }-flag.d.ts`)

    if (!existsSync(destFlagPath)) {
      fse.copySync(
        appPaths.resolve.cli(`templates/${ modeName }/${ modeName }-flag.d.ts`),
        destFlagPath
      )
      log(`"${ modeName }" feature flag was missing and has been regenerated`)
    }
  }
}
