
module.exports = async function ({ scope, utils }) {
  await utils.prompts(scope, [
    {
      type: 'select',
      name: 'engine',
      message: 'Pick Quasar App CLI variant:',
      initial: 0,
      choices: [
        { title: 'Quasar App CLI with Vite (stable)', value: 'vite', description: 'recommended' },
        { title: 'Quasar App CLI with Vite (BETA; next)', value: 'vite-beta', description: 'recommended' },
        { title: 'Quasar App CLI with Webpack (stable)', value: 'webpack' },
        { title: 'Quasar App CLI with Webpack (BETA; next)', value: 'webpack-beta' }
      ]
    },
    {
      type: 'text',
      name: 'name',
      message: 'Package name:',
      initial: () => utils.inferPackageName(scope.projectFolderName),
      validate: (val) =>
        utils.isValidPackageName(val) || 'Invalid package.json name'
    },

    utils.commonPrompts.productName,
    utils.commonPrompts.description,
    utils.commonPrompts.author
  ])

  const script = require(`./${scope.scriptType}-${scope.engine}`)
  await script({ scope, utils })
}
