const parseArgs = require('minimist')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    c: 'cmd',
    m: 'mode',

    d: 'depth',
    p: 'path',

    t: 'thread',

    h: 'help'
  },
  boolean: [ 'h' ],
  string: [ 'c', 'm', 'p', 't' ],
  default: {
    c: 'dev',
    m: 'spa',
    d: 2
  }
})

if (argv.help) {
  console.log(`
  Description
    Inspect Quasar generated Vite config

  Usage
    $ quasar inspect
    $ quasar inspect -c build
    $ quasar inspect -m electron -p 'build.outDir'

  Options
    --cmd, -c        Quasar command [dev|build] (default: dev)
    --mode, -m       App mode [spa|ssr|pwa|bex|cordova|capacitor|electron] (default: spa)
    --depth, -d      Number of levels deep (default: 2)
    --path, -p       Path of config in dot notation
                        Examples:
                          -p module.rules
                          -p plugins
    --thread, -t     Display only one specific app mode config thread
    --help, -h       Displays this message
  `)
  process.exit(0)
}

require('../helpers/ensure-argv')(argv, 'inspect')
require('../helpers/banner-global')(argv, argv.cmd)

const { log, fatal } = require('../helpers/logger')
const { isInstalled } = require(`../modes/${ argv.mode }/${ argv.mode }-installation`)

if (isInstalled() !== true) {
  fatal('Requested mode for inspection is NOT installed.')
}

const depth = parseInt(argv.depth, 10) || Infinity

async function inspect () {
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

  const extensionRunner = require('../app-extension/extensions-runner')
  await extensionRunner.registerExtensions(ctx)

  const QuasarConfFile = require('../quasar-config-file')
  const quasarConfFile = new QuasarConfFile({
    ctx,
    port: argv.port,
    host: argv.hostname
  })

  const quasarConf = await quasarConfFile.read()
  if (quasarConf.error !== void 0) {
    fatal(quasarConf.error, 'FAIL')
  }

  const generateConfig = require(`../modes/${ argv.mode }/${ argv.mode }-config`)

  const cfgEntries = []
  let threadList = Object.keys(generateConfig)

  if (argv.thread) {
    if (threadList.includes(argv.thread) === false) {
      fatal('Requested thread for inspection is NOT available for selected mode.')
    }

    threadList = [ argv.thread ]
  }

  for (const name of threadList) {
    cfgEntries.push({
      name,
      object: await generateConfig[ name ](quasarConf)
    })
  }

  if (argv.path) {
    const dot = require('dot-prop')
    cfgEntries.forEach(cfgEntry => {
      cfgEntry.object = dot.get(cfgEntry.object, argv.path)
    })
  }

  const util = require('util')

  cfgEntries.forEach(cfgEntry => {
    const tool = cfgEntry.object.configFile !== void 0
      ? 'Vite'
      : 'esbuild'

    console.log()
    log(`Showing "${ cfgEntry.name }" config (for ${ tool }) with depth of ${ depth }`)
    console.log()
    console.log(
      util.inspect(cfgEntry.object, {
        showHidden: true,
        depth,
        colors: true,
        compact: false
      })
    )
  })

  console.log(`\n  Depth used: ${ depth }. You can change it with "-d" / "--depth" parameter.\n`)
}

inspect()
