module.exports = (wallaby) => {
  process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true

  const compiler = wallaby.compilers.babel({ presets: [['@quasar/app', { modules: 'commonjs' }]] })

  return {
    files: [
      'src/**/*',
      'jest.config.js',
      'package.json',
      'test/**/*',
      '!test/**/*.spec.js',
      '!src/**/*.spec.js'
    ],

    tests: ['src/**/*_spec.js', 'test/jest/**/*.spec.js'],

    env: {
      type: 'node',
      runner: 'node'
    },

    compilers: {
      '**/*.js': compiler,
      '**/*.vue': require('wallaby-vue-compiler')(compiler)
    },

    preprocessors: {
      '**/*.vue': file => require('vue-jest').process(file.content, file.path)
    },

    setup: function (wallaby) {
      const jestConfig = require('./package').jest || require('./jest.config')
      jestConfig.transform = {}
      wallaby.testFramework.configure(jestConfig)
    },

    testFramework: 'jest',

    debug: true
  }
}
