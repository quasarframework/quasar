module.exports = {
  overrides: [
    {
      files: './*/**/*.js',

      globals: {
        __UI_VERSION__: 'readonly'
      },
    },
  ]
}
