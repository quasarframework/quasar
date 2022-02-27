const fs = require('fs')

const { warn } = require('./logger')
const appPaths = require('../app-paths')
const { entryPointMarkup, attachMarkup } = require('../helpers/html-template')

module.exports = function (cfg) {
  let file
  let content
  let error = false

  file = appPaths.resolve.app('index.html')
  content = fs.readFileSync(file, 'utf-8')

  if (content.indexOf(attachMarkup) !== -1) {
    warn(`Please remove ${ attachMarkup } from
    /index.html inside of <body>\n`)
    error = true
  }

  if (content.indexOf(entryPointMarkup) === -1) {
    warn(`Please add ${ entryPointMarkup } to
    /index.html inside of <body>\n`)
    error = true
  }

  if (error === true) {
    process.exit(1)
  }
}
