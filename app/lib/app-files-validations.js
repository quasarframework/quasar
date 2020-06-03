const fs = require('fs')
const { green } = require('chalk')

const appPaths = require('./app-paths')

module.exports = function (cfg) {
  let file
  let content
  let error = false

  file = appPaths.resolve.app(cfg.sourceFiles.rootComponent)
  content = fs.readFileSync(file, 'utf-8')
  if (content.indexOf('q-app') === -1) {
    console.log(`\n Quasar requires a minor change to the root component:
   ${file}

  Please add: id="q-app" (or write #q-app if using Pug)
  to the outermost HTML element of the template.

${green('Example:')}
  <template>
    <div id="q-app">
      ...
    </div>
  </template>
`)
    error = true
  }

  if (error) {
    process.exit(1)
  }
}
