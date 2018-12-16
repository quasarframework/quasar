const
  logger = require('../../helpers/logger'),
  warn = logger('app:extension', 'red')

module.exports.getModule = (pkg, moduleName, required) => {
  let script

  try {
    script = require(pkg + '/' + moduleName)
  }
  catch (e) {
    if (required) {
      warn(`Extension ${moduleName} script missing for ${pkg}`)
      process.exit(1)
    }
  }

  return script
}

module.exports.pkgIsInstalled = (pkgName) => {
  try {
    require(pkgName)
  }
  catch (e) {
    return false
  }

  return true
}
