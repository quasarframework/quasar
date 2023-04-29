
import { readFileSync } from 'node:fs'
import { italic } from 'kolorist'

import { version } from '../version.js'

console.log()
console.log(
  readFileSync(
    new URL('../../assets/logo.art', import.meta.url),
    'utf8'
  )
)
console.log('  Running @quasar/cli v' + version)

console.log(`
  Example usage
    $ quasar <command> <options>

  Help for a command
    $ quasar <command> --help
    $ quasar <command> -h

  Options
    --version, -v Print Quasar CLI version

  Commands
    info      Display info about your machine
                   (and your App if in a project folder)
    upgrade   Check (and optionally) upgrade Quasar packages
                   from a Quasar project folder
    serve     Create an ad-hoc server on App's distributables
    help, -h  Displays this message

  --------------
  => IMPORTANT !
  => ${ italic('Trigger this inside of a Quasar project (and npm/yarn install) for more commands.') }
  --------------
`)
