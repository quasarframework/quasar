const parseArgs = require('minimist')

const { log } = require('../utils/logger.js')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help',
    e: 'entry',
    c: 'cache',
    d: 'dist',
    q: 'qconf'
  },
  boolean: [ 'h', 'e', 'c', 'd', 'q' ],
  default: {
    e: false,
    c: false,
    d: false,
    q: false
  }
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
    --help, -h     Displays this message
  `)
  process.exit(0)
}

const fse = require('fs-extra')
const { getCtx } = require('../utils/get-ctx.js')

const { appPaths } = getCtx()

console.log()

const cleanAll = (
  argv.entry !== true
  && argv.cache !== true
  && argv.dist !== true
  && argv.qconf !== true
)

if (cleanAll === true || argv.entry === true) {
  fse.removeSync(appPaths.resolve.app('.quasar'))
  log('Cleaned generated entry points')
}

if (cleanAll === true || argv.cache === true) {
  fse.removeSync(appPaths.cacheDir)
  log('Cleaned dev/build cache')
}

if (cleanAll === true || argv.dist === true) {
  // we empty the dist folder
  // (will not work if build > distDir was changed outside of it)
  fse.emptyDirSync(appPaths.resolve.app('dist'))
  log('Cleaned /dist folder')
}

if (cleanAll === true || argv.qconf === true) {
  const fglob = require('fast-glob')
  const fileList = fglob.sync([ 'quasar.config.*.temporary.compiled.*' ], { cwd: appPaths.appDir })

  fileList.forEach(file => {
    fse.removeSync(
      appPaths.resolve.app(file)
    )
  })

  log(`Cleaned ${ fileList.length } temporary compiled quasar.config file${ fileList.length === 1 ? '' : 's'}`)
}

console.log()
