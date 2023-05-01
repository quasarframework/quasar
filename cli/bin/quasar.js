#!/usr/bin/env node

import '../lib/node-version-check.js'

import updateNotifier from 'update-notifier'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8')
)

updateNotifier({ pkg }).notify()

let cmd = process.argv[ 2 ]

if (cmd === 'create') {
  process.argv.splice(2, 1)
  import('../lib/cmd/create.js')
}
else if (cmd === 'serve') {
  process.argv.splice(2, 1)
  import('../lib/cmd/serve.js')
}
else if (cmd === 'upgrade') {
  process.argv.splice(2, 1)
  import('../lib/cmd/upgrade.js')
}
else {
  const { default: appPaths } = await import('../lib/app-paths.js')
  const { getPackagePath } = await import('../lib/get-package-path.js')

  const localFile = appPaths.appDir !== void 0
    ? (
        getPackagePath('@quasar/app-vite/bin/quasar') // Quasar 2.0
        || getPackagePath('@quasar/app-webpack/bin/quasar') // Quasar 2.0
        || getPackagePath('@quasar/app/bin/quasar') // legacy Quasar 1.0 & partial Quasar 2.0
        || getPackagePath('quasar-cli/bin/quasar') // legacy Quasar <1.0
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
      const { createRequire } = await import('node:module')
      const require = createRequire(import.meta.url)

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
          console.log(`${ pkg.name } v${ pkg.version }`)
          process.exit(0)
        }

        await import('../lib/cmd/help.js')

        const { fatal } = await import('../lib/logger.js')

        if (cmd.indexOf('-') === 0) {
          fatal('Command must come before the options', 'Error')
        }

        fatal(`Unknown command "${ cmd }"`, 'Error')
      }
    }
    else {
      cmd = 'help'
    }

    import(`../lib/cmd/${ cmd }.js`)
  }
}
