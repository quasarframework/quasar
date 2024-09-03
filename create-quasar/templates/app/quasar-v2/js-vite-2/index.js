export async function script ({ scope, utils }) {
  await utils.prompts(scope, [
    {
      type: 'multiselect',
      name: 'preset',
      message: 'Check the features needed for your project:',
      choices: [
        { title: 'Linting (vite-plugin-checker + ESLint)', value: 'lint', description: 'recommended', selected: true },
        { title: 'State Management (Pinia)', value: 'pinia', description: 'https://pinia.vuejs.org' },
        { title: 'axios', value: 'axios' },
        { title: 'vue-i18n', value: 'i18n' }
      ],
      format: utils.convertArrayToObject
    },
    {
      type: (_, { preset }) => (preset.lint ? 'select' : null),
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
  utils.renderTemplate('BASE', scope)
  utils.renderTemplate(scope.css, scope)

  if (scope.preset.axios) utils.renderTemplate('axios', scope)
  if (scope.preset.i18n) utils.renderTemplate('i18n', scope)
  if (scope.preset.lint) utils.renderTemplate('lint', scope)
  if (scope.preset.pinia) utils.renderTemplate('pinia', scope)
}
