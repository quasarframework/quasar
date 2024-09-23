import parseArgs from 'minimist'

import { log } from '../utils/logger.js'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help'
  },
  boolean: [ 'h' ]
})

if (argv.help) {
  console.log(`
  Description
    Prepare the app for linting, type-checking, IDE integration, etc.
    It will generate the relevant files such as '.quasar/tsconfig.json', types files, etc.
    Running 'quasar dev' or 'quasar build' will automatically handle this for you.
    Use this command for a lightweight alternative to dev/build. Useful in CI/CD pipelines.

  Usage
    $ quasar prepare

  Options
    --help, -h      Displays this message
  `)
  process.exit(0)
}

const { readFileSync } = await import('node:fs')

console.log(
  readFileSync(
    new URL('../../assets/logo.art', import.meta.url),
    'utf8'
  )
)

const { getCtx } = await import('../utils/get-ctx.js')
// ctx doesn't matter for this command
const ctx = getCtx({
  mode: 'spa',
  debug: false,
  prod: true
})

const { QuasarConfigFile } = await import('../quasar-config-file.js')
const quasarConfFile = new QuasarConfigFile({
  ctx,
  // host and port don't matter for this command
  port: 9000,
  host: 'localhost'
})

await quasarConfFile.init()

const quasarConf = await quasarConfFile.read()

const { generateTypes } = await import('../types-generator.js')
await generateTypes(quasarConf)

log('Generated tsconfig.json and types files in .quasar directory')
log('The app is now prepared for linting, type-checking, IDE integration, etc.')
