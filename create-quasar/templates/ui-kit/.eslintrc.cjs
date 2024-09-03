module.exports = {
  settings: {
    'lodash-template/globals': [
      // Base
      'name',
      'description',
      'author',

      'features',
      'preset',

      'packageDescription',
      'aeDescription',
      'aeCodeFormat',

      'umdExportName',
      'componentName',
      'directiveName',

      'license',
      'repositoryType',
      'repositoryURL',
      'homepage',
      'bugs'
    ]
  },

  overrides: [
    {
      files: [
        './*/{ae,ae-*}/app-extension/src/*.js',
        './*/{BASE,ui-ae}/ui/build/*.js',
        './*/{BASE,ui-ae}/ui/build/*/!(entry)/**/*.js',
      ],

      parserOptions: {
        sourceType: 'script'
      },

      env: {
        browser: false,
        node: true,
      },
    },
  ]
}
