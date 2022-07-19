
module.exports = async function ({ scope, utils }) {
  await utils.prompts(scope, [
    {
      type: 'select',
      name: 'typescriptConfig',
      message: 'Pick a Vue component style:',
      initial: 0,
      choices: [
        { title: 'Composition API', value: 'composition', description: 'recommended' },
        { title: 'Composition API with <script setup>', value: 'composition-setup', description: 'recommended' },
        { title: 'Options API', value: 'options' },
        { title: 'Class-based (DEPRECATED; see https://github.com/quasarframework/quasar/discussions/11204)', value: 'class', disabled: true }
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
        { title: 'State Management (Pinia)', value: 'pinia', description: 'https://pinia.vuejs.org' },
        { title: 'State Management (Vuex) [DEPRECATED by Vue Team]', value: 'vuex', description: 'See https://vuejs.org/guide/scaling-up/state-management.html#pinia' },
        { title: 'Axios', value: 'axios' },
        { title: 'Vue-i18n', value: 'i18n' }
      ],
      format: values => {
        let result = values

        if (values.includes('vuex') && values.includes('pinia')) {
          console.log()
          utils.logger.warn('Only one state management package can be used. Picking the recommended Pinia and dropping Vuex.')
          console.log()

          result = values.filter(entry => entry !== 'vuex')
        }

        return utils.convertArrayToObject(result)
      }
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

  utils.createTargetDir(scope)
  utils.renderTemplate(utils.join(__dirname, 'BASE'), scope)
  utils.renderTemplate(utils.join(__dirname, scope.css), scope)

  if (scope.preset.axios) utils.renderTemplate(utils.join(__dirname, 'axios'), scope)
  if (scope.preset.i18n) utils.renderTemplate(utils.join(__dirname, 'i18n'), scope)
  if (scope.preset.lint) {
    utils.renderTemplate(utils.join(__dirname, 'lint'), scope)
    if (scope.lintConfig === 'prettier') {
      utils.renderTemplate(utils.join(__dirname, 'prettier'), scope)
    }
  }

  if (scope.preset.pinia) utils.renderTemplate(utils.join(__dirname, 'pinia'), scope)
  else if (scope.preset.vuex) utils.renderTemplate(utils.join(__dirname, 'vuex'), scope)
}
