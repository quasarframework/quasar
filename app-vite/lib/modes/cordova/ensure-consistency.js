import { existsSync } from 'node:fs'
import fse from 'fs-extra'

import { spawnSync } from '../../utils/spawn.js'
import { log, fatal } from '../../utils/logger.js'

export function ensureWWW ({ appPaths, forced }) {
  const www = appPaths.resolve.cordova('www')

  forced === true && fse.removeSync(www)

  if (!existsSync(www)) {
    fse.copySync(
      appPaths.resolve.cli('templates/cordova/www'),
      www
    )
  }
}

export function ensureDeps ({ appPaths }) {
  if (existsSync(appPaths.resolve.cordova('node_modules'))) {
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

export function ensureConsistency (opts) {
  ensureWWW(opts)
  ensureDeps(opts)
}
