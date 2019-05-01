const
  fs = require('fs'),
  { green } = require('chalk')

const
  appPaths = require('./app-paths')

module.exports = function (cfg) {
  let file, content, error = false

  file = appPaths.resolve.app(cfg.sourceFiles.indexHtmlTemplate)
  if (!fs.existsSync(file)) {
    console.log('⚠️  Missing /src/index.template.html file...')
    console.log()
    error = true
  }
  content = fs.readFileSync(file, 'utf-8')

  if (content.indexOf('<base href') > -1) {
    console.log(`⚠️  Please remove the tag below from /src/index.template.html
   This is taken care of by Quasar automatically.
  <base href="<%= htmlWebpackPlugin.options.appBase %>">
  `)
    console.log()
    error = true
  }

  file = appPaths.resolve.app(cfg.sourceFiles.rootComponent)
  content = fs.readFileSync(file, 'utf-8')
  if (content.indexOf('q-app') === -1) {
    console.log(`\n⚠️  Quasar requires a minor change to the root component:
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

  file = appPaths.resolve.app('babel.config.js')
  if (!fs.existsSync(file)) {
    console.log('⚠️  Missing babel.config.js file...')
    console.log()
    process.exit(1)
  }
}
