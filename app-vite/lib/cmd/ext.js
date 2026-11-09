import { getArgv } from '../utils/get-argv.js'

const argv = getArgv({
  'no-color': { type: 'boolean' },
  help: { type: 'boolean', short: 'h' }
})

function showHelp() {
  console.log(`
  Description
    Manage Quasar App Extensions

  Usage
    # display list of installed extensions
    $ quasar ext

    # Add Quasar App Extension
    $ quasar ext add <ext-id>

    # Remove Quasar App Extension
    $ quasar ext remove <ext-id>

    # Add Quasar App Extension, but
    # skip installing the npm package
    # (assumes it's already installed)
    $ quasar ext invoke <ext-id>

    # Remove Quasar App Extension, but
    # skip uninstalling the npm package
    $ quasar ext uninvoke <ext-id>

  Options
    --no-color   Disable colored output
    --help, -h   Displays this message
  `)
}

if (argv.help) {
  showHelp()
  argv.__warn?.()
  process.exit(0)
}

import { dot, log, warn } from '../utils/logger.js'
import { green } from 'kolorist'

if (argv._.length !== 0 && argv._.length !== 2) {
  console.log()
  warn(`Wrong number of parameters (${argv._.length}).`)
  showHelp()
  process.exit(1)
}

const { getCtx } = await import('../utils/get-ctx.js')
const { appExt } = getCtx({
  mode: 'spa',
  debug: false,
  prod: true
})

if (argv._.length === 0) {
  if (appExt.extensionList.length === 0) {
    log(' No App Extensions are installed')
    log(' You can look for "quasar-app-extension-*" in npm registry.')
  } else {
    console.log('Installed App Extensions:')

    for (const ext of appExt.extensionList) {
      const prompts = ext.getPrompts()
      const hasPrompts = Object.keys(prompts).length !== 0

      console.log(
        `  ${green(dot)} ${ext.extId}${hasPrompts ? ' (with prompts)' : ''}`
      )

      if (hasPrompts) {
        console.log(JSON.stringify(prompts, null, 2))
        console.log()
      }
    }
  }
} else {
  const [action, extName] = argv._

  if (!['add', 'remove', 'invoke', 'uninvoke'].includes(action)) {
    console.log()
    warn(`Unknown action specified (${action}).`)
    showHelp()
    process.exit(1)
  }

  const ext = appExt.createInstance(extName)

  await ext[action === 'add' || action === 'invoke' ? 'install' : 'uninstall'](
    action === 'invoke' || action === 'uninvoke'
  )
}
