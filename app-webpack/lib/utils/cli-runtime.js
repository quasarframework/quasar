const { join } = require('node:path')
const { readFileSync } = require('node:fs')

const cliDir = join(__dirname, '../..')

module.exports.cliDir = cliDir
module.exports.resolveToCliDir = function resolveToCliDir (dir) {
  return join(cliDir, dir)
}

module.exports.cliPkg = JSON.parse(
  readFileSync(
    join(__dirname, '../../package.json'),
    'utf-8'
  )
)
