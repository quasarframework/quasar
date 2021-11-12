const fs = require('fs')

const { warn } = require('./logger')
const appPaths = require('../app-paths')

module.exports = function (cfg) {
  let file
  let content
  let error = false

  file = appPaths.resolve.app(cfg.sourceFiles.indexHtmlTemplate)
  content = fs.readFileSync(file, 'utf-8')

  if (content.indexOf('<base href') > -1) {
    warn(`Please remove the <base> tag from /src/index.template.html
   This is taken care of by Quasar automatically.
  `)
    error = true
  }

  if (content.indexOf('<div id="q-app') === -1) {
    warn(`Please add back <div id="q-app"></div> to
    /src/index.template.html inside of <body>\n`)
    error = true
  }

  if (error === true) {
    process.exit(1)
  }
}
