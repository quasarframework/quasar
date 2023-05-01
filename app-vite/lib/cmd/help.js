console.log(
  require('fs').readFileSync(
    require('path').join(__dirname, '../../assets/logo.art'),
    'utf8'
  )
)

if (process.env.QUASAR_CLI_VERSION) {
  console.log('  Running @quasar/cli v' + process.env.QUASAR_CLI_VERSION)
}
console.log('  Running @quasar/app-vite v' + require('../../package.json').version)

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
    clean, c      Clean all build artifacts
    new, n        Quickly scaffold page/layout/component/... vue file
    mode, m       Add/remove Quasar Modes for your App
    inspect       Inspect Vite/esbuild configs used under the hood
                    - keeps into account your quasar.config.js
                      and your installed App Extensions
    ext, e        Manage Quasar App Extensions
    run, r        Run specific command provided by an installed
                    Quasar App Extension
    describe      Describe a Quasar API (component)
    test, t       Run @quasar/testing App Extension command
                    - requires @quasar/testing App Extension to be installed
                    - this is an alias command for convenience purposes
    info, i       Display info about your machine and your App
    help, h       Displays this message

  If the specified command is not found, then "quasar run"
  will be executed with the provided arguments.
`)

if (global.quasarCli) {
  console.log('  Commands supplied by @quasar/cli global installation:')
  console.log(global.quasarCli.help)
}
