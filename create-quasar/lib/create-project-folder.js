import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

import utils from './utils.js'
import { runningPackageManager } from './running-pm.js'

export async function createProjectFolder(scope) {
  scope.meta = {
    hasInstalledDeps: false,
    installDepsCmd: null,
    lintCmd: null,
    runDevCmd: null
  }

  utils.prompts.intro('New Quasar Project')

  await utils.promptUser(scope, {
    template: () => {
      const isPnpm =
        scope.install === 'pnpm' ||
        // invoked directly, not through a package manager's "create" command
        !runningPackageManager ||
        // invoked through "pnpm create quasar@latest"
        runningPackageManager === 'pnpm'

      return utils.prompts.select({
        initialValue: utils.definitions.template.default,
        message: 'What would you like to build?',
        options: [
          {
            label: "App with Quasar CLI, let's go!",
            value: 'app'
          },
          {
            label: 'AppExtension for Quasar CLI',
            value: 'ae',
            hint: isPnpm
              ? 'with PNPM only'
              : 'PNPM only, run "pnpm create quasar@latest" instead',
            disabled: !isPnpm
          }
        ]
      })
    },

    projectFolder: async () => {
      const val = await utils.prompts.text({
        message: 'Project folder:',
        placeholder: utils.definitions.projectFolder.default,
        defaultValue: utils.definitions.projectFolder.default
      })

      utils.exitOnCancel(val)

      const name = val.trim()
      // inject the "short" name
      scope.projectFolderName = name
      return resolve(process.cwd(), name)
    }
  })

  if (
    !scope.overwrite &&
    existsSync(scope.projectFolder) &&
    readdirSync(scope.projectFolder).length !== 0
  ) {
    if (scope.defaults) {
      utils.cancelScaffolding({
        message:
          (scope.projectFolderName === '.'
            ? 'Current directory'
            : `Target directory "${scope.projectFolderName}"`) +
          ' is not empty. Use --overwrite to remove its existing files.'
      })
    }

    const val = await utils.prompts.confirm({
      message:
        (scope.projectFolderName === '.'
          ? 'Current directory'
          : `Target directory "${scope.projectFolderName}"`) +
        ' is not empty. Remove existing files and continue?',
      initialValue: false
    })

    utils.exitOnCancel(val)
    if (val === false) utils.cancelScaffolding()

    scope.overwrite = true
  }

  const { createQuasarScript } = await import(
    `../templates/${scope.template}/create-quasar-script.js`
  )
  await createQuasarScript({ scope, utils })

  await utils.promptUser(scope, {
    install: () =>
      utils.prompts.select({
        message: 'Install project dependencies? (recommended)',
        options: [
          ...scope.packageManagerList.map(pm => ({
            label: `Yes, use ${pm.toUpperCase()}`,
            value: pm,
            hint: pm === 'pnpm' || pm === 'yarn' ? 'recommended' : void 0
          })),
          { label: 'No, I will handle that myself', value: false }
        ]
      })
  })

  if (scope.install !== false) {
    const hasInstalled = await utils.installDeps(scope)
    if (hasInstalled) {
      scope.meta.hasInstalledDeps = true

      if (scope.preset.linting) {
        const hadLintError = await utils.lintFolder(scope)
        if (hadLintError) {
          scope.meta.lintCmd = `${scope.install} run lint`
        }
      }
    }
  }

  const pkgManager = scope.install || scope.packageManagerList[0]
  if (!scope.meta.hasInstalledDeps) {
    scope.meta.installDepsCmd = `${pkgManager} install`

    if (scope.preset.linting) {
      scope.meta.lintCmd = `${pkgManager} run lint`
    }
  }

  if (scope['no-git']) {
    utils.prompts.log.info(
      'Skipping git initialization as --no-git flag was provided'
    )
  } else {
    utils.initializeGit(scope.projectFolder)
  }

  utils.prompts.note(
    'Documentation → https://quasar.dev' +
      '\nGitHub → https://github.quasar.dev' +
      '\nDiscussions → https://forum.quasar.dev' +
      '\nDiscord → https://chat.quasar.dev' +
      '\nDonations → https://donate.quasar.dev',
    'Useful links:'
  )

  const cmdList = [
    `cd ${scope.projectFolderName}`,
    scope.meta.installDepsCmd,
    scope.meta.lintCmd,
    [scope.meta.runDevCmd, `${pkgManager} run dev`]
      .filter(Boolean)
      .join(' # or: ')
  ]
    .filter(Boolean)
    .join('\n')

  utils.prompts.note(cmdList, 'To get started:')

  utils.prompts.note(
    `Quasar is relying on donations to evolve.` +
      `\nWe'd be very grateful if you can read our manifest ` +
      `\non "Why donations are important": https://quasar.dev/why-donate` +
      '\n\nDonation campaign: https://donate.quasar.dev' +
      '\nAny amount is very welcome.' +
      '\nIf invoices are required, please first contact Razvan Stoenescu.',
    'Support Quasar Development:'
  )

  utils.prompts.outro('Done. Enjoy! - Quasar Team')
}
