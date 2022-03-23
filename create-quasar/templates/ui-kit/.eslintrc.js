module.exports = {
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
