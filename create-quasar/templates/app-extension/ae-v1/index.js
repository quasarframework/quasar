
module.exports = async function ({ scope, utils }) {
  await utils.prompts(scope, [
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
      type: 'select',
      name: 'codeFormat',
      message: 'Pick AE code format:',
      initial: 0,
      choices: [
        { title: 'ESM (q/app-vite >= 1.5, q/app-webpack >= 3.10)', value: 'esm', description: 'recommended' },
        { title: 'CommonJS', value: 'commonjs' }
      ]
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

  utils.createTargetDir(scope)
  utils.renderTemplate(utils.join(__dirname, 'BASE'), scope)

  if (scope.preset.prompts) utils.renderTemplate(utils.join(__dirname, 'prompts-script'), scope)
  if (scope.preset.install) utils.renderTemplate(utils.join(__dirname, 'install-script'), scope)
  if (scope.preset.uninstall) utils.renderTemplate(utils.join(__dirname, 'uninstall-script'), scope)

  // nothing to install, so we'll skip it
  scope.skipDepsInstall = true
}
