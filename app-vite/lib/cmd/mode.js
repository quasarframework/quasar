const parseArgs = require('minimist')

const { log, warn, fatal } = require('../helpers/logger')

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

const { green, gray } = require('kolorist')

async function run () {
  const [ action, mode ] = argv._

  if (![ 'add', 'remove' ].includes(action)) {
    console.log()
    warn(`Unknown action specified (${ action }).`)
    showHelp()
    process.exit(1)
  }

  if (![ undefined, 'pwa', 'cordova', 'capacitor', 'electron', 'ssr', 'bex' ].includes(mode)) {
    fatal(`Unknown mode "${ mode }" to ${ action }`)
  }

  const installation = require(`../modes/${ mode }/${ mode }-installation`)

  if (action === 'remove' && argv.yes !== true && installation.isInstalled()) {
    console.log()

    const inquirer = require('inquirer')
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

  await installation[ action ]()
}

function displayModes () {
  log('Detecting installed modes...')

  const info = []
  ;[ 'pwa', 'ssr', 'cordova', 'capacitor', 'electron', 'bex' ].forEach(mode => {
    const { isInstalled } = require(`../modes/${ mode }/${ mode }-installation`)
    info.push([
      `Mode ${ mode.toUpperCase() }`,
      isInstalled() ? green('yes') : gray('no')
    ])
  })

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
