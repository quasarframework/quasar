import { getArgv } from '../utils/get-argv.js'
import { log } from '../utils/logger.js'

const argv = getArgv({
  entry: { type: 'boolean', short: 'e', default: false },
  cache: { type: 'boolean', short: 'c', default: false },
  dist: { type: 'boolean', short: 'd', default: false },
  qconf: { type: 'boolean', short: 'q', default: false },
  'no-color': { type: 'boolean' },
  help: { type: 'boolean', short: 'h' }
})

if (argv.help) {
  console.log(`
  Description
    Cleans all build artifacts
    (dev/build cache, /dist folder & entry points)

  Usage
    $ quasar clean

  Options
    --entry, -e    Cleans generated entry points only
    --cache, -c    Cleans dev/build cache only
    --dist, -d     Cleans /dist folder only
    --qconf, -q    Cleans temporary compiled quasar.config files
                      (used for issue investigation)
    --no-color     Disable colored output
    --help, -h     Displays this message
  `)

  argv.__warn?.()
  process.exit(0)
}

import fse from 'fs-extra'
import { getCtx } from '../utils/get-ctx.js'

const { appPaths } = getCtx()

console.log()

const cleanAll =
  argv.entry !== true &&
  argv.cache !== true &&
  argv.dist !== true &&
  argv.qconf !== true

if (cleanAll || argv.entry) {
  fse.removeSync(appPaths.resolve.app('.quasar'))
  log('Cleaned generated entry points')
}

if (cleanAll || argv.cache) {
  // remove ALL cache dirs (there is one per runType-mode-target combo;
  // appPaths.cacheDir would only point to the mode-less one)
  fse.removeSync(appPaths.resolve.app('node_modules/.q-cache'))
  log('Cleaned dev/build cache')
}

if (cleanAll || argv.dist) {
  // we empty the dist folder
  // (will not work if build > distDir was changed outside of it)
  fse.emptyDirSync(appPaths.resolve.app('dist'))
  log('Cleaned /dist folder')
}

if (cleanAll || argv.qconf) {
  const { globSync } = await import('tinyglobby')
  const fileList = globSync(['quasar.config.*.temporary.compiled.*'], {
    cwd: appPaths.appDir
  })

  fileList.forEach(file => {
    fse.removeSync(appPaths.resolve.app(file))
  })

  log(
    `Cleaned ${fileList.length} temporary compiled quasar.config file${fileList.length === 1 ? '' : 's'}`
  )
}

console.log()
