module.exports = {
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  env: {
    node: true,
    browser: true
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential' // Priority A: Essential (Error Prevention)
  ],

  plugins: [
    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-files
    // required to lint *.vue files
    'vue'
  ]
}
