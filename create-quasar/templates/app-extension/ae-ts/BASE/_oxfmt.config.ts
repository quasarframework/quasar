import { defineConfig } from 'oxfmt'

export default defineConfig({
  $schema: './node_modules/oxfmt/configuration_schema.json',

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

  printWidth: 80,
  arrowParens: 'avoid',
  bracketSpacing: true,
  bracketSameLine: false,
  htmlWhitespaceSensitivity: 'strict',
  semi: true,
  singleQuote: false,
  quoteProps: 'as-needed',
  trailingComma: 'none',
  useTabs: false,
  vueIndentScriptAndStyle: false
})
