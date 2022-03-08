#!/usr/bin/env node

const QUASAR_VERSIONS = [
  { title: 'Quasar v2 (Vue 3 | latest and greatest)', value: 'v2', description: 'recommended' },
  { title: 'Quasar v1 (Vue 2)', value: 'v1' }
]
const SCRIPT_TYPES = [
  { title: 'Javascript', value: 'js' },
  { title: 'Typescript', value: 'ts' }
]

const { readFileSync, readdirSync, existsSync } = require('fs')
const parseArgs = require('minimist')

// display banner
console.log(
  readFileSync(
    require('path').join(__dirname, 'assets/logo.art'),
    'utf8'
  )
)

const utils = require('./utils')

// should error out if already inside of a Quasar project
utils.ensureOutsideProject()

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    v: 'version',
    t: 'type'
  },
  string: [ 'v', 't' ]
})

let dir = argv._[0]
const defaultProjectFolder = 'quasar-project'
const versionOptions = QUASAR_VERSIONS.map(entry => entry.value)
const scriptTypeOptions = SCRIPT_TYPES.map(entry => entry.value)

async function run () {
  const initialAnswers = await utils.prompts([
    {
      type: dir ? null : 'text',
      name: 'projectFolder',
      message: 'Project folder:',
      initial: defaultProjectFolder,
      onState: state => (dir = state.value.trim() || defaultProjectFolder)
    },
    {
      type: () =>
        !existsSync(dir) || readdirSync(dir).length === 0 ? null : 'confirm',
      name: 'overwrite',
      message: () =>
        (dir === '.'
          ? 'Current directory'
          : `Target directory "${dir}"`) +
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
    },
    {
      type: argv.version && versionOptions.includes(argv.version) ? null : 'select',
      name: 'quasarVersion',
      message: argv.version && versionOptions.includes(argv.version) === false
        ? `"${argv.version}" isn't a valid Quasar version. Please choose from below: `
        : 'Pick Quasar version:',
      initial: 0,
      choices: QUASAR_VERSIONS
    },
    {
      type: argv.version && scriptTypeOptions.includes(argv.version) === true ? null : 'select',
      name: 'scriptType',
      message: argv.type && scriptTypeOptions.includes(argv.type) === false
        ? `"${argv.version}" isn't a valid script type. Please choose from below: `
        : 'Pick script type:',
      initial: 0,
      choices: SCRIPT_TYPES
    }
  ])

  const getTemplateName = require(`./templates/quasar-${initialAnswers.quasarVersion}/get-template-name`)
  const templateName = await getTemplateName(initialAnswers, utils)

  const commonAnswers = await utils.prompts([
    {
      type: 'text',
      name: 'name',
      message: 'Package name:',
      initial: () => utils.inferPackageName(dir),
      validate: (dir) =>
      utils.isValidPackageName(dir) || 'Invalid package.json name'
    },
    {
      type: 'text',
      name: 'productName',
      message: 'Project product name (must start with letter if building mobile apps)',
      initial: 'Quasar App',
      validate: val =>
        val && val.length > 0 || 'Invalid product name'
    },
    {
      type: 'text',
      name: 'description',
      message: 'Project description',
      initial: 'A Quasar Framework app',
      format: utils.escapeString,
      validate: val =>
        val.length > 0 || 'Invalid project description'
    },
    {
      type: 'text',
      name: 'author',
      initial: () => utils.getGitUser(),
      message: 'Author'
    }
  ])

  const scope = { ...initialAnswers, ...commonAnswers }

  const runTemplate = require(`./templates/quasar-${initialAnswers.quasarVersion}/${templateName}`)
  await runTemplate({ scope, dir, utils })

  utils.sortPackageJson(dir)

  console.log()
  utils.logger.success('The project has been scaffolded')
  console.log()

  const { packageManager } = await utils.prompts([
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
            { title: 'No, I will handle that myself', value: false }
          ]
      )
    }
  ], {
    onCancel: () => {
      utils.printFinalMessage({ scope, dir, packageManager: false })
      process.exit(0)
    }
  })

  if (packageManager !== false) {
    try {
      await utils.installDeps(dir, packageManager)
    }
    catch {
      utils.logger.warn('Could not auto install dependencies. Probably a temporary npm registry issue?')
      utils.printFinalMessage({ scope, dir, packageManager: false })
      process.exit(0)
    }

    if (scope.lint) {
      try {
        await utils.lintFolder(dir, packageManager)
      }
      catch {
        utils.logger.warn('Could not auto lint fix the project folder.')
      }
    }
  }

  utils.printFinalMessage({ scope, dir, packageManager })
}

run()
