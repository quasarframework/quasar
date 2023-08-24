
module.exports = async function ({ scope, utils }) {
  await utils.prompts(scope, [
    {
      type: 'select',
      name: 'typescriptConfig',
      message: 'Pick a Vue component style:',
      initial: 0,
      choices: [
        { title: 'Composition API (recommended) (https://github.com/vuejs/composition-api)', value: 'composition' },
        { title: 'Class-based (recommended) (https://github.com/vuejs/vue-class-component & https://github.com/kaorun343/vue-property-decorator)', value: 'class' },
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
        { title: 'Stylus (deprecated)', value: 'styl' },
        { title: 'None (the others will still be available)', value: 'css' }
      ]
    },
    {
      type: 'select',
      name: 'importStrategy',
      message: 'Pick a Quasar components & directives import strategy: (can be changed later)',
      initial: 0,
      choices: [
        {
          title: '* Auto-import in-use Quasar components & directives\n        - also treeshakes Quasar; minimum bundle size',
          value: 'auto'
        },
        {
          title: '* Import everything from Quasar\n        - not treeshaking Quasar; biggest bundle size',
          value: 'all'
        }
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
        { title: 'Vue-i18n', value: 'i18n' },
        { title: 'IE11 support', value: 'ie' }
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

  utils.createTargetDir(scope)
  utils.renderTemplate(utils.join(__dirname, 'BASE'), scope)
  utils.renderTemplate(utils.join(__dirname, scope.css), scope)

  if (scope.preset.axios) utils.renderTemplate(utils.join(__dirname, 'axios'), scope)
  if (scope.preset.i18n) utils.renderTemplate(utils.join(__dirname, 'i18n'), scope)
  if (scope.preset.vuex) utils.renderTemplate(utils.join(__dirname, 'vuex'), scope)
  if (scope.preset.lint) utils.renderTemplate(utils.join(__dirname, 'lint'), scope)
}
