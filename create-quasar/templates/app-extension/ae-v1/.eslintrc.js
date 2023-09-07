module.exports = {
  settings: {
    'lodash-template/globals': [
      // Base
      'name',
      'description',
      'author',

      'preset',
      'orgName',
      'license',
      'repositoryType',
      'repositoryURL',
      'homepage',
      'bugs',

      'codeFormat'
    ]
  },

  overrides: [
    {
      files: [
        './*/**/*.js',
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
