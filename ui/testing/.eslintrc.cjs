module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  env: {
    browser: true,
    node: true
  },

  extends: [
    'quasar/base',
    'quasar/vue',
    'quasar/node'
  ],

  rules: {
    curly: 'off'
  }
}
