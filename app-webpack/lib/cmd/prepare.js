const parseArgs = require('minimist')

const { log } = require('../utils/logger.js')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    s: 'silent',
    h: 'help'
  },
  boolean: ['s', 'h']
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
    --silent, -s    Suppress the startup banner
    --help, -h      Displays this message
  `)
  process.exit(0)
}

const { readFileSync } = require('node:fs')
const { join } = require('node:path')

if (!argv.silent) {
  console.log(readFileSync(join(__dirname, '../../assets/logo.art'), 'utf8'))
}

const { getCtx } = require('../utils/get-ctx.js')
// ctx doesn't matter for this command
const ctx = getCtx({
  mode: 'spa',
  debug: false,
  prod: true
})

const { QuasarConfigFile } = require('../quasar-config-file.js')
const quasarConfFile = new QuasarConfigFile({
  ctx,
  // host and port don't matter for this command
  port: 9000,
  host: 'localhost'
})

async function runPrepare() {
  await quasarConfFile.init()
  const quasarConf = await quasarConfFile.read()

  const { generateTypes } = require('../types-generator.js')
  generateTypes(quasarConf)

  log('Generated tsconfig.json and types files in .quasar directory')
  log(
    'The app is now prepared for linting, type-checking, IDE integration, etc.'
  )
}

runPrepare()
