#!/usr/bin/env node

const { readFileSync, readdirSync, existsSync } = require('fs')

// display banner
console.log()
console.log(
  readFileSync(
    require('path').join(__dirname, 'assets/logo.art'),
    'utf8'
  )
)

const utils = require('./utils')

// should error out if already inside of a Quasar project
utils.ensureOutsideProject()

const defaultProjectFolder = 'quasar-project'

async function run () {
  const scope = {}

  await utils.prompts(scope, [
    {
      type: 'select',
      name: 'projectType',
      initial: 0,
      message: 'What would you like to build?',
      choices: [
        { title: `App with Quasar CLI, let's go!`, value: 'app', description: 'spa/pwa/ssr/bex/electron/capacitor/cordova' },
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
        return utils.join(process.cwd(), name)
      }
    },
    {
      type: (_, { projectFolder }) =>
        !existsSync(projectFolder) || readdirSync(projectFolder).length === 0 ? null : 'confirm',
      name: 'overwrite',
      message: () =>
        (scope.projectFolderName === '.'
          ? 'Current directory'
          : `Target directory "${scope.projectFolderName}"`) +
        ` is not empty. Remove existing files and continue?`
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

  const projectScript = require(`./templates/${scope.projectType}`)
  await projectScript({ scope, utils })

  console.log()
  utils.logger.success('The project has been scaffolded')
  console.log()

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
              { title: `Yes, use ${utils.runningPackageManager}`, value: utils.runningPackageManager },
              { title: 'No, I will handle that myself', value: false }
            ]
            : [
              { title: 'Yes, use Yarn (recommended)', value: 'yarn' },
              { title: 'Yes, use NPM', value: 'npm' },
              { title: 'Yes, use PNPM (experimental support)', value: 'pnpm' },
              { title: 'Yes, use Bun (experimental support)', value: 'bun' },
              { title: 'No, I will handle that myself', value: false }
            ]
        )
      }
    ], {
      onCancel: () => {
        scope.packageManager = false
        utils.printFinalMessage(scope)
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
        utils.printFinalMessage(scope)
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

  utils.printFinalMessage(scope)
}

run()
