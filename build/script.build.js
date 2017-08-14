
var
  path = require('path'),
  shell = require('shelljs'),
  type = process.argv[2]

/*
  Build:
  * all: npm run build
  * js & css without standalone: npm run build simple
  * js: npm run build js
  * js w/out standalone: npm run build js simple
  * css: npm run build css
  * css w/out standalone: npm run build css simple
 */

require('colors')

if (!type || type === 'simple') {
  require('./script.clean.js')
  shell.mkdir('-p', path.join(__dirname, '../dist/'))
}

console.log(' Building...\n')

if (!type || type === 'js') {
  require('./script.build.javascript')
}
if (!type || type === 'css') {
  require('./script.build.stylus')
}
