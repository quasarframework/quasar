
const parseArgs = require('minimist')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    c: 'cmd',
    m: 'mode',

    d: 'depth',
    p: 'node:path',

    h: 'help'
  },
  boolean: [ 'h' ],
  string: [ 'c', 'm', 'p' ],
  default: {
    c: 'dev',
    m: 'spa',
    d: 5
  }
})

if (argv.help) {
  console.log(`
  Description
    Inspect Quasar generated Webpack config

  Usage
    $ quasar inspect
    $ quasar inspect -c build
    $ quasar inspect -m electron -p 'module.rules'

  Options
    --cmd, -c        Quasar command [dev|build] (default: dev)
    --mode, -m       App mode [spa|ssr|pwa|bex|cordova|capacitor|electron] (default: spa)
    --depth, -d      Number of levels deep (default: 5)
    --path, -p       Path of config in dot notation
                        Examples:
                          -p module.rules
                          -p plugins
    --help, -h       Displays this message
  `)
  process.exit(0)
}

const { ensureArgv } = require('../utils/ensure-argv.js')
ensureArgv(argv, 'inspect')

const { displayBanner } = require('../utils/banner.js')
displayBanner(argv, argv.cmd)

const { log, fatal } = require('../utils/logger.js')

if (argv.mode !== 'spa') {
  const { getQuasarMode } = require('../mode/index.js')
  if (getQuasarMode(argv.mode).isInstalled !== true) {
    fatal('Requested mode for inspection is NOT installed.')
  }
}

const { QuasarConfigFile } = require('../quasar-config-file.js')
const { splitWebpackConfig } = require('../webpack/symbols.js')

const depth = parseInt(argv.depth, 10) || Infinity

async function inspect () {
  const { extensionsRunner } = require('../app-extension/extensions-runner.js')
  const { getQuasarCtx } = require('../utils/get-quasar-ctx.js')

  const ctx = getQuasarCtx({
    mode: argv.mode,
    target: argv.mode === 'cordova' || argv.mode === 'capacitor'
      ? 'android'
      : void 0,
    debug: argv.debug,
    dev: argv.cmd === 'dev',
    prod: argv.cmd === 'build'
  })

  // register app extensions
  await extensionsRunner.registerExtensions(ctx)

  const quasarConfFile = new QuasarConfigFile(ctx)

  const { webpackConf } = await quasarConfFile.read()

  const util = require('node:util')
  const cfgEntries = splitWebpackConfig(webpackConf, argv.mode)

  if (argv.path) {
    const dot = require('dot-prop')
    cfgEntries.forEach(entry => {
      entry.webpack = dot.get(entry.webpack, argv.path)
    })
  }

  cfgEntries.forEach(cfgEntry => {
    console.log()
    log(`Showing Webpack config for "${ cfgEntry.name }" with depth of ${ depth }`)
    console.log()
    console.log(
      util.inspect(cfgEntry.webpack, {
        showHidden: true,
        depth,
        colors: true,
        compact: false
      })
    )
  })

  console.log(`\n  Depth used: ${ depth }. You can change it with "-d" parameter.\n`)
}

inspect()
