const { existsSync, readFileSync } = require('node:fs')

const { warn } = require('./logger.js')
const { entryPointMarkup, attachMarkup } = require('../utils/html-template.js')

module.exports.appFilesValidations = function appFilesValidations (appPaths, sourceFiles) {
  const file = appPaths.resolve.app(
    sourceFiles.indexHtmlTemplate
  )

  if (existsSync(file) === false) {
    warn(`The file ${ sourceFiles.indexHtmlTemplate } is missing. Please add it back.\n`)
    return false
  }

  let valid = true
  const content = readFileSync(file, 'utf-8')

  if (content.indexOf(attachMarkup) !== -1) {
    warn(`Please remove ${ attachMarkup } from
       ${ sourceFiles.indexHtmlTemplate } inside of <body>\n`)
    valid = false
  }

  if (content.indexOf(entryPointMarkup) === -1) {
    warn(`Please add ${ entryPointMarkup } to
       ${ sourceFiles.indexHtmlTemplate } inside of <body>\n`)
    valid = false
  }

  return valid
}
