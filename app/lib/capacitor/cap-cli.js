const path = require('path')

const appPaths = require('../app-paths')
const getPackagePath = require('../helpers/get-package-path')
const getPackageJson = require('../helpers/get-package-json')

module.exports.capBin = path.join(
  getPackagePath('@capacitor/cli', appPaths.capacitorDir),
  '../../bin/capacitor'
)

const { version } = getPackageJson('@capacitor/cli', appPaths.capacitorDir)

module.exports.capVersion = parseInt(version.match(/^(\d)\./)[1], 10)
