import { getArgv } from '../utils/get-argv.js'
import { createPromptSession, fatal, log, warn } from '../utils/logger.js'

const argv = getArgv({
  yes: { type: 'boolean', short: 'y', default: false },
  'no-color': { type: 'boolean' },
  help: { type: 'boolean', short: 'h' }
})

function showHelp() {
  console.log(`
  Description
    Add/Remove support for PWA / BEX / Cordova / Capacitor / Electron modes.

  Usage
    $ quasar mode [add|remove] [pwa|ssr|ssg|bex|cordova|capacitor|electron] [--yes]

    # determine what modes are currently installed:
    $ quasar mode

  Options
    --yes, -y     Skips the "Are you sure?" question
                  when removing a Quasar mode
    --no-color    Disable colored output
    --help, -h    Displays this message
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
import { isModeInstalled } from '../modes/modes-utils.js'

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

  if (action === 'add') {
    const { addMode } = await import(`../modes/${mode}/${mode}-installation.js`)
    await addMode({ ctx })
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
