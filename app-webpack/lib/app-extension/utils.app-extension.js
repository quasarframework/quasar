module.exports.getBackwardCompatiblePackageName = function getBackwardCompatiblePackageName (packageName) {
  return packageName === '@quasar/app'
    ? '@quasar/app-webpack'
    : packageName
}
