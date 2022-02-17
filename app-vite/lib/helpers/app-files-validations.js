const fs = require('fs')

const { warn } = require('./logger')
const appPaths = require('../app-paths')

module.exports = function (cfg) {
  let file
  let content
  let error = false

  file = appPaths.resolve.app(cfg.build.htmlFilename)
  content = fs.readFileSync(file, 'utf-8')

  if (content.indexOf('<!-- quasar:entry-point -->') === -1) {
    warn(`Please add <!-- quasar:entry-point --> to
    /${ cfg.build.htmlFilename } inside of <body>\n`)
    error = true
  }

  if (error === true) {
    process.exit(1)
  }
}
