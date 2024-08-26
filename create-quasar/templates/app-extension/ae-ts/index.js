export async function script ({ scope, utils }) {
  await utils.prompts(scope, [
    {
      type: 'confirm',
      name: 'needOrgName',
      initial: false,
      message: 'Will you use an organization to publish it? Eg. "@my-org/..."'
    },
    {
      type: (_, { needOrgName } = {}) => (needOrgName ? 'text' : null),
      name: 'orgName',
      message: 'Organization name, eg. "my-org":',
      validate: val =>
        (val && val.length > 0) || 'Please type the organization name'
    },
    {
      type: 'text',
      name: 'name',
      message: 'Quasar App Extension ext-id (without "quasar-app-extension" prefix), eg. "my-ext"',
      validate: (val) =>
        utils.isValidPackageName(val) || 'Invalid App Extension name'
    },

    utils.commonPrompts.description,
    utils.commonPrompts.author,
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

  scope.pkgName = scope.needOrgName ? `@${scope.orgName}/quasar-app-extension-${scope.name}` : `quasar-app-extension-${scope.name}`
  const packageManager = utils.runningPackageManager
  scope.packageManager = packageManager
  scope.packageManagerField = packageManager ? `${packageManager.name}@${packageManager.version}` : undefined

  utils.createTargetDir(scope)
  utils.renderTemplate('BASE', scope)
  // If the package manager is not known, render pnpm stuff just in case
  if (!packageManager || packageManager.name === 'pnpm') {
    utils.renderTemplate('pnpm', scope)
  }

  if (scope.preset.prompts) utils.renderTemplate('prompts-script', scope)
  if (scope.preset.install) utils.renderTemplate('install-script', scope)
  if (scope.preset.uninstall) utils.renderTemplate('uninstall-script', scope)

  if (scope.scriptType === 'js') {
    // nothing to install, so we'll skip it
    scope.skipDepsInstall = true
  } else {
    // enable linting after deps installation for the TS template
    scope.preset.lint = true
  }
}
