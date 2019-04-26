module.exports = {
  env: {
    development: {
      presets: [
        '@quasar/babel-preset-app'
      ]
    },

    production: {
      presets: [ 'es2015-rollup' ],
      comments: false
    },

    test: {
      plugins: ['dynamic-import-node'],
      presets: [
        [
          '@babel/preset-env',
          {
            modules: 'commonjs',
            targets: {
              node: 'current'
            }
          }
        ]
      ]
    }
  },
  plugins: ['@babel/plugin-syntax-dynamic-import']
}
