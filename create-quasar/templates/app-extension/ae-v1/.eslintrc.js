module.exports = {
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
