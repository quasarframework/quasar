const parseArgs = require('minimist')

const { log } = require('../utils/logger.js')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help',
    e: 'entry',
    c: 'cache',
    d: 'dist'
  },
  boolean: [ 'h', 'e', 'c', 'd' ],
  default: {
    e: false,
    c: false,
    d: false
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
    --help, -h     Displays this message
  `)
  process.exit(0)
}

const fse = require('fs-extra')
const { getCtx } = require('../utils/get-ctx.js')

const { appPaths } = getCtx()

console.log()

if (argv.entry !== true && argv.cache !== true && argv.dist !== true) {
  Object.assign(argv, {
    entry: true,
    cache: true,
    dist: true
  })
}

if (argv.entry === true) {
  fse.removeSync(appPaths.resolve.app('.quasar'))
  log('Cleaned generated entry points')
}

if (argv.cache === true) {
  fse.removeSync(appPaths.cacheDir)
  log('Cleaned dev/build cache')
}

if (argv.dist === true) {
  // we empty the dist folder
  // (will not work if build > distDir was changed outside of it)
  fse.emptyDirSync(appPaths.resolve.app('dist'))
  log('Cleaned /dist folder')
}

console.log()
