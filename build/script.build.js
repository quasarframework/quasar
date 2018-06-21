const
  type = process.argv[2],
  { createFolder } = require('./build.utils')

/*
  Build:
  * all: npm run build
  * js:  npm run build js
  * css: npm run build css
 */

console.log()

if (!type) {
  require('./script.clean.js')
}

console.log(` 📦 Building Quasar v${require('../package.json').version}...\n`)

createFolder('dist')
createFolder('dist/umd')

if (!type || type === 'js') {
  createFolder('dist/helper-json')
  require('./script.build.javascript')
}
if (!type || type === 'css') {
  require('./script.build.stylus')
}
