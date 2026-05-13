import { defineConfig } from 'oxlint'

export default defineConfig({
  $schema: './node_modules/oxlint/configuration_schema.json',

  ignorePatterns: [
    '**/node_modules/',
    '**/dist/',
    '**/.quasar/',
    '**/quasar.config.*.temporary.compiled*',
    'playground/src-cordova/',
    'playground/src-capacitor/',
    'playground/src-ssr/',
    'playground/postcss.config.cjs'
  ],

  options: {
    typeAware: true,
    typeCheck: true,
    maxWarnings: 10
  },

  plugins: ['typescript', 'vue', 'import', 'eslint', 'promise', 'unicorn'],

  categories: {
    correctness: 'error'
    // style: 'error',
    // pedantic: 'warn',
    // suspicious: 'error',
    // perf: 'error',
    // restriction: 'error'
  },

  rules: {},

  env: {
    builtin: true
  }
})
