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
  ],

  // Due to conditional use of mixed ESM/CJS in certain files, they can't be properly parsed and checked
  ignorePatterns: [
    'BASE/src/index.js',
    'install-script/src/install.js',
    'prompts-script/src/prompts.js',
    'uninstall-script/src/uninstall.js'
  ]
}
