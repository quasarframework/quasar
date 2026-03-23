export async function createQuasarScript ({ scope, utils }) {
  await utils.prompts(scope, [
    {
      type: 'multiselect',
      name: 'preset',
      message: 'Check the features needed for your project:',
      choices: [
        { title: 'Linting (ESLint)', value: 'eslint', description: 'recommended', selected: true },
        { title: 'State Management (Pinia)', value: 'pinia', description: 'https://pinia.vuejs.org' },
        { title: 'axios', value: 'axios' },
        { title: 'vue-i18n', value: 'i18n' }
      ],
      format: utils.convertArrayToObject
    },
    {
      type: (_, { preset }) => (preset.eslint ? 'confirm' : null),
      name: 'prettier',
      initial: true,
      message: 'Add Prettier for code formatting?'
    }
  ])

  // ensure it's defined since if not selecting ESLint,
  // user won't be asked about it hence it won't be defined
  scope.prettier = scope.prettier || false

  utils.createTargetDir(scope)
  utils.renderTemplate('BASE', scope)
  utils.renderTemplate(scope.css, scope)

  if (scope.preset.axios) utils.renderTemplate('axios', scope)
  if (scope.preset.i18n) utils.renderTemplate('i18n', scope)
  if (scope.preset.eslint) utils.renderTemplate('eslint', scope)
  if (scope.prettier) utils.renderTemplate('prettier', scope)
  if (scope.preset.pinia) utils.renderTemplate('pinia', scope)
}
