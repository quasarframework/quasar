
module.exports = async function ({ scope, utils }) {
  await utils.prompts(scope, [
    utils.commonPrompts.quasarVersion,

    {
      type: 'text',
      name: 'name',
      message: 'Project name (npm name, kebab-case, without "quasar-ui" prefix)',
      validate: (val) =>
        utils.isValidPackageName(val) || 'Invalid package.json name'
    },

    utils.commonPrompts.author,
    utils.commonPrompts.license,

    {
      type: 'multiselect',
      name: 'features',
      message: 'Pick what you will be interested in:',
      format: utils.convertArrayToObject,
      choices: [
        {
          title: 'Vue component',
          value: 'component',
          selected: true
        },
        {
          title: 'Vue directive',
          value: 'directive'
        },
        {
          title: 'Quasar App Extension',
          value: 'ae',
          selected: true
        }
      ]
    },

    {
      type: 'text',
      name: 'packageDescription',
      message: 'Package description',
      initial: 'My awesome component',
    },

    {
      type: 'text',
      name: 'umdExportName',
      message: 'UMD export name (global variable, camelCased)',
      validate: val => val && val.length > 0
    },

    {
      type: (_, { features }) => features.component ? 'text' : null,
      name: 'componentName',
      message: 'Component name (PascalCase)',
      initial: 'MyComponent',
      validate: val => val && val.length > 0
    },

    {
      type: (_, { features }) => features.directive ? 'text' : null,
      name: 'directiveName',
      message: 'Directive name (kebab-case, without "v-" prefix)',
      initial: 'my-directive',
      validate: val => val && val.length > 0
    },

    {
      type: (_, { features }) => features.ae ? 'text' : null,
      name: 'aeDescription',
      message: 'App Extension description',
      initial: 'A Quasar App Extension',
      validate: val => val && val.length > 0
    },

    {
      type: (_, { features }) => features.ae ? 'multiselect' : null,
      name: 'preset',
      message: 'Pick the needed App Extension scripts:',
      format: utils.convertArrayToObject,
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
      ]
    },

    {
      type: (_, { quasarVersion, features }) => quasarVersion === 'v2' && features.ae ? 'select' : null,
      name: 'aeCodeFormat',
      message: 'Pick the App Extension format:',
      initial: 0,
      choices: [
        { title: 'ESM (q/app-vite >= 1.5, q/app-webpack >= 3.10)', value: 'esm', description: 'recommended' },
        { title: 'CommonJS', value: 'commonjs' }
      ]
    },

    utils.commonPrompts.repositoryType,
    utils.commonPrompts.repositoryURL,
    utils.commonPrompts.homepage,
    utils.commonPrompts.bugs
  ])

  const script = require(`./quasar-${scope.quasarVersion}`)
  await script({ scope, utils })

  // we don't want to install
  scope.skipDepsInstall = true
}
