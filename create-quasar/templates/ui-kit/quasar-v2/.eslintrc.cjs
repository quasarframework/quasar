module.exports = {
  overrides: [
    {
      files: './*/**/*.js',

      globals: {
        __UI_VERSION__: 'readonly'
      },
    },
  ],

  // Due to conditional use of mixed ESM/CJS in certain files, they can't be properly parsed and checked
  ignorePatterns: [
    'ae-install/app-extension/src/install.js',
    'ae-prompts/app-extension/src/prompts.js',
    'ae-uninstall/app-extension/src/uninstall.js',
    'ae/app-extension/src/index.js'
  ]
}
