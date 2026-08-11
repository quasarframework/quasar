import { getArgv } from '../utils/get-argv.js'

const argv = getArgv({
  cmd: { type: 'string', short: 'c', default: 'dev' },
  mode: { type: 'string', short: 'm', default: 'spa' },
  depth: { type: 'string', short: 'd', default: '2' },
  path: { type: 'string', short: 'p' },
  thread: { type: 'string', short: 't' },
  help: { type: 'boolean', short: 'h' },
  'no-color': { type: 'boolean' }
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
    --mode, -m       App mode [spa|ssr|ssg|pwa|bex|cordova|capacitor|electron] (default: spa)
    --depth, -d      Number of levels deep (default: 2)
    --path, -p       Path of config in dot notation
                        Examples:
                          -p build.outDir
                          -p server.port
                          -p plugins
    --thread, -t     Display only one specific app mode config thread
    --no-color       Disable colored output
    --help, -h       Displays this message
  `)

  argv.__warn?.()
  process.exit(0)
}

import { ensureArgv } from '../utils/ensure-argv.js'

ensureArgv(argv, 'inspect')

import { getCtx } from '../utils/get-ctx.js'

const ctx = getCtx({
  mode: argv.mode,
  target:
    argv.mode === 'cordova' || argv.mode === 'capacitor'
      ? 'android'
      : argv.mode === 'bex'
        ? 'chrome'
        : void 0,
  debug: argv.debug,
  dev: argv.cmd === 'dev',
  prod: argv.cmd === 'build'
})

import { displayBanner } from '../utils/banner.js'

await displayBanner({ argv, ctx, cmd: argv.cmd })

import { log, fatal } from '../utils/logger.js'

import { isModeInstalled } from '../modes/modes-utils.js'

if (isModeInstalled(ctx.appPaths, argv.mode) !== true) {
  fatal('Requested mode for inspection is NOT installed.')
}

const depth = Number.parseInt(argv.depth, 10) || Infinity

import { QuasarConfigFile } from '../quasar-config-file.js'

const quasarConfFile = new QuasarConfigFile({
  ctx,
  port: argv.port,
  host: argv.hostname
})

const quasarConf = await quasarConfFile.read()

const { modeConfig } = await import(
  `../modes/${argv.mode}/${argv.mode}-config.js`
)

const cfgEntries = []
let threadList = Object.keys(modeConfig)

if (argv.thread) {
  if (!threadList.includes(argv.thread)) {
    fatal('Requested thread for inspection is NOT available for selected mode.')
  }

  threadList = [argv.thread]
}

for (const name of threadList) {
  const object = await modeConfig[name](quasarConf)
  if (object !== null) {
    cfgEntries.push({
      name,
      object
    })
  }
}

if (argv.path) {
  const { getProperty } = await import('dot-prop')
  cfgEntries.forEach(cfgEntry => {
    cfgEntry.object = getProperty(cfgEntry.object, argv.path)
  })
}

import { inspect } from 'node:util'

cfgEntries.forEach(cfgEntry => {
  const tool = cfgEntry.object.configFile !== void 0 ? 'Vite' : 'Rolldown'

  console.log()
  log(`Showing "${cfgEntry.name}" config (for ${tool}) with depth of ${depth}`)
  console.log()
  console.log(
    inspect(cfgEntry.object, {
      showHidden: true,
      depth,
      colors: true,
      compact: false
    })
  )
})

console.log(
  `\n  Depth used: ${depth}. You can change it with "-d" / "--depth" parameter.\n`
)
