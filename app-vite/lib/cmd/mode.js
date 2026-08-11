import { getArgv } from '../utils/get-argv.js'
import { createPromptSession, fatal, log, warn } from '../utils/logger.js'

const argv = getArgv({
  yes: { type: 'boolean', short: 'y', default: false },
  webserver: { type: 'string', short: 'w' },
  'filename-based-routing': { type: 'boolean' },
  'app-id': { type: 'string' },
  'app-name': { type: 'string' },
  'no-color': { type: 'boolean' },
  help: { type: 'boolean', short: 'h' }
})

function showHelp() {
  console.log(`
  Description
    Add/Remove support for PWA / BEX / Cordova / Capacitor / Electron modes.

  Usage
    $ quasar mode [add|remove] [pwa|ssr|ssg|bex|cordova|capacitor|electron] [--yes]

    # add SSR mode non-interactively:
    $ quasar mode add ssr --webserver hono

    # determine what modes are currently installed:
    $ quasar mode

  Options
    --yes, -y      Skips the "Are you sure?" question
                   when removing a Quasar mode
    --no-color     Disable colored output
    --help, -h     Displays this message

    The mode-specific options below make "quasar mode add" fully
    non-interactive. Without them, an interactive terminal gets a
    prompt while CI/non-interactive runs pick the listed default.

    ONLY when adding SSR mode:
    --webserver, -w  The production webserver to scaffold for
                       [hono|fastify|express|koa] (default: hono)

    ONLY when adding SSG mode:
    --filename-based-routing  Scaffold for filename-based routing
                                (default: not using it)

    ONLY when adding Cordova or Capacitor mode:
    --app-id       The application id to scaffold with
                     (default: org.cordova.quasar.app /
                      org.capacitor.quasar.app)

    ONLY when adding Capacitor mode:
    --app-name     The application display name to scaffold with
                     (default: package.json > productName or name)
  `)
}

if (argv.help) {
  showHelp()
  argv.__warn?.()
  process.exit(0)
}

if (argv._.length !== 0 && argv._.length !== 2) {
  console.log()
  warn(`Wrong number of parameters (${argv._.length}).`)
  showHelp()
  process.exit(1)
}

import { green, gray } from 'kolorist'

import { getCtx } from '../utils/get-ctx.js'
import { generateTypes } from '../types-generator.js'
import { isModeInstalled, ssrWebservers } from '../modes/modes-utils.js'

async function run() {
  const [action, mode] = argv._
  const ctx = getCtx({ mode: 'spa' })

  if (!['add', 'remove'].includes(action)) {
    console.log()
    warn(`Unknown action specified (${action}).`)
    showHelp()
    process.exit(1)
  }

  if (mode === 'spa') {
    warn('SPA mode is included by default. No need to add or remove it.')
    process.exit(1)
  }

  if (
    ![
      void 0,
      'pwa',
      'cordova',
      'capacitor',
      'electron',
      'ssr',
      'ssg',
      'bex'
    ].includes(mode)
  ) {
    fatal(`Unknown mode "${mode}" to ${action}`)
  }

  // the mode-specific "add" params; values are validated
  // by the respective mode installer
  const addOnlyParams = [
    ['webserver', ['ssr']],
    ['filename-based-routing', ['ssg']],
    ['app-id', ['cordova', 'capacitor']],
    ['app-name', ['capacitor']]
  ]

  for (const [param, validModes] of addOnlyParams) {
    if (
      argv[param] !== void 0 &&
      (action !== 'add' || !validModes.includes(mode))
    ) {
      fatal(
        `The --${param} parameter only applies to "quasar mode add ${validModes.join('" / "quasar mode add ')}"`
      )
    }
  }

  if (
    argv.webserver !== void 0 &&
    !ssrWebservers.some(entry => entry.value === argv.webserver)
  ) {
    fatal(
      `Unknown SSR webserver "${argv.webserver}". Valid values: ${ssrWebservers.map(entry => entry.value).join(' | ')}`
    )
  }

  if (action === 'add') {
    const { addMode } = await import(`../modes/${mode}/${mode}-installation.js`)
    await addMode({
      ctx,
      webserver: argv.webserver,
      filenameBasedRouting: argv['filename-based-routing'],
      appId: argv['app-id'],
      appName: argv['app-name']
    })
  } else if (action === 'remove') {
    if (!isModeInstalled(ctx.appPaths, mode)) {
      warn(`No ${mode.toUpperCase()} support detected. Aborting.`)
      return
    }

    const promptSession = await createPromptSession(
      `Removing ${mode.toUpperCase()} Mode...`
    )
    if (argv.yes !== true) {
      const { go } = await promptSession.prompt({
        go: () =>
          promptSession.confirm({
            message: `Will remove /src-${mode} folder. Are you sure?`,
            initialValue: false
          })
      })

      if (!go) {
        promptSession.cancel('Aborted by user')
        process.exit(1)
      }
    }

    const remTask = promptSession.taskLog({ title: `Removing /src-${mode}...` })
    const { default: fse } = await import('fs-extra')
    fse.removeSync(ctx.appPaths[`${mode}Dir`])
    remTask.success(`Removed /src-${mode}`)
    promptSession.end(`${mode.toUpperCase()} support was removed`)
  }

  // Ensure types are re-generated accordingly
  const { QuasarConfigFile } = await import('../quasar-config-file.js')
  const quasarConfFile = new QuasarConfigFile({
    ctx,
    // host and port don't matter for this command
    port: 9000,
    host: 'localhost'
  })

  const quasarConf = await quasarConfFile.read()
  generateTypes(quasarConf)
}

function displayModes() {
  log('Detecting installed modes...')

  const ctx = getCtx()
  const info = []

  for (const mode of [
    'pwa',
    'ssr',
    'ssg',
    'cordova',
    'capacitor',
    'electron',
    'bex'
  ]) {
    info.push([
      `Mode ${mode.toUpperCase()}`,
      isModeInstalled(ctx.appPaths, mode) ? green('yes') : gray('no')
    ])
  }

  console.log(
    '\n' +
      info.map(msg => ' ' + msg[0].padEnd(16, '.') + ' ' + msg[1]).join('\n') +
      '\n'
  )
}

if (argv._.length === 2) {
  // oxlint-disable-next-line unicorn/prefer-top-level-await
  run()
} else {
  displayModes()
}
