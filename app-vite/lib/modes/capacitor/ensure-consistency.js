import fs from 'node:fs'
import fse from 'fs-extra'

import appPaths from '../../app-paths.js'
import { nodePackager } from '../../utils/node-packager.js'

export function ensureWWW (forced) {
  const www = appPaths.resolve.capacitor('www')

  forced === true && fse.removeSync(www)

  if (!fs.existsSync(www)) {
    fse.copySync(
      appPaths.resolve.cli('templates/capacitor/www'),
      appPaths.resolve.capacitor('www')
    )
  }
}

export function ensureDeps () {
  if (fs.existsSync(appPaths.resolve.capacitor('node_modules'))) {
    return
  }

  nodePackager.install({
    cwd: appPaths.capacitorDir,
    displayName: 'Capacitor'
  })
}

export function ensureConsistency () {
  ensureWWW()
  ensureDeps()
}
