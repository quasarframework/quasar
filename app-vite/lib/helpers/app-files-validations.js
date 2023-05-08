const fs = require('fs')

const { warn } = require('./logger')
const appPaths = require('../app-paths')
const { entryPointMarkup, attachMarkup } = require('../helpers/html-template')

const file = appPaths.resolve.app('index.html')

module.exports = function (_cfg) {
  let valid = true

  if (fs.existsSync(file) === false) {
    warn('The file /index.html is missing. Please add it back.\n')
    return false
  }

  const content = fs.readFileSync(file, 'utf-8')

  if (content.indexOf(attachMarkup) !== -1) {
    warn(`Please remove ${ attachMarkup } from
    /index.html inside of <body>\n`)
    valid = false
  }

  if (content.indexOf(entryPointMarkup) === -1) {
    warn(`Please add ${ entryPointMarkup } to
    /index.html inside of <body>\n`)
    valid = false
  }

  return valid
}
