import fs from 'node:fs'
import fse from 'fs-extra'

import appPaths from '../../app-paths.js'
import { spawnSync } from '../../utils/spawn.js'
import { log, fatal } from '../../utils/logger.js'

export function ensureWWW (forced) {
  const www = appPaths.resolve.cordova('www')

  forced === true && fse.removeSync(www)

  if (!fs.existsSync(www)) {
    fse.copySync(
      appPaths.resolve.cli('templates/cordova'),
      appPaths.cordovaDir
    )
  }
}

export function ensureDeps () {
  if (fs.existsSync(appPaths.resolve.cordova('node_modules'))) {
    return
  }

  log('Installing dependencies in /src-cordova')
  spawnSync(
    'npm',
    [ 'install' ],
    { cwd: appPaths.cordovaDir, env: { ...process.env, NODE_ENV: 'development' } },
    () => {
      fatal('npm failed installing dependencies in /src-cordova', 'FAIL')
    }
  )
}

export function ensureConsistency () {
  ensureWWW()
  ensureDeps()
}
