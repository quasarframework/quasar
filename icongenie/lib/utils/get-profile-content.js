const { resolve } = require('path')

const { warn } = require('./logger')
const { appDir } = require('./app-paths')

module.exports = function getProfileContent (profileFile) {
  const file = resolve(appDir, profileFile)

  try {
    return require(file)
  }
  catch (err) {
    warn(`Specified profile file has a syntax error`)
    console.error(err)
    process.exit(1)
  }
}
