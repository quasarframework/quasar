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
    }
  }
}
