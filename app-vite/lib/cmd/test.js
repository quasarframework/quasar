const parseArgs = require('minimist')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    c: 'cmd',
    h: 'help'
  },
  boolean: [ 'h' ],
  string: [ 'c' ],
  default: {
    c: 'test'
  }
})

if (argv.help) {
  console.log(`
  Description
    Run @quasar/testing App Extension command.
    Requires @quasar/testing to be installed.

  Usage
    $ quasar test [args, params]

  Options
    --cmd, -c        Testing extension command
                       (default: 'test')
    --help, -h       Displays this message
  `)
  process.exit(0)
}

const { log, warn } = require('../helpers/logger')

function getArgv (argv) {
  const { _, ...allParams } = argv
  const { cmd, ...params } = allParams

  return {
    args: _.slice(2),
    params
  }
}

async function run () {
  const Extension = require('../app-extension/Extension')
  const extension = new Extension('@quasar/testing')

  const hooks = await extension.run()
  const command = hooks.commands[ argv.cmd ]

  const list = () => {
    if (Object.keys(hooks.commands).length === 0) {
      warn('"@quasar/testing" app extension has no commands registered')
      return
    }

    log('Listing "@quasar/testing" app extension commands')
    log()

    for (const cmd in hooks.commands) {
      console.log(`  > ${ cmd }`)
    }

    console.log()
  }

  if (!command) {
    warn()
    warn(`"@quasar/testing" app extension has no command called "${ argv.cmd }"`)
    warn()
    list()
    process.exit(1)
  }

  log(`Running "@quasar/testing" > "${ argv.cmd }" command`)
  log()

  await command(getArgv(argv))
}

run()
