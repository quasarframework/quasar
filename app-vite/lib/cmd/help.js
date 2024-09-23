import { readFileSync } from 'node:fs'

console.log(
  readFileSync(
    new URL('../../assets/logo.art', import.meta.url),
    'utf8'
  )
)

import { cliPkg } from '../utils/cli-runtime.js'

if (process.env.QUASAR_CLI_VERSION) {
  console.log('  Running @quasar/cli v' + process.env.QUASAR_CLI_VERSION)
}
console.log('  Running @quasar/app-vite v' + cliPkg.version)

console.log(`
  Example usage
    $ quasar <command> <options>

  Help for a command
    $ quasar <command> --help
    $ quasar <command> -h

  Options
    --version, -v Print Quasar App CLI version

  Commands
    dev, d        Start a dev server for your App
    build, b      Build your app for production
    prepare, p    Prepare the app for linting, type-checking, IDE integration, etc.
    clean, c      Clean dev/build cache, /dist folder & entry points
    new, n        Quickly scaffold page/layout/component/... vue file
    mode, m       Add/remove Quasar Modes for your App
    inspect       Inspect Vite/esbuild configs used under the hood
                    - keeps into account your quasar.config file
                      and your installed App Extensions
    ext, e        Manage Quasar App Extensions
    run, r        Run specific command provided by an installed
                    Quasar App Extension
    describe      Describe a Quasar API (component)
    info, i       Display info about your machine and your App
    help, h       Displays this message

  If the specified command is not found, then "quasar run"
  will be executed with the provided arguments.
`)

if (global.quasarCli) {
  console.log('  Commands supplied by @quasar/cli global installation:')
  console.log(global.quasarCli.help)
}
