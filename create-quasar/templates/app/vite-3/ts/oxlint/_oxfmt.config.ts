import { defineConfig } from 'oxfmt'

export default defineConfig({
  $schema: './node_modules/oxfmt/configuration_schema.json',

  ignorePatterns: [
    '**/node_modules/',
    'dist/',
    'quasar.config.*.temporary.compiled*',
    '.quasar/',
    'src-cordova/',
    'src-capacitor/',
    'src/router/typed-router.d.ts'
  ],

  printWidth: 80,
  arrowParens: 'avoid',
  bracketSpacing: true,
  bracketSameLine: false,
  htmlWhitespaceSensitivity: 'strict',
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'none',
  useTabs: false,
  vueIndentScriptAndStyle: false
})
