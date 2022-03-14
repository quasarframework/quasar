module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 2022,
  },

  env: {
    node: true,
  },

  extends: [
    // TODO: Enable
    // 'eslint:recommended',
    'plugin:node/recommended'
  ],

  rules: {
    'no-process-exit': 'off',
  }
}
