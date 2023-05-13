const fs = require('node:fs')

const { warn } = require('./logger.js')
const appPaths = require('../app-paths.js')
const { entryPointMarkup, attachMarkup } = require('../utils/html-template.js')

const file = appPaths.resolve.app('index.html')

module.exports.appFilesValidations = function appFilesValidations () {
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
