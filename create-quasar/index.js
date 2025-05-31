#!/usr/bin/env node

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// display banner
console.log()
console.log(
  readFileSync(
    new URL('./assets/logo.art', import.meta.url),
    'utf8'
  )
)

import utils from './utils/index.js'

// should error out if already inside of a Quasar project
utils.ensureOutsideProject()

import parseArgs from 'minimist'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    n: 'nogit',
    h: 'help',
    t: 'type',
    f: 'folder',
    p: 'preset',
    pm: 'package-manager',
    s: 'script-type',
    e: 'engine',
    name: 'name',
    pn: 'product-name',
    d: 'description',
    ss: 'sfc-style',
    c: 'css',
    pr: 'prettier',
    y: 'yes'
  },

  boolean: [ 'n', 'h', 'pr', 'y' ],
  string: [ 't', 'f', 'p', 'pm', 's', 'e', 'name', 'pn', 'd', 'ss', 'c' ],
})

// Show help if requested
if (argv.help) {
  console.log(`
  Usage: create-quasar [options]

  Options:
    --type, -t            Project type (app, app-extension, ui-kit)
    --folder, -f          Project folder name
    --script-type, -s     Script type (js, ts)
    --engine, -e          Engine variant (vite-2, webpack-4)
    --name               Package name
    --product-name, -pn   Product name
    --description, -d     Project description
    --preset, -p          Features preset (comma-separated: eslint,pinia,axios,i18n)
    --prettier, -pr       Add Prettier for code formatting (boolean)
    --sfc-style, -ss      Vue component style (composition-setup, composition, options)
    --css, -c             CSS preprocessor (scss, sass, css)
    --package-manager, -pm Package manager to use (yarn, npm, pnpm, bun)
    --nogit, -n           Skip git initialization
    --yes, -y             Non-interactive mode, use default values for missing options
    --help, -h            Show this help message
  `)
  process.exit(0)
}

const defaultProjectFolder = 'quasar-project'
const scope = {}

// Pass command-line arguments to utils module
utils.setCliArgs(argv)

await utils.prompts(scope, [
  {
    type: 'select',
    name: 'projectType',
    initial: 0,
    message: 'What would you like to build?',
    choices: [
      { title: 'App with Quasar CLI, let\'s go!', value: 'app', description: 'spa/pwa/ssr/bex/electron/capacitor/cordova' },
      { title: 'AppExtension (AE) for Quasar CLI', value: 'app-extension', description: 'Quasar CLI AE' },
      { title: 'Quasar UI kit', value: 'ui-kit', description: 'Vue component and/or directive' }
    ]
  },
  {
    type: 'text',
    name: 'projectFolder',
    message: 'Project folder:',
    initial: defaultProjectFolder,
    format: val => {
      const name = (val && val.trim()) || defaultProjectFolder
      // inject the "short" name
      scope.projectFolderName = name
      return join(process.cwd(), name)
    }
  },
  {
    type: (_, { projectFolder }) =>
      (!existsSync(projectFolder) || readdirSync(projectFolder).length === 0 ? null : 'confirm'),
    name: 'overwrite',
    message: () =>
      (scope.projectFolderName === '.'
        ? 'Current directory'
        : `Target directory "${ scope.projectFolderName }"`)
      + ' is not empty. Remove existing files and continue?'
  },
  {
    type: (_, { overwrite } = {}) => {
      if (overwrite === false) {
        utils.logger.fatal('Scaffolding cancelled')
      }
      return null
    },
    name: 'overwriteConfirmation'
  }
])

const { script } = await import(`./templates/${ scope.projectType }/index.js`)
await script({ scope, utils })

console.log()
utils.logger.success('The project has been scaffolded')
console.log()

function finalize () {
  if (scope.projectFolder) {
    console.log()

    if (argv.nogit) {
      utils.logger.log('Skipping git initialization as --nogit flag was provided')
    }
    else {
      utils.initializeGit(scope.projectFolder)
    }
  }

  utils.printFinalMessage(scope)
}

if (scope.skipDepsInstall !== true) {
  await utils.prompts(scope, [
    {
      type: 'select',
      name: 'packageManager',
      message:
        'Install project dependencies? (recommended)',
      choices: () => (
        utils.runningPackageManager
          ? [
              { title: `Yes, use ${ utils.runningPackageManager.name }`, value: utils.runningPackageManager.name },
              { title: 'No, I will handle that myself', value: false }
            ]
          : [
              { title: 'Yes, use Yarn (recommended)', value: 'yarn' },
              { title: 'Yes, use PNPM (recommended)', value: 'pnpm' },
              { title: 'Yes, use NPM', value: 'npm' },
              { title: 'Yes, use Bun', value: 'bun' },
              { title: 'No, I will handle that myself', value: false }
            ]
      )
    }
  ], {
    onCancel: () => {
      scope.packageManager = false
      finalize()
      process.exit(0)
    }
  })

  if (scope.packageManager !== false) {
    try {
      await utils.installDeps(scope)
    }
    catch {
      utils.logger.warn('Could not auto install dependencies. Probably a temporary npm registry issue?')
      scope.packageManager = false
      finalize()
      process.exit(0)
    }

    if (scope.preset.lint) {
      try {
        await utils.lintFolder(scope)
      }
      catch {
        utils.logger.warn('Could not auto lint fix the project folder.')
      }
    }
  }
}

finalize()
