
var
  path = require('path'),
  shell = require('shelljs'),
  type = process.argv[2]

/*
  Build:
  * all: npm run build
  * js: npm run build js
  * css: npm run build css
 */

require('colors')

if (!type) {
  require('./script.clean.js')
  shell.mkdir('-p', path.join(__dirname, '../dist/'))
}

console.log(' Building Quasar...\n')

if (!type || type === 'js') {
  require('./script.build.javascript')
}
if (!type || type === 'css') {
  require('./script.build.stylus')
}
