const
  fs = require('fs'),
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

function createFolder (folder) {
  const dir = path.join(__dirname, '..', folder)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

if (!type) {
  require('./script.clean.js')
  shell.mkdir('-p', path.join(__dirname, '../dist/'))
}

console.log(' Building Quasar...\n')

createFolder('dist')
createFolder('dist/umd')

if (!type || type === 'js') {
  require('./script.build.javascript')
}
if (!type || type === 'css') {
  require('./script.build.stylus')
}
