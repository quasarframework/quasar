export async function script ({ scope, utils }) {
  await utils.prompts(scope, [
    {
      type: 'select',
      name: 'engine',
      message: 'Pick Quasar App CLI variant:',
      initial: 0,
      choices: [
        { title: 'Quasar App CLI with Vite 2 (stable | v1)', value: 'vite-1', description: 'recommended' },
        { title: 'Quasar App CLI with Vite 5 (BETA | next major version - v2)', value: 'vite-beta' },
        { title: 'Quasar App CLI with Webpack (stable | v3)', value: 'webpack-3' },
        { title: 'Quasar App CLI with Webpack (BETA | next major version - v4)', value: 'webpack-beta' }
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

  const { script } = await import(`./${ scope.scriptType }-${ scope.engine }/index.js`)
  await script({ scope, utils })
}
