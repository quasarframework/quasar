
module.exports = async function ({
  scope,
  dir,
  utils
}) {
  const answers = await utils.prompts([
    {
      type: 'select',
      name: 'typescriptConfig',
      message: 'Pick a Vue component style:',
      initial: 0,
      choices: [
        { title: 'Composition API', value: 'composition', description: 'recommended' },
        { title: 'Options API', value: 'options' },
        { title: 'Class-based', value: 'class', description: 'DEPRECATED; see https://github.com/quasarframework/quasar/discussions/11204', disabled: true }
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
    },
    {
      type: 'multiselect',
      name: 'preset',
      message: 'Check the features needed for your project:',
      choices: [
        { title: 'ESLint', value: 'lint', description: 'recommended', selected: true },
        { title: 'Vuex', value: 'vuex' },
        { title: 'Axios', value: 'axios' },
        { title: 'Vue-i18n', value: 'i18n' }
      ],
      format: utils.convertArrayToObject
    },
    {
      type: (_, { preset }) => preset.lint ? 'select' : null,
      name: 'lintConfig',
      message: 'Pick an ESLint preset:',
      choices: [
        { title: 'Prettier', value: 'prettier', description: 'https://github.com/prettier/prettier' },
        { title: 'Standard', value: 'standard', description: 'https://github.com/standard/standard' },
        { title: 'Airbnb', value: 'airbnb', description: 'https://github.com/airbnb/javascript' }
      ]
    }
  ])

  Object.assign(scope, answers)

  utils.createTargetDir(dir, scope)
  utils.renderTemplate(utils.join(__dirname, 'BASE'), dir, scope)
  utils.renderTemplate(utils.join(__dirname, scope.css), dir, scope)

  if (scope.preset.axios) utils.renderTemplate(utils.join(__dirname, 'axios'), dir, scope)
  if (scope.preset.i18n) utils.renderTemplate(utils.join(__dirname, 'i18n'), dir, scope)
  if (scope.preset.vuex) utils.renderTemplate(utils.join(__dirname, 'vuex'), dir, scope)
  if (scope.preset.lint) {
    utils.renderTemplate(utils.join(__dirname, 'lint'), dir, scope)
    if (scope.lintConfig === 'prettier') {
      utils.renderTemplate(utils.join(__dirname, 'prettier'), dir, scope)
    }
  }
}
