export async function createQuasarScript ({ scope, utils }) {
  await utils.prompts(scope, [
    {
      type: 'select',
      name: 'engine',
      message: 'Pick Quasar App CLI variant:',
      initial: 0,
      choices: [
        { title: 'Quasar App CLI with Vite', value: 'vite-2', description: 'recommended' },
        { title: 'Quasar App CLI with Webpack', value: 'webpack-4' }
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
  ])

  await utils.injectAuthor(scope)

  await utils.prompts(scope, [
    {
      type: 'select',
      name: 'sfcStyle',
      message: 'Pick a Vue component style:',
      initial: 0,
      choices: [
        { title: 'Composition API with <script setup>', value: 'composition-setup', description: 'recommended' },
        { title: 'Composition API', value: 'composition', description: 'recommended' },
        { title: 'Options API', value: 'options' }
      ]
    },

    {
      type: 'select',
      name: 'css',
      message: 'Pick your CSS preprocessor:',
      initial: 0,
      choices: [
        { title: 'Sass with SCSS syntax', value: 'scss' },
        { title: 'Sass with indented syntax', value: 'sass' },
        { title: 'None (the others will still be available)', value: 'css' }
      ]
    }
  ])

  const { script } = await import(`./${ scope.scriptType }-${ scope.engine }/create-quasar-script.js`)
  await script({ scope, utils })
}
