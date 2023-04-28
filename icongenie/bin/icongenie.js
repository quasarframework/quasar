#!/usr/bin/env node

import '../lib/utils/node-version-check.js'

import updateNotifier from 'update-notifier'
import { packageJson } from '../lib/utils/package-json.js'

updateNotifier({ pkg: packageJson }).notify()

const commands = [
  'generate',
  'verify',
  'profile',
  'help'
]

let cmd = process.argv[ 2 ]

if (cmd && cmd.length === 1) {
  const mapToCmd = {
    g: 'generate',
    v: 'verify',
    p: 'profile',
    h: 'help'
  }
  cmd = mapToCmd[ cmd ]
}

import { warn } from '../lib/utils/logger.js'

if (cmd) {
  if (commands.includes(cmd)) {
    process.argv.splice(2, 1)
  }
  else {
    if (cmd === '-v' || cmd === '--version') {
      console.log(packageJson.version)
      process.exit(0)
    }

    if (cmd === '-h' || cmd === '--help') {
      cmd = 'help'
    }
    else if (cmd.indexOf('-') === 0) {
      warn()
      warn(`Command must come before the options`)
      cmd = 'help'
    }
    else {
      warn()
      warn(`Unknown command specified: "${ cmd }"`)
      cmd = 'help'
    }
  }
}
else {
  cmd = 'help'
}

console.log()
import(`../lib/cmd/${ cmd }.js`)
