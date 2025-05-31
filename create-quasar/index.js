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
    h: 'help',
    y: 'yes'
  },

  boolean: [ 'help', 'nogit', 'prettier', 'yes' ],
  string: [ 'type', 'folder', 'preset', 'package-manager', 'script-type', 'engine',
            'name', 'product-name', 'description', 'sfc-style', 'css' ],
})

// Show help if requested
if (argv.help) {
  const validTypes = ['app', 'app-extension', 'ui-kit']
  
  // Dynamic help text loading function
  const showHelp = async () => {
    // Common options for all templates
    const baseOptions = [
      ['type', 'Project type (app, app-extension, ui-kit)'],
      ['folder', 'Project folder name'],
      ['nogit', 'Skip git initialization'],
      ['yes, -y', 'Non-interactive mode, use default values for missing options'],
      ['help, -h', 'Show this help message']
    ]
    
    // If a specific type is selected, show detailed help for that type
    if (argv.type && validTypes.includes(argv.type)) {
      const selectedType = argv.type
      let templateSpecificOptions = []
      
      try {
        // Load params from the selected template
        const { default: params } = await import(`./templates/${selectedType}/params.js`)
        if (params && params.helpText) {
          templateSpecificOptions = Object.entries(params.helpText).map(([key, desc]) => [key, desc])
        }
      } catch (err) {
        console.error(`Could not load help text for template type: ${selectedType}`)
      }
      
      // Print header for specific template
      console.log(`
  Usage: create-quasar [options]

  Options for ${selectedType} projects:`)
      
      // Print all options for the specific template
      const allOptions = [...baseOptions, ...templateSpecificOptions]
      allOptions.forEach(([key, desc]) => {
        console.log(`    --${key.padEnd(20)} ${desc}`)
      })
    } else {
      // General help without a specific template selected
      console.log(`
  Usage: create-quasar [options]

  Basic Options:`)
      
      // Print basic options
      baseOptions.forEach(([key, desc]) => {
        console.log(`    --${key.padEnd(20)} ${desc}`)
      })
      
      // Show template selection information
      console.log(`
  Available Template Types:
    app                   Standard Quasar application
    app-extension         Quasar App Extension
    ui-kit                UI component library

  To see template-specific options, use:
    create-quasar --help --type <template-type>

  Examples:
    create-quasar --help --type app
    create-quasar --help --type app-extension
    create-quasar --help --type ui-kit`)
    }
    
    console.log() // Empty line for better formatting
    process.exit(0)
  }
  
  showHelp()
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
