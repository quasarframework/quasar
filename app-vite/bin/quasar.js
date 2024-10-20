#!/usr/bin/env node

import '../lib/node-version-check.js'

const commands = [
  'dev',
  'build',
  'prepare',
  'clean',
  'inspect',
  'describe',
  'ext',
  'run',
  'mode',
  'info',
  'new',
  'help'
]

let cmd = process.argv[ 2 ]

if (cmd) {
  if (cmd.length === 1) {
    const mapToCmd = {
      d: 'dev',
      b: 'build',
      p: 'prepare',
      e: 'ext',
      r: 'run',
      c: 'clean',
      m: 'mode',
      i: 'info',
      n: 'new',
      h: 'help'
    }
    cmd = mapToCmd[ cmd ]
  }

  if (commands.includes(cmd)) {
    process.argv.splice(2, 1)
  }
  else {
    if (cmd === '-v' || cmd === '--version') {
      const { cliPkg } = await import('../lib/utils/cli-runtime.js')

      console.log(
        `${ cliPkg.name } ${ cliPkg.version }`
        + (process.env.QUASAR_CLI_VERSION ? ` (@quasar/cli ${ process.env.QUASAR_CLI_VERSION })` : '')
      )

      process.exit(0)
    }

    const { log, warn } = await import('../lib/utils/logger.js')

    if (cmd === '-h' || cmd === '--help') {
      cmd = 'help'
    }
    else if (cmd.indexOf('-') === 0) {
      warn('Command must come before the options')
      cmd = 'help'
    }
    else {
      log(`Looking for Quasar App Extension "${ process.argv[ 2 ] }" command${ (process.argv[ 3 ] && (' "' + process.argv[ 3 ] + '"')) || '' }`)

      const exit = process.exit
      process.exit = (code, reason) => {
        if (reason === 'ext-missing') {
          import('../lib/cmd/help.js').then(() => {
            exit(0)
          })
        }
        else {
          exit(code)
        }
      }

      cmd = 'run'
    }
  }
}
else {
  cmd = 'help'
}

import(`../lib/cmd/${ cmd }.js`)
