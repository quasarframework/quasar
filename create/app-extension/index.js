#!/usr/bin/env node

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

const argv = parseArgs(process.argv.slice(2), {
  // nothing yet
})

let dir = argv._[0]
const defaultProjectFolder = 'quasar-ae-project'

async function run () {
  const scope = await utils.prompts([
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
      type: 'confirm',
      name: 'needOrgName',
      initial: false,
      message: 'Will you use an organization to publish it? Eg. "@my-org/..."'
    },
    {
      type: (_, { needOrgName } = {}) => needOrgName ? 'text' : null,
      name: 'orgName',
      message: 'Organization name, eg. "my-org":',
      validate: val =>
        val && val.length > 0 || 'Please type the organization name'
    },
    {
      type: 'text',
      name: 'name',
      message: 'Quasar App Extension ext-id (without "quasar-app-extension" prefix), eg. "my-ext"',
      validate: (val) =>
        utils.isValidPackageName(val) || 'Invalid App Extension name'
    },
    {
      type: 'text',
      name: 'description',
      message: 'Project description:',
      initial: 'A Quasar App Extension',
      format: utils.escapeString,
      validate: val =>
        val.length > 0 || 'Invalid project description'
    },
    {
      type: 'text',
      name: 'author',
      initial: () => utils.getGitUser(),
      message: 'Author:'
    },
    {
      type: 'text',
      name: 'license',
      initial: 'MIT',
      message: 'License type:'
    },
    {
      type: 'multiselect',
      name: 'preset',
      message: 'Pick the needed scripts:',
      choices: [
        {
          title: 'Prompts script',
          value: 'prompts'
        },
        {
          title: 'Install script',
          value: 'install'
        },
        {
          title: 'Uninstall script',
          value: 'uninstall'
        }
      ],
      format: utils.convertArrayToObject
    },
    {
      type: 'text',
      name: 'repositoryType',
      initial: 'git',
      message: 'Repository type:'
    },
    {
      type: 'text',
      name: 'repositoryURL',
      message: 'Repository URL (eg https://github.com/quasarframework/quasar):'
    },
    {
      type: 'text',
      name: 'homepage',
      message: 'Homepage URL:'
    },
    {
      type: 'text',
      name: 'bugs',
      message: 'Issue reporting URL (eg https://github.com/quasarframework/quasar/issues):'
    }
  ])

  const runTemplate = require(`./templates/ae-v1`)
  await runTemplate({ scope, dir, utils })

  utils.sortPackageJson(dir)

  console.log()
  utils.logger.success('The project has been scaffolded')
  console.log()

  utils.printFinalMessage({ scope, dir })
}

run()
