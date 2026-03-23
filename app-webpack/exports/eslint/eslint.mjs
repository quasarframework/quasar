const ignoreList = [
  'dist/*',
  'src-capacitor/*',
  'src-cordova/*',
  '.quasar/*',
  'quasar.config.*.temporary.compiled*'
]

export default {
  configs: {
    // using a function so we can add more configurable
    // stuff later if needed without breaking changes
    recommended() {
      return [{ ignores: ignoreList }]
    }
  }
}
