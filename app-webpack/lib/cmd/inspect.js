
const parseArgs = require('minimist')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    c: 'cmd',
    m: 'mode',

    d: 'depth',
    p: 'path',

    h: 'help'
  },
  boolean: ['h'],
  string: ['c', 'm', 'p'],
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

require('../helpers/ensure-argv')(argv, 'inspect')
require('../helpers/banner')(argv, argv.cmd)

const { log, fatal } = require('../helpers/logger')

if (argv.mode !== 'spa') {
  const getMode = require('../mode/index')
  if (getMode(argv.mode).isInstalled !== true) {
    fatal('Requested mode for inspection is NOT installed.')
  }
}

const QuasarConfFile = require('../quasar-conf-file')
const { splitWebpackConfig } = require('../webpack/symbols')

const depth = parseInt(argv.depth, 10) || Infinity

async function inspect () {
  const extensionRunner = require('../app-extension/extensions-runner')
  const getQuasarCtx = require('../helpers/get-quasar-ctx')

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
  await extensionRunner.registerExtensions(ctx)

  const quasarConfFile = new QuasarConfFile(ctx)

  try {
    await quasarConfFile.prepare()
  }
  catch (e) {
    console.log(e)
    fatal('quasar.config.js has JS errors', 'FAIL')
  }

  await quasarConfFile.compile()

  const util = require('util')
  const cfgEntries = splitWebpackConfig(quasarConfFile.webpackConf, argv.mode)

  if (argv.path) {
    const dot = require('dot-prop')
    cfgEntries.forEach(entry => {
      entry.webpack = dot.get(entry.webpack, argv.path)
    })
  }

  cfgEntries.forEach(cfgEntry => {
    console.log()
    log(`Showing Webpack config for "${cfgEntry.name}" with depth of ${depth}`)
    console.log()
    console.log(
      util.inspect(cfgEntry.webpack, {
        showHidden: true,
        depth: depth,
        colors: true,
        compact: false
      })
    )
  })

  console.log(`\n  Depth used: ${depth}. You can change it with "-d" parameter.\n`)
}

inspect()
