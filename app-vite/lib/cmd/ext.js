const parseArgs = require('minimist')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help'
  },
  boolean: [ 'h' ]
})

function showHelp () {
  console.log(`
  Description
    Manage Quasar App Extensions

  Usage
    # display list of installed extensions
    $ quasar ext

    # Add Quasar App Extension
    $ quasar ext add <ext-id>

    # Remove Quasar App Extension
    $ quasar ext remove <ext-id>

    # Add Quasar App Extension, but
    # skip installing the npm package
    # (assumes it's already installed)
    $ quasar ext invoke <ext-id>

    # Remove Quasar App Extension, but
    # skip uninstalling the npm package
    $ quasar ext uninvoke <ext-id>

  Options
    --help, -h       Displays this message
  `)
}

if (argv.help) {
  showHelp()
  process.exit(0)
}

const { warn } = require('../helpers/logger')

if (argv._.length !== 0 && argv._.length !== 2) {
  console.log()
  warn(`Wrong number of parameters (${ argv._.length }).`)
  showHelp()
  process.exit(1)
}

async function run (action, name) {
  const Extension = require('../app-extension/Extension')
  const extension = new Extension(name)

  await extension[
    action === 'add' || action === 'invoke'
      ? 'install'
      : 'uninstall'
  ](action === 'invoke' || action === 'uninvoke')
}

if (argv._.length === 0) {
  const extensionJson = require('../app-extension/extension-json')
  extensionJson.list()
}
else {
  const [ action, name ] = argv._

  if (![ 'add', 'remove', 'invoke', 'uninvoke' ].includes(action)) {
    console.log()
    warn(`Unknown action specified (${ action }).`)
    showHelp()
    process.exit(1)
  }

  run(action, name)
}
