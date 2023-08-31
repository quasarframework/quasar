import parseArgs from 'minimist'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help'
  },
  boolean: [ 'h' ]
})

const extId = argv._[ 0 ]
const cmd = argv._[ 1 ]

if (!extId || argv.help) {
  console.log(`
  Description
    Run app extension provided commands

  Usage
    $ quasar run <extension-id> <cmd> [args, params]
    $ quasar <extension-id> <cmd> [args, params]

    $ quasar run iconify create pic -s --mark some_file
    $ quasar iconify create pic -s --mark some_file
        # Note: "iconify" is an example and not a real extension.
        # Looks for installed extension called "iconify"
        # (quasar-app-extension-iconify extension package)
        # and runs its custom defined "create" command
        # with "pic" argument and "-s --mark some_file" params

  Options
    --help, -h       Displays this message
  `)
  process.exit(0)
}

import { log, warn } from '../utils/logger.js'

function getArgv (argv) {
  const { _, ...params } = argv

  return {
    args: _.slice(2),
    params
  }
}

import { getCtx } from '../utils/get-ctx.js'
const { appExt } = getCtx()

const ext = appExt.getInstance(extId)

if (ext === void 0) {
  warn()
  warn(`"${ extId }" app extension is not installed`)
  warn()
  process.exit(1)
}

const hooks = await ext.run()

const list = () => {
  if (Object.keys(hooks.commands).length === 0) {
    warn(`"${ extId }" app extension has no commands registered`)
    return
  }

  log(`Listing "${ extId }" app extension commands`)
  log()

  for (const cmd in hooks.commands) {
    console.log(`  > ${ cmd }`)
  }

  console.log()
}

if (!cmd) {
  list()
  process.exit(0)
}
if (!hooks.commands[ cmd ]) {
  warn()
  warn(`"${ extId }" app extension has no command called "${ cmd }"`)
  warn()
  list()
  process.exit(1)
}

const command = hooks.commands[ cmd ]

log(`Running "${ extId }" > "${ cmd }" command`)
log()

await command(getArgv(argv))
