import parseArgs from 'minimist'

import { log, warn, fatal } from '../utils/logger.js'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    y: 'yes',
    h: 'help'
  },
  boolean: [ 'y', 'h' ]
})

function showHelp () {
  console.log(`
  Description
    Add/Remove support for PWA / BEX / Cordova / Capacitor / Electron modes.

  Usage
    $ quasar mode [add|remove] [pwa|ssr|bex|cordova|capacitor|electron] [--yes]

    # determine what modes are currently installed:
    $ quasar mode

  Options
    --yes, -y     Skips the "Are you sure?" question
                  when removing a Quasar mode
    --help, -h    Displays this message
  `)
  process.exit(0)
}

if (argv.help) {
  showHelp()
  process.exit(1)
}

if (argv._.length !== 0 && argv._.length !== 2) {
  console.log()
  warn(`Wrong number of parameters (${ argv._.length }).`)
  showHelp()
  process.exit(1)
}

import { green, gray } from 'kolorist'

import { getCtx } from '../utils/get-ctx.js'
import { generateTypes } from '../types-generator.js'

async function run () {
  const [ action, mode ] = argv._

  const ctx = getCtx({ mode })

  if (![ 'add', 'remove' ].includes(action)) {
    console.log()
    warn(`Unknown action specified (${ action }).`)
    showHelp()
    process.exit(1)
  }

  if (![ undefined, 'pwa', 'cordova', 'capacitor', 'electron', 'ssr', 'bex' ].includes(mode)) {
    fatal(`Unknown mode "${ mode }" to ${ action }`)
  }

  const { isModeInstalled, addMode, removeMode } = await import(`../modes/${ mode }/${ mode }-installation.js`)
  const actionMap = { add: addMode, remove: removeMode }

  if (action === 'remove' && argv.yes !== true && isModeInstalled(ctx.appPaths)) {
    console.log()

    const { default: inquirer } = await import('inquirer')
    const answer = await inquirer.prompt([ {
      name: 'go',
      type: 'confirm',
      message: `Will also remove /src-${ mode } folder. Are you sure?`,
      default: false
    } ])

    if (!answer.go) {
      console.log()
      console.log('⚠️  Aborted...')
      console.log()
      process.exit(0)
    }
  }

  await actionMap[ action ]({ ctx })

  // Ensure types are re-generated accordingly
  const { QuasarConfigFile } = await import('../quasar-config-file.js')
  const quasarConfFile = new QuasarConfigFile({
    ctx,
    // host and port don't matter for this command
    port: 9000,
    host: 'localhost'
  })
  await quasarConfFile.init()
  const quasarConf = await quasarConfFile.read()
  generateTypes(quasarConf)
}

async function displayModes () {
  const ctx = getCtx()

  log('Detecting installed modes...')

  const info = []
  for (const mode of [ 'pwa', 'ssr', 'cordova', 'capacitor', 'electron', 'bex' ]) {
    const { isModeInstalled } = await import(`../modes/${ mode }/${ mode }-installation.js`)
    info.push([
      `Mode ${ mode.toUpperCase() }`,
      isModeInstalled(ctx.appPaths) ? green('yes') : gray('no')
    ])
  }

  console.log(
    '\n'
    + info.map(msg => ' ' + msg[ 0 ].padEnd(16, '.') + ' ' + msg[ 1 ]).join('\n')
    + '\n'
  )
}

if (argv._.length === 2) {
  run()
}
else {
  displayModes()
}
