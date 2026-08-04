#!/usr/bin/env node

import { join } from 'node:path'
import { parseArgs } from 'node:util'

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  const { cliPkg } = await import('../lib/cli-pkg.js')
  console.log(cliPkg.version)
  process.exit(0)
}

if (
  process.argv.includes('--no-color') ||
  (await import('ci-info').then(({ isCI }) => isCI))
) {
  process.env.FORCE_COLOR = '0'
}

const { cliPkg } = await import('../lib/cli-pkg.js')
const { showCliBanner } = await import('@quasar/art')

const { runningPackageManager } = await import('../lib/running-pm.js')
if (!runningPackageManager) {
  const { notifyUpdate } = await import('../lib/update-notifier.js')
  notifyUpdate(cliPkg)
}

showCliBanner()

function showHelp(warn) {
  const cmdMap = {
    pnpm: 'pnpm create quasar@latest',
    yarn: 'yarn create quasar',
    npm: 'npm init quasar@latest',
    bun: 'bun create quasar@latest'
  }
  const createCommand = cmdMap[runningPackageManager] || 'create-quasar'

  console.log(`
  Description
    Scaffolds Quasar Apps & App Extensions
    Version ${cliPkg.version}

  Usage
    $ ${createCommand} [dir] [options]

    # examples:
    $ ${createCommand} my-app --template app --defaults
    $ ${createCommand} my-ae --template ae --preset prompts --preset oxlint --defaults

  Options
    --template, -t  Type of project to create: app | ae
    --overwrite, -o Overwrite existing dir if it exists
    --preset        Preset to apply (can be used multiple times)
                    - template "app" presets:
                      typescript, sass, oxlint, eslint, i18n, pinia, fbr (filename-based routing)
                    - template "ae" presets:
                      typescript, oxlint, prompts, install, uninstall
    --name          Name of the project for package.json (must be a valid npm package name)
    --author        Author name for package.json
    --no-git        Do not initialize a git repository
    --install, -i   When invoked through a package manager it's a boolean (eg. --install)
                    Otherwise, the package manager to auto-install with:
                      --install pnpm
                      --install yarn
                      --install npm
                      --install bun

    --product       (ONLY for template "app") Product name for the app

    --defaults, -d  Use default values for the remaining non-specified options
    --no-color      Disable colored output
    --help, -h      Displays this message
  `)

  warn?.()
  process.exit(0)
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showHelp()
}

const { isInsideQuasarProject } =
  await import('../lib/ensure-outside-project.js')

if (isInsideQuasarProject()) {
  console.error(
    'Error ⚠️  This command must NOT be executed inside of a Quasar project folder.'
  )
  process.exit(1)
}

function argvError(errorMessage) {
  return {
    help: true,
    __warn() {
      console.error('Error ⚠️  ' + errorMessage)
      console.log()
      process.exit(1)
    }
  }
}

async function getArgv() {
  let scope, positionals

  try {
    const { values, positionals: pos } = parseArgs({
      options: {
        'no-git': { type: 'boolean' },
        overwrite: { type: 'boolean', short: 'o' },
        template: { type: 'string', short: 't' },
        preset: { type: 'string', short: 'p', multiple: true },
        linter: { type: 'string', short: 'l' },
        name: { type: 'string' },
        product: { type: 'string' },
        author: { type: 'string' },
        install: runningPackageManager
          ? { type: 'boolean', short: 'i' }
          : { type: 'string', short: 'i' },

        defaults: { type: 'boolean', short: 'd' },
        'no-color': { type: 'boolean' },
        help: { type: 'boolean', short: 'h' }
      },
      strict: true,
      allowPositionals: true
    })

    scope = values
    positionals = pos
  } catch (err) {
    return argvError(
      err?.code === 'ERR_PARSE_ARGS_UNKNOWN_OPTION'
        ? err.message
        : 'Unknown error while parsing arguments'
    )
  }

  if (positionals.length > 1) {
    return argvError(
      'Too many positional arguments provided (only one is allowed): ' +
        positionals.join(', ')
    )
  }

  const { default: utils } = await import('../lib/utils.js')
  if (scope.defaults) {
    if (scope.overwrite === void 0) scope.overwrite = false
    if (!scope.template) {
      scope.template = utils.definitions.template.default
    }
  }

  const { template } = scope
  const packageManagerList = ['pnpm', 'yarn', 'npm', 'bun']
  scope.packageManagerList = runningPackageManager
    ? [runningPackageManager]
    : packageManagerList

  if (template) {
    if (template === 'ae') {
      if (scope.product) {
        return argvError(
          'The --product option is not applicable for template "ae". Please remove it.'
        )
      }

      if (scope.defaults) {
        if (scope.install === void 0) scope.install = 'pnpm'
        if (!scope.preset) {
          scope.preset = ['prompts', 'install', 'uninstall', 'oxlint']
        }
      }
      const { preset, install } = scope

      if (install) {
        if (runningPackageManager) {
          if (runningPackageManager !== 'pnpm') {
            return argvError(
              `Package manager ${runningPackageManager} is not allowed with --install. Use only "pnpm".`
            )
          }

          scope.install = runningPackageManager
        } else if (install !== 'pnpm') {
          return argvError(
            'Invalid package manager specified with --install for App Extension: ' +
              install +
              '. Allowed value is "pnpm".'
          )
        }
      }

      if (preset) {
        const opts = ['prompts', 'install', 'uninstall', 'oxlint', 'typescript']
        if (preset.some(p => !opts.includes(p))) {
          return argvError(
            'Invalid preset specified: ' +
              preset.join(', ') +
              '. Allowed values are "prompts", "install", "uninstall", "oxlint", "typescript".'
          )
        }

        if (preset.includes('oxlint')) {
          scope.preset = preset.filter(p => p !== 'oxlint')
          scope.preset.push('linting')
          scope.linter = 'oxlint'
        }
      }
    } else if (template === 'app') {
      if (scope.defaults && scope.install === void 0) {
        scope.install = 'pnpm'
      }
      const { install } = scope

      if (install) {
        if (runningPackageManager) {
          if (!packageManagerList.includes(runningPackageManager)) {
            return argvError(
              `Package manager ${runningPackageManager} is not allowed with --install. Allowed package managers are ${packageManagerList.join(
                ', '
              )}.`
            )
          }

          scope.install = runningPackageManager
        } else if (!packageManagerList.includes(install)) {
          return argvError(
            'Invalid package manager specified with --install: ' +
              install +
              '. Allowed values are ' +
              packageManagerList.join(', ') +
              '.'
          )
        }
      }

      if (scope.defaults) {
        if (!scope.product) {
          scope.product = utils.definitions.product.default
        }

        if (!scope.preset) {
          scope.preset = ['sass', 'oxlint']
        }
      }

      const { preset } = scope

      if (preset) {
        const opts = [
          'typescript',
          'sass',
          'oxlint',
          'eslint',
          'fbr',
          'i18n',
          'pinia'
        ]

        if (preset.some(p => !opts.includes(p))) {
          return argvError(
            'Invalid preset specified: ' +
              preset.join(', ') +
              '. Allowed values are "typescript", "sass", "oxlint", "eslint", "fbr", "i18n", "pinia".'
          )
        }

        const hasOxlint = preset.includes('oxlint')
        const hasEslint = preset.includes('eslint')

        if (hasOxlint && hasEslint) {
          return argvError(
            'Invalid presets specified: oxlint and eslint cannot be used together. Please choose one of them.'
          )
        }

        if (hasOxlint) {
          scope.preset = preset.filter(p => p !== 'oxlint')
          scope.preset.push('linting')
          scope.linter = 'oxlint'
        } else if (hasEslint) {
          scope.preset = preset.filter(p => p !== 'eslint')
          scope.preset.push('linting')
          scope.linter = 'eslint'
        }
      }
    } else {
      return argvError(
        'Invalid template specified: ' +
          template +
          '. Allowed values are "app" and "ae".'
      )
    }
  }

  if (!scope.author) scope.author = await utils.getGitUser()

  const dir =
    positionals[0]?.trim() ||
    (scope.defaults && utils.definitions.projectFolder.default)

  if (dir) {
    scope.projectFolder = join(process.cwd(), dir)
    scope.projectFolderName = dir

    if (!scope.name) scope.name = utils.definitions.name.default(dir)
  }

  if (scope.name && !utils.definitions.name.isValid(scope.name)) {
    return argvError(
      'Invalid package name specified with --name: ' +
        scope.name +
        '. It must be a valid npm package name.'
    )
  }

  return scope
}

const argv = await getArgv()

if (argv.help) showHelp(argv.__warn)

const { createProjectFolder } = await import('../lib/create-project-folder.js')
await createProjectFolder(argv)
