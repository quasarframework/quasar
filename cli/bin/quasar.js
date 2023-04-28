#!/usr/bin/env node

import '../lib/node-version-check.js'

import updateNotifier from 'update-notifier'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8')
)

updateNotifier({ pkg }).notify()

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

function getQuasarAppExecutable (which, root) {
  try {
    return require.resolve(which, {
      paths: [ root ]
    })
  }
  catch (e) {
    return false
  }
}

let cmd = process.argv[2]

if (cmd === 'create') {
  process.argv.splice(2, 1)
  import(`../lib/cmd/create.js`)
}
else if (cmd === 'serve') {
  process.argv.splice(2, 1)
  import(`../lib/cmd/serve.js`)
}
else if (cmd === 'upgrade') {
  process.argv.splice(2, 1)
  import(`../lib/cmd/upgrade.js`)
}
else {
  const { getProjectRoot } = await import('../lib/get-project-root.js')
  const root = getProjectRoot()

  const localFile = root
    ? (
      getQuasarAppExecutable('@quasar/app-vite/bin/quasar', root) || // Quasar 2.0
      getQuasarAppExecutable('@quasar/app-webpack/bin/quasar', root) || // Quasar 2.0
      getQuasarAppExecutable('@quasar/app/bin/quasar', root) || // legacy Quasar 1.0 & partial Quasar 2.0
      getQuasarAppExecutable('quasar-cli/bin/quasar', root) // legacy Quasar <1.0
    )
    : void 0

  if (localFile) {
    process.env.QUASAR_CLI_VERSION = pkg.version

    global.quasarCli = {
      help: `
    upgrade       Check (and optionally) upgrade Quasar packages
                    from a Quasar project folder
    serve         Create an ad-hoc server on App's distributables
`
    }

    // deferring to locally installed Quasar CLI
    if (localFile.endsWith('.js')) {
      // local CLI is in ESM format by convention
      import(localFile)
    }
    else {
      // local CLI is in legacy CJS format
      require(localFile)
    }
  }
  else {
    const commands = [
      'info',
      'help'
    ]

    if (cmd) {
      if (cmd === '-h') {
        cmd = 'help'
      }
      else if (cmd === 'i') {
        cmd = 'info'
      }

      if (commands.includes(cmd)) {
        process.argv.splice(2, 1)
      }
      else {
        if (cmd === '-v' || cmd === '--version' || cmd === '-V') {
          console.log(pkg.version)
          process.exit(0)
        }

        await import(`../lib/cmd/help.js`)

        const { red } = await import('kolorist')
        console.log(`\n ${red(`Error`)} Unknown command "${ cmd }"`)

        if (cmd.indexOf('-') === 0) {
          console.log(`\n ${red(`Error`)} Command must come before the options`)
        }

        console.log()
        process.exit(1)
      }
    }
    else {
      cmd = 'help'
    }

    import(`../lib/cmd/${cmd}.js`)
  }
}
